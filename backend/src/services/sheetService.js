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
  
export default { getSheetData };
