import ObjectiveModel from "../models/ObjectiveModel.js";
import IncorrectDataModel from "../models/IncorrectDataModel.js";
import sheetService from "./sheetService.js";
import KrModel from "../models/KRModel.js";
import KrConModel from "../models/KRConModel.js";
import UserSchemeModel from "../models/UserModel.js";
import sendUpdateEmail from './autoemail.js';
import { sendCompletionEmail } from "./emailServices.js";
const initData = async (doc) => {
  try {
    const sheetData = await sheetService.getSheetData(doc);
    
    if (!sheetData || sheetData.length === 0) {
      console.log("No data to init.");
      return;
    }
    // Format the data
    const columnMapping = await sheetService.getColumnMapping(doc);
    let formattedData = formatSheetData(sheetData,columnMapping);

    // Danh sách người dùng để kiểm tra
    const usersToCheck = new Map();

    for (let row of formattedData) {
      const { pic, signoffPerson } = row;

      // Thêm người vào danh sách kiểm tra
      if (pic && pic.length > 0) {
        pic.forEach(name => usersToCheck.set(name.trim(), { role: ['pic'] }));
      }
      if (signoffPerson) {
          const name = signoffPerson.trim();
          if (usersToCheck.has(name)) {
              usersToCheck.get(name).role.push('sign-off');
          } else {
              usersToCheck.set(name, { role: ['sign-off'] });
          }
      }
    }

    // Lưu danh sách người dùng vào UserScheme
    for (const [name, data] of usersToCheck) {
      try {
        const existingUser = await UserSchemeModel.findOne({ name });
        if (existingUser) {
            const newRoles = Array.from(new Set([...existingUser.role, ...data.role]));
            existingUser.role = newRoles;
            await existingUser.save();
        } else {
            await UserSchemeModel.create({ name, role: data.role });
        }
      } catch (err) {
          console.error(`Error saving user ${name}:`, err.message);
      }
    }

    // Tiếp tục xử lý các logic khác trong `initData`
    //push data to db
    let currentO, currentKR
    let listO = [], listKR = []
    let result
    for (let i = 0; i <= formattedData.length - 1; ++i) {
      if (formattedData[i].id.replace(/\s/g, '').includes('O-')) {
        result = await ObjectiveModel.create(formattedData[i])
        if(formattedData[i].okrState !== 'Bỏ'){
          await checkIncorrectData(formattedData[i], listO, listKR, 'Objective')
        }
        //set curent objective
        currentO = result._id
        listO.push(formattedData[i].id.replace(/\s/g, ''))
      }else if(formattedData[i].id.replace(/\s/g, '').includes('KR-')){
        formattedData[i].OId = currentO
        result = await KrModel.create(formattedData[i])
        if(formattedData[i].okrState !== 'Bỏ'){
          await checkIncorrectData(formattedData[i], listO, listKR, 'KR')
        }
        //set curent kr
        currentKR = result._id
        listKR.push(formattedData[i].id.replace(/\s/g, ''))
      }else{
        formattedData[i].KrId = currentKR
        if(formattedData[i].okrState !== 'Bỏ'){
          await checkIncorrectData(formattedData[i], listO, listKR, 'KR con')
        }
        result = await KrConModel.create(formattedData[i])        
      }

    }
    // const foundObjective = await Objective.findOne({ _id: currentO });
    // console.log(foundObjective)
  } catch (error) {
    console.error("Error initializing data:", error.message);
  }
}
export const updateData = async (oldRowData,newRowData,row) => {
  let oldData = formatSheetData(oldRowData)[0]
  let newData = formatSheetData(newRowData)[0]
  let daysave = new Date();
  // Find the item in ObjectiveModel
  let item = await ObjectiveModel.findOne({
    id: oldData.id,
    description: oldData.description,
  });
  // If not found in ObjectiveModel, check in KrModel
  if (!item) {
    item = await KrModel.findOne({
      id: oldData.id,
      description: oldData.description,
    });
  }
  // If not found in KrModel, check in KrConModel
  if (!item) {
    item = await KrConModel.findOne({
      id: oldData.id,
      description: oldData.description,
    });
  }
  if (item) {
    // Update fields with new data
    Object.assign(item, newData);
    await item.save();
    console.log(`Updated item with ID ${oldData.id} and description ${oldData.description}`);
    if (parseFloat(item.progress.replace('%', '').replace(',', '.')) >= 100) {
      await sendCompletionEmail(oldData._id,row);
    }
    await sendUpdateEmail(oldData, newData, oldData.signoffPerson, oldData.pic, daysave, oldData);
  }else {
    console.log('Item not found in any collection');
  }
}

