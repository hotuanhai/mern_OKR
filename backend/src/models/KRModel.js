import mongoose from "mongoose";

const krSchema = new mongoose.Schema({
    OId: String, // reference the id of parent Objective
    id: String, // can be duplicate
    description: String, 
    pic: [String], 
    role: String,
    proposer: String,
    startingValue: String, // int or %
    targetValue: String, // int or %
    currentValue: String, // int or %
    okrState: String, // '' or 'Bỏ'
    mandays: Number, 
    startDate: Date,
    dueDate: Date,
    doneDate: Date,
    progress: String, // %
    thang10Realtime: String, // %
    thang10Thucte: String, // %
    acceptanceCriteria: String,
    result: String,
    proof: String,
    signoffPerson: String, // get the email from here
    signoff: String, // 'Pass' or 'Fail'
    signoffComment: String,
    approvalStatus: String, // TRUE or FALSE
    itemType: String, // 'Objective', 'KR', 'KR con' 
    krType1: String, // 'Value-based' , 'Activity-based'
    krType2: String, // 'Input'  ,'Output','Outcome'
    krType3: String, // 'Aspirational', 'Commited'
    weight: Number,// int or null
  }, { timestamps: true });

const KrModel = mongoose.model ("Kr", krSchema); 
export default KrModel;