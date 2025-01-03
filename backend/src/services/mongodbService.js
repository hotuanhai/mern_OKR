import ObjectiveModel from "../models/ObjectiveModel.js";
import IncorrectDataModel from "../models/IncorrectDataModel.js";
import sheetService from "./sheetService.js";
import KrModel from "../models/KRModel.js";
import KrConModel from "../models/KRConModel.js";
import WarningModel from "../models/WarningModel.js";

const initData = async (doc) => {
  try {
    // Fetch data from Google Sheets
    const sheetData = await sheetService.getSheetData(doc);
    //console.log("Data fetched from Google Sheets:", sheetData);

    if (!sheetData || sheetData.length === 0) {
      console.log("No data to init.");
      return;
    }

    // Format the data (if required) before inserting into MongoDB
    let formattedData = formatSheetData(sheetData)
    console.log(formattedData.length)

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

const clearData = async () => {
  try {
    const deletedObjectives = await ObjectiveModel.deleteMany({});
    console.log(`Deleted ${deletedObjectives.deletedCount} objectives.`);

    const deletedKRs = await KrModel.deleteMany({});
    console.log(`Deleted ${deletedKRs.deletedCount} key results.`);

    const deletedKRCons = await KrConModel.deleteMany({});
    console.log(`Deleted ${deletedKRCons.deletedCount} KR children.`);

    const deletedIncorrectData = await IncorrectDataModel.deleteMany({});
    console.log(`Deleted ${deletedIncorrectData.deletedCount} incorrect data entries.`);
  } catch (error) {
    console.error("Error clearing data:", error.message);
  }
};

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

const formatSheetData = (sheetData) => {
  return sheetData.map(row => ({
    id: row[0],
    description: row[1],
    pic: row[2] ? row[2].split("\n") : [],
    role: row[3],
    proposer: row[4],
    startingValue: row[5],
    targetValue: row[6],
    currentValue: row[7],
    okrState: row[8],
    mandays: row[9] ? parseFloat(row[9]) : 0,
    startDate: row[10] ? parseDate(row[10]) : null,
    dueDate: row[11] ? parseDate(row[11]) : null,
    doneDate: row[12] ? parseDate(row[12]) : null,
    progress: row[29] === "Value-based" ? row[13] : row[15],
    thang10Realtime: row[17],
    thang10Thucte: row[20],
    acceptanceCriteria: row[21],
    result: row[22],
    proof: row[23],
    signoffPerson: row[24],
    signoff: row[25],
    signoffComment: row[26],
    approvalStatus: row[27],
    itemType: row[28],
    krType1: row[29],
    krType2: row[30],
    krType3: row[31],
    weight: (row[32] === '#REF!' || row[32] === '' || isNaN(parseFloat(row[32]))) ? calculateWeight(row[28]) : parseFloat(row[32])
  }));
};

//data 
const genIncorrectData = (data,msg) => {
  return {
    id: data.id,
    description: data.description,
    error: msg
  };
};

async function checkDoneDate( data) {
  const today = new Date()
  if(new Date(formattedData[i].doneDate) <= today && formattedData[i].proof === ''){
    const msg = "Done date không hợp lệ (chưa có Minh chứng kết quả thực hiện)"
    const incorrectData = genIncorrectData(formattedData[i], msg)
    await WarningModel.create(incorrectData)
  }
}

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
  if (allEmpty) {
    return
  }
  
  //check if all not null field is the same type (number or percent)
  const nonEmptyValues = [startingValue, targetValue, currentValue]
      .filter(value => value !== '' && value !== null && value !== undefined)
  const isValid = isSameType(nonEmptyValues)
  if (!isValid) {
    //console.log(startingValue, targetValue, currentValue)
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

const mongodbService = { clearData, initData };
export default mongodbService;