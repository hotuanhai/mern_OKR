// emailService.js
import nodemailer from 'nodemailer';
import UserSchemeModel from '../models/UserModel.js';
// Thiết lập dịch vụ gửi email
const transporter = nodemailer.createTransport({
  service: 'gmail', // Hoặc dịch vụ email bạn sử dụng
  auth: {
    user:
    // pass: 
  }
});
/**
 * Gửi email cập nhật dữ liệu
 * @param {Object} oldData - Dữ liệu cũ
 * @param {Object} newData - Dữ liệu mới
 * @param {String} signoffName - Tên người ký duyệt
 * @param {String} pic - Người phụ trách chính (Person In Charge)
 * @param {Date} daysave - Ngày lưu
 * @param {String} kr - Key Result liên quan
 */
const sendUpdateEmail = async (oldData, newData, signoffName, pic, daysave, kr) => {
  try {
    const user = await UserSchemeModel.findOne({ name: signoffName });
    const userpic = await UserSchemeModel.findOne({ name: pic });
    if (!user || !user.email) {
      throw new Error('Không tìm thấy email của người sign-off.');
    }
    if (!userpic || !userpic.email) {
      throw new Error('Không tìm thấy email của người phụ trách.');
    }
    // Thiết lập nội dung email cho người phụ trách chính
    const mailOptionsPic = {
      from: 'baolong081104@gmail.com',
      to: userpic.email,
      subject: 'Thông báo: Dữ liệu đã được cập nhật',
      text: `Dữ liệu đã được cập nhật:\n\nOld Data:\n${JSON.stringify(oldData, null, 2)}\n\nNew Data:\n${JSON.stringify(newData, null, 2)}`
    };
    // Thiết lập nội dung email cho người ký duyệt
    const mailOptionsSignoff = {
      from: 
      to: user.email,
      subject: 'Thông báo: Dữ liệu đã được cập nhật',
      text: `Dữ liệu đã được cập nhật:\n\nOld Data:\n${JSON.stringify(oldData, null, 2)}\n\nNew Data:\n${JSON.stringify(newData, null, 2)}`
    };
    // Gửi email
    await transporter.sendMail(mailOptionsPic);
    await transporter.sendMail(mailOptionsSignoff);
    console.log('Email thông báo đã được gửi.');
  } catch (error) {
    console.error('Không thể gửi email:', error);
  }
};
export default sendUpdateEmail;
