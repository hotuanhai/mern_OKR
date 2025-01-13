const getSheetData = async (doc,offset = 3) => {
    try {
      await doc.loadInfo(); 
      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows({ offset }); 
      const data = rows
            .map((row) => row._rawData)
            .filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ""))
      return data; // Return the data
    } catch (err) {
      console.error("Error fetching sheet data:", err.message);
      throw new Error("Failed to fetch sheet data"); 
    }
  };
  
  const getRowNames = async (doc) => {
    try {
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      const rowNames = await sheet.getRows({ limit: 1, offset: 1 }); 
      return rowNames[0]._rawData; 
    } catch (err) {
      console.error("Error fetching row names:", err.message);
      throw new Error("Failed to fetch row names");
    }
  };
  
  const getColumnMapping = async (doc) => {
    try {
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      const rowNames = await sheet.getRows({ limit: 1, offset: 1 });
      const columnNames = rowNames[0]._rawData;
  
      // Build a mapping of column names to indices
      const columnMapping = columnNames.reduce((acc, colName, index) => {
        acc[colName] = index;
        return acc;
      }, {});
      return columnMapping;
    } catch (err) {
      console.error("Error fetching column names:", err.message);
      throw new Error("Failed to fetch column names");
    }
  };
  export default { getSheetData, getRowNames, getColumnMapping };
