// import nodemailer from 'nodemailer';
// import UserSchemeModel from '../models/UserModel.js';
// import KrModel from '../models/KRModel.js';
// import ObjectiveModel from "../models/ObjectiveModel.js";
// import KrConModel from "../models/KRConModel.js";


// // Cấu hình transporter cho nodemailer
// // const transporter = nodemailer.createTransport({
// //     service: 'gmail', // Hoặc dịch vụ email khác bạn đang sử dụng
// //     auth: {
// //         // user: process.env.EMAIL_USER, // Email của bạn
// //         // pass: process.env.EMAIL_PASS, // Mật khẩu email hoặc mật khẩu ứng dụng
        
// //     },
// // });
// // Hàm gửi email đến người sign-off
// export const sendCompletionEmail = async (krId) => {
//     try {
//         // Tìm KR theo ID
//         const kr = await KrModel.findById(krId);
        
//         if (!kr) {
//             throw new Error('Không tìm thấy KR với ID này.');
//         }

//         // Lấy thông tin người "pic" từ KR
//         const usersend = await UserSchemeModel.findOne({ name: kr.pic });
        
//         if (!usersend) {
//             throw new Error('Không tìm thấy thông tin người "pic".');
//         }

//         // Cấu hình transporter cho nodemailer với email của người "pic"
//         const transporter = nodemailer.createTransport({
//             service: 'gmail', // Hoặc dịch vụ email khác bạn đang sử dụng
//             auth: {
//                 user: usersend.email,
//                 pass: usersend.pass, // Sử dụng mật khẩu ứng dụng hoặc mật khẩu của người "pic"
//             },
//         });

//         // Nếu tìm thấy trong KR, gửi email cho người sign-off
//         const signoffName = kr.signoffPerson;
//         const result = await sendEmailToSignoffPerson(signoffName, transporter, kr.id);

//         if (result.success) {
//             return { success: true, message: 'Email đã được gửi thành công.' };
//         }

//         // Nếu không tìm thấy trong KR, thử tìm trong ObjectiveModel
//         const objective = await ObjectiveModel.findOne({ krId });
//         if (objective) {
//             const signoffName = objective.signoffPerson;
//             return await sendEmailToSignoffPerson(signoffName, transporter, kr.id);
//         }

//         // Nếu không tìm thấy trong ObjectiveModel, thử tìm trong KrConModel
//         const krCon = await KrConModel.findOne({ krId });
//         if (krCon) {
//             const signoffName = krCon.signoffPerson;
//             return await sendEmailToSignoffPerson(signoffName, transporter, kr.id);
//         }

//         // Nếu không tìm thấy trong bất kỳ mô hình nào
//         throw new Error('Không tìm thấy KR, Objective hoặc KRCon với ID này.');
//     } catch (error) {
//         console.error('Lỗi khi tìm dữ liệu KR/Objective/KRCon:', error);
//         return { success: false, message: error.message };
//     }
// };

// // Hàm gửi email đến người sign-off
// const sendEmailToSignoffPerson = async (signoffName, transporter, krId) => {
//     try {
//         // Tìm người sign-off trong UserSchemeModel
//         const user = await UserSchemeModel.findOne({ name: signoffName });

//         if (!user || !user.email) {
//             throw new Error('Không tìm thấy email của người sign-off.');
//         }

//         // Cấu hình email
//         const mailOptions = {
//             from: user.email, // Email của người "pic"
//             to: user.email, // Người sign-off nhận email, có thể thay đổi nếu muốn gửi đến email khác
//             subject: 'Thông báo hoàn thành công việc',
//             text: `Công việc với ID ${krId} đã hoàn thành. Vui lòng kiểm tra lại công việc!`,
//         };

//         // Gửi email
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email đã được gửi:', info.response);

//         return { success: true, message: 'Email đã được gửi thành công.' };
//     } catch (error) {
//         console.error('Lỗi khi gửi email:', error);
//         return { success: false, message: error.message };
//     }
// };


// import nodemailer from 'nodemailer';
// import UserSchemeModel from '../models/UserModel.js';
// import KrModel from '../models/KRModel.js';
// import ObjectiveModel from "../models/ObjectiveModel.js";
// import KrConModel from "../models/KRConModel.js";
// import NotificationModel from "../models/NotificationModel.js"; // Import NotificationModel

// // Hàm gửi email đến người sign-off
// export const sendCompletionEmail = async (krId) => {
//     try {
//         // Tìm KR theo ID
//         const kr = await KrModel.findById(krId)||await KrConModel.findById(krId)||await ObjectiveModel.findById(krId);
//         // const kr = await KrConModel.findById(krId);
//         // const kr = await ObjectiveModel.findById(krId);
//         if (!kr) {
//             throw new Error('Không tìm thấy KR với ID này.');
//         }

