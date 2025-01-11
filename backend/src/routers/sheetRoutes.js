import express from 'express';
import mongodbService from '../services/mongodbService.js';
const sheetRouter = express.Router();

sheetRouter.post('/', (req, res) => {
    const updatedData = req.body; // Contains row, oldRowData, and newRowData
    console.log('Received updated data:', updatedData);

    const { row, oldRowData, newRowData } = updatedData;

    // Log the updated row information
    console.log(`Row ${row} updated:`);
    console.log('Old Row Data:', oldRowData);
    console.log('New Row Data:', newRowData);

    mongodbService.updateData(oldRowData,newRowData)

});

export default sheetRouter;
