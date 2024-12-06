import mongoose from "mongoose";

const objectiveSchema = new mongoose.Schema({
    id: String, // can be duplicate
    description: String, 
    pic: String, 
    proposer: String,
    startingValue: String, // int or %
    targetValue: String, // int or %
    currentValue: String, // int or %
    okrState: String, // '' or 'Bỏ'
    mandays: Number, 
    startDate: Date,
    dueDate: Date,
    doneDate: Date,
    valueBasedProgress: String, // %
    activityBasedProgress: String, // %
    thang10Realtime: String, // %
    valueBased: String, // %
    activityBased: String, // %
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

const Objective = mongoose.model ("Objective", objectiveSchema); 
export default Objective;