//         // Lấy thông tin người "pic" từ KR
//         const usersend = await UserSchemeModel.findOne({ name: kr.pic });
//         if (!usersend) {
//             throw new Error('Không tìm thấy thông tin người "pic".');
//         }

//         // Cấu hình transporter cho nodemailer với email của người "pic"
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 // user: usersend.email,
//                 // pass: usersend.pass, // Sử dụng mật khẩu ứng dụng hoặc mật khẩu của người "pic"
//                 user: 'baolong081104@gmail.com',
//                 pass: 'sugi azhu mxpz snjy',
//             },
//         });

//         // Nếu tìm thấy trong KR, gửi email cho người sign-off
//         const signoffName = kr.signoffPerson;
//         const result = await sendEmailToSignoffPerson(signoffName, transporter, kr.id, usersend._id);

//         if (result.success) {
//             return { success: true, message: 'Email đã được gửi thành công.' };
//         }

//         // Nếu không tìm thấy trong KR, thử tìm trong ObjectiveModel
//         const objective = await ObjectiveModel.findOne({ krId });
//         if (objective) {
//             const signoffName = objective.signoffPerson;
//             return await sendEmailToSignoffPerson(signoffName, transporter, kr.id, usersend._id);
//         }

//         // Nếu không tìm thấy trong ObjectiveModel, thử tìm trong KrConModel
//         const krCon = await KrConModel.findOne({ krId });
//         if (krCon) {
//             const signoffName = krCon.signoffPerson;
//             return await sendEmailToSignoffPerson(signoffName, transporter, kr.id, usersend._id);
//         }

//         // Nếu không tìm thấy trong bất kỳ mô hình nào
//         throw new Error('Không tìm thấy KR, Objective hoặc KRCon với ID này.');
//     } catch (error) {
//         console.error('Lỗi khi tìm dữ liệu KR/Objective/KRCon:', error);
//         return { success: false, message: error.message };
//     }
// };
// const calculatePoints = (dueDate, sentAt, weight) => {
//     const daysLate = Math.ceil((sentAt - dueDate) / (1000 * 60 * 60 * 24));
    
//     // Nếu không trễ hạn (hoàn thành trước hoặc đúng hạn)
//     if (daysLate <= 0) return weight;
    
//     // Trễ hạn trong 5 ngày
//     if (daysLate <= 5) return weight * 0.8;

//     // Trễ hạn sau 5 ngày
//     return weight * 0.3;
// };

// // Hàm gửi email đến người sign-off và lưu thông báo
// const sendEmailToSignoffPerson = async (signoffName, transporter, krId, senderId) => {
//     try {
//         // Tìm người sign-off trong UserSchemeModel
//         const user = await UserSchemeModel.findOne({ name: signoffName });

//         if (!user || !user.email) {
//             throw new Error('Không tìm thấy email của người sign-off.');
//         }

//         // Cấu hình email
//         const mailOptions = {
//             // from: user.email, // Email của người "pic"
//             // to: user.email,   // Người sign-off nhận email, có thể thay đổi nếu muốn gửi đến email khác
//             from: 'baolong081104@gmail.com',
//             to:    'baolong081104@gmail.com',            
//             subject: 'Thông báo hoàn thành công việc',
//             text: `Công việc với ID ${krId} đã hoàn thành. Vui lòng kiểm tra lại công việc!`,
//         };

//         // Gửi email
//         const info = await transporter.sendMail(mailOptions);
  
//         const point = calculatePoints(krId.dueDate, new Date(), krId.weight);
//         // Lưu thông tin email vào NotificationModel
//         await NotificationModel.create({
//             sender: senderId,
//             receiver: user._id,
//             subject: mailOptions.subject,
//             message: mailOptions.text,
//             status: "sent",
//             sentAt: new Date(),
//             point: point,
//         });

//         return { success: true, message: 'Email đã được gửi và lưu thông báo thành công.' };
//     } catch (error) {
//         console.error('Lỗi khi gửi email:', error);

//         // Lưu thông báo với trạng thái thất bại
//         await NotificationModel.create({
//             sender: senderId,
//             receiver: null,
//             subject: 'Thông báo lỗi',
//             message: `Không thể gửi email đến ${signoffName}. Lỗi: ${error.message}`,
//             status: "failed",
//             sentAt: null,
//             point:0,
//         });

//         return { success: false, message: error.message };
//     }
// };


import nodemailer from 'nodemailer';
import UserSchemeModel from '../models/UserModel.js';
import KrModel from '../models/KRModel.js';
import ObjectiveModel from "../models/ObjectiveModel.js";
import KrConModel from "../models/KRConModel.js";
import NotificationModel from "../models/NotificationModel.js"; // Import NotificationModel

