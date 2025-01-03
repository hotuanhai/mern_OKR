import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Định nghĩa các giá trị vai trò
const roles = ['admin', 'user', 'pic', 'sign-off'];

// Hàm loại bỏ dấu tiếng Việt
const removeVietnameseTones = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, ' ').trim();
};

// Hàm hỗ trợ tạo email từ tên
const generateEmail = (name) => {
    if (!name) return null;
    const normalizedName = removeVietnameseTones(name); // Loại bỏ dấu
    const words = normalizedName.split(' ').filter(word => word); // Loại bỏ khoảng trắng thừa
    const lastName = words.pop(); // Lấy họ cuối cùng
    const initials = words.length > 0
        ? words.map(word => word.charAt(0).toLowerCase()).join('') // Lấy ký tự đầu mỗi từ
        : ''; // Nếu chỉ có một từ, không cần lấy ký tự đầu
    return `${lastName.toLowerCase()}${initials}@vbee.ai`.toLowerCase(); // Chuyển toàn bộ về chữ thường
};

// Schema cho người dùng
const UserScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true // Loại bỏ khoảng trắng thừa
    },
    role: {
        type: [String], // Hỗ trợ nhiều vai trò
        enum: roles,
        required: true,
        default: ['pic'], // Mặc định là `pic`
    },
    email: {
        type: String,
        unique: true, // Đảm bảo không trùng lặp email
        sparse: true, // Chấp nhận giá trị null nếu không yêu cầu email
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Regex để kiểm tra định dạng email
    },
    pass_mail: {
        type: String,
        required: false,
        select: false // Không trả về giá trị này khi query
    }
}, { timestamps: true });

// Middleware: Tự động tạo email và thêm vai trò mặc định trước khi lưu
UserScheme.pre('save', function (next) {
    if (!this.email && this.name) {
        this.email = generateEmail(this.name); // Tạo email từ tên nếu email không được cung cấp
    }
    if (!this.role || this.role.length === 0) {
        this.role = ['pic']; // Gán vai trò mặc định là `pic` nếu không có vai trò nào
    }
    next();
});

// Middleware: Mã hóa mật khẩu trước khi lưu
UserScheme.pre('save', async function (next) {
    if (this.isModified('pass_mail') && this.pass_mail) {
        const salt = await bcrypt.genSalt(10);
        this.pass_mail = await bcrypt.hash(this.pass_mail, salt);
    }
    next();
});

// Model
const UserSchemeModel = mongoose.model("User", UserScheme);

export default UserSchemeModel;
