import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import exphbs from 'express-handlebars'; // Thêm express-handlebars
import route from './routers/index.js';
import sheetService from './services/sheetService.js';
import mongodbService from './services/mongodbService.js';


dotenv.config({ path: 'D:/project1/mern_OKR/backend/.env' });
// const handlebars = require('handlebars');
import handlebars from 'handlebars'; 
// Đăng ký helper getIframeSrc
handlebars.registerHelper('getIframeSrc', function(OId) {
  const srcMapping = {
    "67763ae0122bb6a4bbe70371": "http://localhost:3000/public/question/351a27c7-1ff2-4b1e-bcd5-08e279c1d158",
    "67763ae3122bb6a4bbe703fc": "http://localhost:3000/public/question/ffd66cdd-2947-4697-bc07-429d54918b80",
    "67763ae1122bb6a4bbe703b0": "http://localhost:3000/public/question/c7b13f5b-6a69-4dcd-b3b1-c3bca89523ef",
    "67763ae5122bb6a4bbe70454": "http://localhost:3000/public/question/a4d34ab3-16fc-47b1-8e8a-eae897fa0565",
    "67763ae7122bb6a4bbe70498": "http://localhost:3000/public/question/d6da88d6-bfb0-4748-a3f2-348f5f77788f",
    "67763ae8122bb6a4bbe704c6": "http://localhost:3000/public/question/c0d626b4-2dff-4e10-8950-47799a843eb4",
    "67763aea122bb6a4bbe70521": "http://localhost:3000/public/question/4131cab0-1820-4bae-bcf5-f53cb9be142b",
    "67763ae0122bb6a4bbe70373": "http://localhost:3000/public/question/63ab2477-468b-4cf5-aeb5-6db64301a6fd",
    "67763ae0122bb6a4bbe70383": "http://localhost:3000/public/question/0087b433-01a5-4d22-9be4-d3543201ac85",
    "67763ae1122bb6a4bbe7038e": "http://localhost:3000/public/question/f5944422-a880-4573-a5c0-f59efdaea0d5",
    "67763ae1122bb6a4bbe703a1": "http://localhost:3000/public/question/94a0adab-3365-4a8c-a3db-06eed722e341",
    "67763ae1122bb6a4bbe703b4": "http://localhost:3000/public/question/1b9cd950-9ffc-4522-ac66-74d6f48c13ee",
    "67763ae2122bb6a4bbe703c0": "http://localhost:3000/public/question/e0f9ddd0-692c-4601-8147-e02a685d69db",
    "67763ae2122bb6a4bbe703cc": "http://localhost:3000/public/question/57b97f73-440f-408d-8f9d-02874b6aeeb7",
    "67763ae2122bb6a4bbe703dd": "http://localhost:3000/public/question/79f75cc8-692b-42c7-8c1e-0767ca202dbd",
    "67763ae3122bb6a4bbe70400": "http://localhost:3000/public/question/23b3a38b-0501-4395-8260-12f8ab460521",
    "67763ae4122bb6a4bbe70418": "http://localhost:3000/public/question/cb26a78d-d858-4fa8-854d-ee61f66fc518",
    "67763ae4122bb6a4bbe70429": "http://localhost:3000/public/question/0e7250fa-811d-4f8e-88e4-d82faa71080c",
    "67763ae4122bb6a4bbe70431": "http://localhost:3000/public/question/104e3ba6-9cda-43f2-966c-52564a0763fe",
    "67763ae5122bb6a4bbe70439": "http://localhost:3000/public/question/529489da-da83-4bb7-9416-997750268171",
    "67763ae5122bb6a4bbe70458": "http://localhost:3000/public/question/92c10b1e-dde9-4e8a-8f41-bd93bb5a5293",
    "67763ae6122bb6a4bbe7046f": "http://localhost:3000/public/question/bebed42b-8091-4c96-acb0-ce2e64322d2e",
    "67763ae6122bb6a4bbe70481": "http://localhost:3000/public/question/aa5a6ea5-f682-462e-992e-79d18b7f4fe7",
    "67763ae7122bb6a4bbe7049a": "http://localhost:3000/public/question/fd0357c2-3c21-43c2-8815-4d7e75e040b2",
    "67763ae7122bb6a4bbe704b4": "http://localhost:3000/public/question/e874e347-bc60-401e-9231-3aba82b9deb6",
    "67763ae8122bb6a4bbe704ca": "http://localhost:3000/public/question/98f15854-a102-4383-a377-5ccd0f53366e",
    "67763ae8122bb6a4bbe704dd": "http://localhost:3000/public/question/487c21a8-885f-44dc-9866-5826fbff4270",
    "67763ae9122bb6a4bbe704f6": "http://localhost:3000/public/question/dbaf82ff-2eec-4c26-b494-4e2ac3fe4bef",
    "67763aea122bb6a4bbe7050e": "http://localhost:3000/public/question/3b23b9ce-4646-4afd-9ba5-d5b51f86a41c",
    "67763aea122bb6a4bbe70525": "http://localhost:3000/public/question/a4b4607f-312c-4e74-9e37-5f40db3b72d1",
    "67763aeb122bb6a4bbe70533": "http://localhost:3000/public/question/d6791191-a0d8-435e-9410-46627367f790",
    "67763aec122bb6a4bbe7054d": "http://localhost:3000/public/question/a51bcf39-a063-4a76-9adf-c1928dddbca3",
    "67763aec122bb6a4bbe70566": "http://localhost:3000/public/question/4ddbfece-a33e-443e-bf2f-469337db4f97",
    


    
  };

  return srcMapping[OId] || ''; // Trả về giá trị tương ứng hoặc chuỗi rỗng nếu không có
});

