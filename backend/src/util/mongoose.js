

// module.exports={
//     multipleMongooseToObject : function(mongoose){
//         return mongoose.map(mongoose=>mongoose.toObject())

//     },
//     mongooseToObject : function(mongoose){
//         return mongoose ? mongoose.toObject(): mongoose
//     }

// }
export const multipleMongooseToObject = (mongoose) => 
    mongoose.map((item) => item.toObject());

export const mongooseToObject = (mongoose) =>
    mongoose ? mongoose.toObject() : mongoose;
