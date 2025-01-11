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
        let formattedData = formatSheetData(sheetData);
        const usersToCheck = new Map();
        for (let row of formattedData) {
            const { pic, signoffPerson } = row;
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
        let currentO, currentKR;
        let listO = [], listKR = [];
        let result;
        for (let i = 0; i <= formattedData.length - 1; ++i) {
            if (formattedData[i].id.replace(/\s/g, '').includes('O-')) {
                result = await ObjectiveModel.create(formattedData[i]);
                if (formattedData[i].okrState !== 'Bỏ') {
                    await checkIncorrectData(formattedData[i], listO, listKR, 'Objective');
                }
                currentO = result._id;
                listO.push(formattedData[i].id.replace(/\s/g, ''));
            } else if (formattedData[i].id.replace(/\s/g, '').includes('KR-')) {
                formattedData[i].OId = currentO;
                result = await KrModel.create(formattedData[i]);
                if (formattedData[i].okrState !== 'Bỏ') {
                    await checkIncorrectData(formattedData[i], listO, listKR, 'KR');
                }
                currentKR = result._id;
                listKR.push(formattedData[i].id.replace(/\s/g, ''));
            } else {
                formattedData[i].KrId = currentKR;
                if (formattedData[i].okrState !== 'Bỏ') {
                    await checkIncorrectData(formattedData[i], listO, listKR, 'KR con');
                }
                result = await KrConModel.create(formattedData[i]);
            }
        }
    } catch (error) {
        console.error("Error initializing data:", error.message);
    }
};
const updateData = async (oldRowData, newRowData) => {
    let oldData = formatSheetData(oldRowData)[0];
    let newData = formatSheetData(newRowData)[0];
    let daysave = new Date();
    let item = await ObjectiveModel.findOne({
        id: oldData.id,
        description: oldData.description,
    });
    if (!item) {
        item = await KrModel.findOne({
            id: oldData.id,
            description: oldData.description,
        });
    }
    if (!item) {
        item = await KrConModel.findOne({
            id: oldData.id,
            description: oldData.description,
        });
    }
    if (item) {
        Object.assign(item, newData);
        await item.save();
        console.log(`Updated item with ID ${oldData.id} and description ${oldData.description}`);
        if (parseFloat(item.progress.replace('%', '').replace(',', '.')) >= 100) {
            await sendCompletionEmail(item._id);
        }
        await sendUpdateEmail(oldData, newData, item.signoffPerson, item.pic, daysave, item);
    } else {
        console.log('Item not found in any collection');
    }
};
export { initData, updateData };
const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const dateParts = dateStr.split('/');
    if (dateParts.length !== 3) return null;
    const [day, month, year] = dateParts.map(part => parseInt(part, 10));
    if (!day || !month || !year) return null;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
            return 0;
    }
};
const formatSheetData = (sheetData) => {
    if (!Array.isArray(sheetData[0])) {
        sheetData = [sheetData];
    }
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
        weight: (row[32] === '#REF!' || row[32] === '') ? calculateWeight(row[28]) : parseFloat(row[32])
    }));
};
const genIncorrectData = (data, msg) => {
    return {
        id: data.id,
        description: data.description,
        error: msg
    };
};
async function checkIncorrectData(data, listO, listKR, expectedType) {
    await checkItemType(data, expectedType);
    await checkProgress(data);
    await checkValue(data);
    await checkDuplicatedId(data, listO, listKR);
}
async function checkItemType(data, expectedType) {
    if (data.itemType !== expectedType) {
        const msg = "Tên ID không giống với item type";
        const incorrectData = genIncorrectData(data, msg);
        await IncorrectDataModel.create(incorrectData);
    }
}
async function checkProgress(data) {
    const progressValue = parseFloat(data.progress.replace(',', '.').replace('%', ''));
    if (progressValue > 100) {
        const msg = "progress và % tháng 10 realtime không thể vượt quá 100%";
        const incorrectData = genIncorrectData(data, msg);
        await IncorrectDataModel.create(incorrectData);
    }
}
async function checkValue(data) {
    const { startingValue, targetValue, currentValue } = data;
    const allEmpty = [startingValue, targetValue, currentValue].every(value => value === '');
    if (allEmpty) return;
    const nonEmptyValues = [startingValue, targetValue, currentValue].filter(value => value !== '' && value !== null && value !== undefined);
    const isValid = isSameType(nonEmptyValues);
    if (!isValid) {
        const msg = "startingValue, targetValue, currentValue không cùng kiểu dữ liệu";
        const incorrectData = genIncorrectData(data, msg);
        await IncorrectDataModel.create(incorrectData);
    }
}
function isSameType(values) {
    const allNumbers = values.every(value => /^[0-9]+((\.[0-9]{3})+)?(,[0-9]+)?$/.test(value));
    const allPercentages = values.every(value => /^[0-9]+((\.[0-9]{3})+)?(,[0-9]+)?%$/.test(value));
    return allNumbers || allPercentages;
}
async function checkDuplicatedId(data, listO, listKR) {
    const id = data.id.replace(/\s/g, '');
    if (id.includes('O-')) {
        if (listO.includes(id)) {
            const msg = "ID của Objectives bị trùng lặp";
            const incorrectData = genIncorrectData(data, msg);
            await IncorrectDataModel.create(incorrectData);
        }
    } else if (id.includes('KR-')) {
        if (listKR.includes(id)) {
            const msg = "ID của KRs bị trùng lặp";
            const incorrectData = genIncorrectData(data, msg);
            await IncorrectDataModel.create(incorrectData);
        }
    }
}
// export default {
//     initData,
//     updateData,
// };