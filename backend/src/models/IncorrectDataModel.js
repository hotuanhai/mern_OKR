import mongoose from "mongoose";

const incorrectDataSchema = new mongoose.Schema({
    id: String, // can be duplicate
    description: String, 
    error: String 
  }, { timestamps: true });

const IncorrectDataModel = mongoose.model ("IncorrectData", incorrectDataSchema); 
export default IncorrectDataModel;