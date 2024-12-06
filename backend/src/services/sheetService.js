const getSheetData = async (doc, limit = 5) => {
    try {
      await doc.loadInfo(); 
      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows({ limit }); 
      const data = rows.map((row) => row._rawData); 
      return data; // Return the data
    } catch (err) {
      console.error("Error fetching sheet data:", err.message);
      throw new Error("Failed to fetch sheet data"); 
    }
  };
  
  export default { getSheetData };