// Hàm gửi email đến người sign-off
export const sendCompletionEmail = async (krId) => {
    try {
        // Tìm KR theo ID
        const kr = await KrModel.findById(krId) || await KrConModel.findById(krId) || await ObjectiveModel.findById(krId);
        if (!kr) {
            throw new Error('Không tìm thấy KR với ID này.');
        }

        // Lấy thông tin người "pic" từ KR
        const usersend = await UserSchemeModel.findOne({ name: kr.pic });
        if (!usersend) {
            throw new Error('Không tìm thấy thông tin người "pic".');
        }
            

            // Cấu hình transporter cho nodemailer với email của người "pic"
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: usersend.email,
                    pass: usersend.pass, // Sử dụng mật khẩu ứng dụng hoặc mật khẩu của người "pic"
                    
                },
            });

        // Nếu tìm thấy trong KR, gửi email cho người sign-off
        const signoffName = kr.signoffPerson;
        const result = await sendEmailToSignoffPerson(signoffName, transporter, kr, usersend._id,usersend.email);

        if (result.success) {
            return { success: true, message: 'Email đã được gửi thành công.' };
        }

        // Nếu không tìm thấy trong KR, thử tìm trong ObjectiveModel
        const objective = await ObjectiveModel.findOne({ krId });
        if (objective) {
            const signoffName = objective.signoffPerson;
            return await sendEmailToSignoffPerson(signoffName, transporter, kr, usersend._id,usersend.email);
        }

        // Nếu không tìm thấy trong ObjectiveModel, thử tìm trong KrConModel
        const krCon = await KrConModel.findOne({ krId });
        if (krCon) {
            const signoffName = krCon.signoffPerson;
            return await sendEmailToSignoffPerson(signoffName, transporter, kr, usersend._id,usersend.email);
        }

        // Nếu không tìm thấy trong bất kỳ mô hình nào
        throw new Error('Không tìm thấy KR, Objective hoặc KRCon với ID này.');
    } catch (error) {
        console.error('Lỗi khi tìm dữ liệu KR/Objective/KRCon:', error);
        return { success: false, message: error.message };
    }
};


const calculatePoints = (dueDate, sentAt, weight) => {
    const daysLate = Math.ceil((sentAt - dueDate) / (1000 * 60 * 60 * 24));
    
    // Nếu không trễ hạn (hoàn thành trước hoặc đúng hạn)
    if (daysLate <= 0) return weight;
    
    // Trễ hạn trong 5 ngày
    if (daysLate <= 5) return weight * 0.8;

    // Trễ hạn sau 5 ngày
    return weight * 0.3;
};

// Hàm gửi email đến người sign-off và lưu thông báo
const sendEmailToSignoffPerson = async (signoffName, transporter, kr, senderId,emailsend) => {
    try {
        // Tìm người sign-off trong UserSchemeModel
        const user = await UserSchemeModel.findOne({ name: signoffName });

        if (!user || !user.email) {
            throw new Error('Không tìm thấy email của người sign-off.');
        }

        // Cấu hình email
        const mailOptions = {
            // from: 'baolong081104@gmail.com',
            from: emailsend,
            to: user.email,  // Gửi email đến người sign-off
            subject: 'Thông báo hoàn thành công việc',
            text: `Công việc với ID ${kr.id} với nội dung ${kr.description} đã hoàn thành. Vui lòng kiểm tra lại công việc!`,
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);

        // Tính điểm dựa trên ngày hết hạn và thời gian gửi
        const point = calculatePoints(new Date(kr.dueDate), new Date(), kr.weight);
        // console.log(point);
        let status = "sent";  // Mặc định là sent
        if (point < kr.weight) {
            status = "sent_late";  // Nếu trễ hạn, trạng thái là sent_late
        }
        // Lưu thông tin email vào NotificationModel
        await NotificationModel.create({
            sender: senderId,
            receiver: user._id,
            subject: mailOptions.subject,
            message: mailOptions.text,
            status: "sent",
            sentAt: new Date(),
            point: point,
        });

        return { success: true, message: 'Email đã được gửi và lưu thông báo thành công.' };
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);

        // Lưu thông báo với trạng thái thất bại
        await NotificationModel.create({
            sender: senderId,
            receiver: null,
            subject: 'Thông báo lỗi',
            message: `Không thể gửi email đến ${signoffName}. Lỗi: ${error.message}`,
            status: "failed",
            sentAt: null,
            point: 0,  // Không tính điểm khi gửi thất bại
        });

        return { success: false, message: error.message };
    }
};
