import express from 'express';
import { sendCompletionEmail } from '../services/emailServices.js';

const router = express.Router(); // Khởi tạo router

// Endpoint để gửi email
router.post('/send-email/:krId', async (req, res) => {
    const { krId } = req.params;

    try {
        const result = await sendCompletionEmail(krId);
        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(400).json({ error: result.message });
        }
    } catch (error) {
        console.error('Lỗi trong route gửi email:', error);
        res.status(500).json({ error: 'Lỗi máy chủ khi gửi email.' });
    }
});

export default router; // Export router
