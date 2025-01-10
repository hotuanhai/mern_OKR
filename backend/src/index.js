import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import exphbs from 'express-handlebars'; // Thêm express-handlebars
import route from './routers/index.js';
import sheetService from './services/sheetService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import ngrok from 'ngrok';
// dotenv.config({ path: 'D:/project1/mern_OKR/backend/.env' });
dotenv.config();
// const handlebars = require('handlebars');
import handlebars from 'handlebars'; 
// Đăng ký helper getIframeSrc
handlebars.registerHelper('getIframeSrc', function(OId) {
  const srcMapping = {
    "677ea3087b8682299f5b5b72": "http://localhost:3000/public/question/d294fe0c-3c6b-4f55-b3fe-87863a363c0d",
"677ea3097b8682299f5b5bb1": "http://localhost:3000/public/question/dd0fc7f4-087d-45f5-b4f2-4af028ac23cd",
"677ea30a7b8682299f5b5bfd": "http://localhost:3000/public/question/840a3ccd-f472-4fdb-9514-bb6f2efb87fe",
"677ea30c7b8682299f5b5c55": "http://localhost:3000/public/question/6b3917ed-3b4d-436e-a683-723a138d5af7",
"677ea30d7b8682299f5b5c99": "http://localhost:3000/public/question/18cccbab-a50c-489a-9e57-1b20a28f5481",
"677ea30f7b8682299f5b5cc7": "http://localhost:3000/public/question/44ea9309-a66e-4379-a5a1-c85c6531f351",
"677ea3097b8682299f5b5bb1": "http://localhost:3000/public/question/f1e984fb-4dbd-41d6-990d-81caff9c4bb5",
"677ea3117b8682299f5b5d22": "http://localhost:3000/public/question/37235aa0-4aeb-4d23-b430-3481062fc156",
"677ea30a7b8682299f5b5bfd": "http://localhost:3000/public/question/c05a7dcd-8070-45ac-9c32-44e196dfffe6",
"677ea3087b8682299f5b5b74": "http://localhost:3000/public/question/648fe4a2-f40b-4030-9ee6-ff53499bb21a",
"677ea3087b8682299f5b5b84": "http://localhost:3000/public/question/94954d57-badb-44de-8eb3-e84bb7dd6218",
"677ea3087b8682299f5b5b8f": "http://localhost:3000/public/question/55e56245-dfaa-4c32-8ea4-b856e224a101",
"677ea3097b8682299f5b5ba2": "http://localhost:3000/public/question/f8ec05d3-18ed-45de-9e0b-499b69d3e9cf",
"677ea30d7b8682299f5b5c9b": "http://localhost:3000/public/question/ef0011c0-6ddb-4f40-8e80-87ccdcde5ab2",
"677ea30b7b8682299f5b5c2a": "http://localhost:3000/public/question/a9416048-6e6b-4972-aad6-470402d97dbf",
"677ea3127b8682299f5b5d67": "http://localhost:3000/public/question/febb29ca-51c9-4236-8992-dcfeea603591",
"677ea3127b8682299f5b5d4e": "http://localhost:3000/public/question/c304fbf0-7db6-47f7-8008-82b27ae4f0a3",
"677ea3117b8682299f5b5d34": "http://localhost:3000/public/question/7e98c00b-c3a4-4b25-b80b-c859879281cb",
"677ea3117b8682299f5b5d26": "http://localhost:3000/public/question/f54bafc5-b7e3-4cf5-bd0d-5be0ce7368cc",
"677ea3107b8682299f5b5d0f": "http://localhost:3000/public/question/2970af87-ddf4-44bb-8e66-13260571e902",
"677ea3107b8682299f5b5cf7": "http://localhost:3000/public/question/4f0f5056-3655-4fdf-9eaa-2a9e88b70092",
"677ea30f7b8682299f5b5cde": "http://localhost:3000/public/question/b8005d90-dfe3-4abb-88b7-65b95402fda7",
"677ea30f7b8682299f5b5ccb": "http://localhost:3000/public/question/ddadf355-0ba8-4da9-9447-8fe8c229693c",
"677ea30e7b8682299f5b5cb5": "http://localhost:3000/public/question/1dd142a3-1e7c-4d69-a37b-9d5af5364a1b",
"677ea30d7b8682299f5b5c82": "http://localhost:3000/public/question/4c1b3ee9-5ba8-4469-bd42-a4d10148fc6e",
"677ea30c7b8682299f5b5c70": "http://localhost:3000/public/question/771f7923-1cad-45c2-b5bc-fb06a920522e",
"677ea30c7b8682299f5b5c59": "http://localhost:3000/public/question/a2e283b7-fd92-4ce3-ab83-17c15a230945",
"677ea30b7b8682299f5b5c3a": "http://localhost:3000/public/question/779d0bbc-888c-402d-b3e2-6804910f8033",
"677ea30b7b8682299f5b5c32": "http://localhost:3000/public/question/e100bca6-3e9e-4a70-a262-8a459faec486",
"677ea30b7b8682299f5b5c2a": "http://localhost:3000/public/question/63ab6a86-e043-4c9a-a682-d1c64288a4f8",
"677ea30b7b8682299f5b5c19": "http://localhost:3000/public/question/d638a2d2-e689-4d6b-8f97-d542c4a3622d",
"677ea30a7b8682299f5b5c01": "http://localhost:3000/public/question/c05a32a0-0363-42d9-8739-584e2c576aac",
"677ea30a7b8682299f5b5bde": "http://localhost:3000/public/question/e6211b7c-e21c-43fa-b31d-2d1b57e8c2fd",
"677ea3097b8682299f5b5bcd": "http://localhost:3000/public/question/a036c7c7-3cc0-4cd0-ae9f-5d08e05c4984",
"677ea3097b8682299f5b5bc1": "http://localhost:3000/public/question/971af8af-15bf-45f8-9585-c8ff4a0c41b3",
"677ea3097b8682299f5b5bb5": "http://localhost:3000/public/question/bfb7fb6c-a3fc-401f-8283-b8212356ef53",

    
  };

  return srcMapping[OId] || ''; // Trả về giá trị tương ứng hoặc chuỗi rỗng nếu không có
});

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;
const MONGOURL = process.env.MONGO_URL;
// Cau hinh connect ggsheet

// Cấu hình Handlebars làm view engine
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
// app.set('views', 'D:/project1/mern_OKR/backend/src/resources/views'); // Đặt thư mục views
app.set('views', path.join(__dirname, 'resources/views'));
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
app.listen(PORT, async () => {
  console.log('server is running on PORT:' + PORT);
  const url = await ngrok.connect(PORT);
  console.log(`ngrok tunnel created: ${url}`);
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
