import mongoose from "mongoose";

const warningSchema = new mongoose.Schema({
    id: String, // can be duplicate
    description: String, 
    error: String 
  }, { timestamps: true });

const WarningModel = mongoose.model ("Warning", warningSchema); 
export default WarningModel;