const app = express();
const PORT = process.env.PORT || 3001;
const MONGOURL = process.env.MONGO_URL;

// Cấu hình Handlebars làm view engine
app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', 'D:/project1/mern_OKR/backend/src/resources/views'); // Đặt thư mục views
// const route=require('./routers')
// Định nghĩa route cho trang chủ
// app.get('/', (req, res) => {
//   res.render('news'); // Render file header.hbs trong thư mục views/partials
// });
route(app)
// Kết nối MongoDB
mongoose.connect(MONGOURL).then(async () => {
  console.log('db is connected');
  //await mongodbService.initData(doc);
});

// Cấu hình Google Spreadsheet API
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet('10eGgVDsvfd_T0zRCZRwOPlXC2bLZ_scHQex1-IMuBdg', serviceAccountAuth);

// Lắng nghe server
app.listen(PORT, () => {
  console.log('server is running on PORT:' + PORT);
});
// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { GoogleSpreadsheet } from 'google-spreadsheet';
// import { JWT } from 'google-auth-library';
// import exphbs from 'express-handlebars'; // Thêm express-handlebars
// import route from './routers/index.js';
// import sheetService from './services/sheetService.js';
// import mongodbService from './services/mongodbService.js'; // Giữ nguyên import

// dotenv.config({ path: 'D:/project1/mern_OKR/backend/.env' });

// const app = express();
// const PORT = process.env.PORT || 3003;
// const MONGOURL = process.env.MONGO_URL;

// // Cấu hình Handlebars làm view engine
// app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
// app.set('view engine', 'hbs');
// app.set('views', 'D:/project1/mern_OKR/backend/src/resources/views'); // Đặt thư mục views

// // Định nghĩa route
// route(app);

// // Kết nối MongoDB
// mongoose.connect(MONGOURL).then(async () => {
//   console.log('db is connected');
//   const doc = new GoogleSpreadsheet('10eGgVDsvfd_T0zRCZRwOPlXC2bLZ_scHQex1-IMuBdg');
//   await mongodbService.initData(doc);  // Gọi hàm initData từ mongodbService.js
// });

// // Cấu hình Google Spreadsheet API
// const serviceAccountAuth = new JWT({
//   email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//   key: process.env.GOOGLE_PRIVATE_KEY,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// // Lắng nghe server
// app.listen(PORT, () => {
//   console.log('server is running on PORT:' + PORT);
// });
