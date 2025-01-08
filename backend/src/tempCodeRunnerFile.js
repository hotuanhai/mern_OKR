import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { GoogleSpreadsheet } from 'google-spreadsheet';
// import { JWT } from 'google-auth-library';
// import exphbs from 'express-handlebars'; // Thêm express-handlebars
// import route from './routers/index.js';
// import sheetService from './services/sheetService.js';
// import mongodbService from './services/mongodbService.js';

// dotenv.config({ path: 'D:/project1/mern_OKR/backend/.env' });

// const app = express();
// const PORT = process.env.PORT || 3000;
// const MONGOURL = process.env.MONGO_URL;

// // Cấu hình Handlebars làm view engine
// app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
// app.set('view engine', 'hbs');
// app.set('views', 'D:/project1/mern_OKR/backend/src/resources/views'); // Đặt thư mục views
// // const route=require('./routers')
// // Định nghĩa route cho trang chủ
// // app.get('/', (req, res) => {
// //   res.render('news'); // Render file header.hbs trong thư mục views/partials
// // });
// route(app)
// // Kết nối MongoDB
// mongoose.connect(MONGOURL).then(async () => {
//   console.log('db is connected');
//   await mongodbService.initData(doc);
// });

// // Cấu hình Google Spreadsheet API
// const serviceAccountAuth = new JWT({
//   email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//   key: process.env.GOOGLE_PRIVATE_KEY,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// const doc = new GoogleSpreadsheet('10eGgVDsvfd_T0zRCZRwOPlXC2bLZ_scHQex1-IMuBdg', serviceAccountAuth);

// // Lắng nghe server
// app.listen(PORT, () => {
//   console.log('server is running on PORT:' + PORT);
// });