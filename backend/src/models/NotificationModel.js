import mongoose from "mongoose";

// Schema cho thông báo gửi email
const NotificationSchema = new mongoose.Schema(
    {
        sender: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",  // Liên kết đến người gửi (người PIC)
            required: true 
        },
        receiver: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",  // Liên kết đến người nhận (người sign off)
            required: false
        },
        subject: { 
            type: String, 
            required: true 
        },
        message: { 
            type: String, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ["pending", "sent", "failed","sent_late"], 
            default: "pending" 
        },
        sentAt: { 
            type: Date 
        },
        retryCount: { 
            type: Number, 
            default: 0 
        },
        attachments: [{ 
            type: String 
        }],
        point: { 
            type: Number, 
            default: 0 
        },
    }, 
    { timestamps: true }
);

// Middleware: tự động cập nhật sentAt khi trạng thái là "sent"
NotificationSchema.pre("save", function (next) {
    if (this.isModified("status") && this.status === "sent") {
        this.sentAt = new Date();
    }
    next();
});

// Tạo index cho sender và receiver để tối ưu truy vấn
NotificationSchema.index({ sender: 1, receiver: 1 });

const NotificationModel = mongoose.model("Notification", NotificationSchema);
export default NotificationModel;
