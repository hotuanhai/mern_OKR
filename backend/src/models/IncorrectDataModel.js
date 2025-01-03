import mongoose from "mongoose";

const incorrectDataSchema = new mongoose.Schema({
    id: String, // can be duplicate
    description: String, 
    error: String ,
    mailSentAt: { type: Date, default: null }, // Thời gian gửi mail
    status: { type: String, default: 'Pending' } // Trạng thái (Pending, Pass)
  }, { timestamps: true });

const IncorrectDataModel = mongoose.model ("IncorrectData", incorrectDataSchema); 
export default IncorrectDataModel;