export default { initData, updateData };

const parseDate = (dateStr) => {
  if (!dateStr) return null; // Handle undefined or null input
  const dateParts = dateStr.split('/'); // Split the string by "/"
  if (dateParts.length !== 3) return null; // Ensure format is correct
  const [day, month, year] = dateParts.map(part => parseInt(part, 10)); // Convert to integers
  if (!day || !month || !year) return null; // Validate parts
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`; // Construct Date in YYYY-MM-DD
};

const calculateWeight = (type) => {
  switch (type) {
    case 'Objective':
      return 6;
    case 'KR':
      return 2;
    case 'KR con':
      return 1;
    default:
      return 0; // Default weight if type is not recognized
  }
};

// const formatSheetData = (sheetData) => {
//   if (!Array.isArray(sheetData[0])) {
//     sheetData = [sheetData];
//   }
//   return sheetData.map(row => ({
//     id: row[0],
//     description: row[1],
//     pic: row[2] ? row[2].split("\n") : [],
//     role: row[3],
//     proposer: row[4],
//     startingValue: row[5],
//     targetValue: row[6],
//     currentValue: row[7],
//     okrState: row[8],
//     mandays: row[9] ? parseFloat(row[9]) : 0,
//     startDate: row[10] ? parseDate(row[10]) : null,
//     dueDate: row[11] ? parseDate(row[11]) : null,
//     doneDate: row[12] ? parseDate(row[12]) : null,
//     progress: row[29] === "Value-based" ? row[13] : row[15],
//     thang10Realtime: row[17],
//     thang10Thucte: row[20],
//     acceptanceCriteria: row[21],
//     result: row[22],
//     proof: row[23],
//     signoffPerson: row[24],
//     signoff: row[25],
//     signoffComment: row[26],
//     approvalStatus: row[27],
//     itemType: row[28],
//     krType1: row[29],
//     krType2: row[30],
//     krType3: row[31],
//     weight: (row[32] === '#REF!' || row[32] === '') ? calculateWeight(row[28]) : parseFloat(row[32])
//   }));
// };
const formatSheetData = (sheetData, columnMapping) => {
  if (!Array.isArray(sheetData[0])) {
    sheetData = [sheetData];
  }

  //chỉ càn match 1 phần , vs tháng10 realtime
  const getPartialValue = (columnMapping, value) => {
    const matchingColumns = Object.keys(columnMapping).filter(colName =>
      colName.toLowerCase().includes(value.toLowerCase()) // Match partial values
    );
  
    if (matchingColumns.length > 0) {
      const values = matchingColumns.map(colName => columnMapping[colName]).map(index => sheetData[0][index]);
      return values.join(', '); // Convert the array to a comma-separated string
    }
    return ''; // Return an empty string if no matches are found
  };

  return sheetData.map(row => {
    const getValue = (colName) => row[columnMapping[colName]];

    return {
      id: getValue('#'),
      description: getValue('Objective / Key Result'),
      pic: getValue('PIC') ? getValue('PIC').split("\n") : [],
      role: getValue('Role'),
      proposer: getValue('Người đề xuất'),
      startingValue: getValue('Starting Value'),
      targetValue: getValue('Target Value'),
      currentValue: getValue('Current Value'),
      okrState: getValue('Trạng thái OKR'),
      mandays: getValue('Mandays') ? parseFloat(getValue('Mandays')) : 0,
      startDate: getValue('Start Date') ? parseDate(getValue('Start Date')) : null,
      dueDate: getValue('Due Date') ? parseDate(getValue('Due Date')) : null,
      doneDate: getValue('Done Date') ? parseDate(getValue('Done Date')) : null,
      progress: getValue('KR Type 1') === "Value-based" ? getValue('Value-based\nProgress ') : getValue('Activity-based Progress'),
      thang10Realtime: getPartialValue(columnMapping, 'Realtime'),
      thang10Thucte: getPartialValue(columnMapping, 'Thực tế'),
      acceptanceCriteria: getValue('Tiêu chí nghiệm thu'),
      result: getValue('Kết quả thực hiện'),
      proof: getValue('Minh chứng kết quả thực hiện'),
      signoffPerson: getValue('Người sign-off'),
      signoff: getValue('Sign-off'),
      signoffComment: getValue('Sign-off comment'),
      approvalStatus: getValue('GĐ Khối phê duyệt'),
      itemType: getValue('Item Type'),
      krType1: getValue('KR Type 1'),
      krType2: getValue('KR Type 2'),
      krType3: getValue('KR Type 3'),
      weight: (getValue('Trọng số') === '#REF!' || getValue('Trọng số') === '') ? calculateWeight(getValue('Item Type')) : parseFloat(getValue('Trọng số'))
    };
  });
};
//data 
const genIncorrectData = (data,msg) => {
  return {
    id: data.id,
    description: data.description,
    error: msg
  };
};

async function checkIncorrectData(data, listO, listKR, expectedType) {
  await checkItemType(data, expectedType)
  await checkProgress(data)
  await checkValue(data)
  await checkDuplicatedId(data, listO, listKR)
}

async function checkItemType(data, expectedType) {
  if (data.itemType !== expectedType) {
    const msg = "Tên ID không giống với item type"
    const incorrectData = genIncorrectData(data, msg)
    await IncorrectDataModel.create(incorrectData)
  }
}

async function checkProgress(data){
  const progressValue = parseFloat(data.progress.replace(',', '.').replace('%', ''))
  if (progressValue > 100) {
    const msg = "progress và % tháng 10 realtime không thể vượt quá 100%";
    const incorrectData = genIncorrectData(data, msg);
    await IncorrectDataModel.create(incorrectData);
  }
}

async function checkValue(data) {
  const { startingValue, targetValue, currentValue } = data
  //if all 3 field is empty -> return
  const allEmpty = [startingValue, targetValue, currentValue].every(value => value === '')
  if (allEmpty) { return }
  
  //check if all not null field is the same type (number or percent)
  const nonEmptyValues = [startingValue, targetValue, currentValue]
      .filter(value => value !== '' && value !== null && value !== undefined)
  const isValid = isSameType(nonEmptyValues)
  if (!isValid) {
    const msg = "startingValue, targetValue, currentValue không cùng kiểu dữ liệu"
    const incorrectData = genIncorrectData(data, msg)
    await IncorrectDataModel.create(incorrectData)
  }
}
function isSameType(values) {
  const allNumbers = values.every(value => /^[0-9]+((\.[0-9]{3})+)?(,[0-9]+)?$/.test(value))
  const allPercentages = values.every(value => /^[0-9]+((\.[0-9]{3})+)?(,[0-9]+)?%$/.test(value))
  return allNumbers || allPercentages
}


async function checkDuplicatedId(data, listO, listKR) {
  const id = data.id.replace(/\s/g, '');

  if (id.includes('O-')) {
    if (listO.includes(id)) {
      const msg = "ID của Objectives bị trùng lặp";
      const incorrectData = genIncorrectData(data, msg);
      await IncorrectDataModel.create(incorrectData);
    }
  }else if (id.includes('KR-')) {
    if (listKR.includes(id)) {
      const msg = "ID của Key Result bị trùng lặp";
      const incorrectData = genIncorrectData(data, msg);
      await IncorrectDataModel.create(incorrectData);
    }
  }else{
    const existingItems = await KrConModel.find({ KrId: data.KrId })
    const isDuplicate = existingItems.some(item => item.id.replace(/\s/g, '') === id)
    if (isDuplicate) {
      const msg = "ID của KrCon bị trùng lặp";
      const incorrectData = genIncorrectData(data, msg);
      await IncorrectDataModel.create(incorrectData);
    }
  }
}



////






