import express from 'express';
import siteRouter from './site.js';
import emailRouter from './emailRoutes.js'; // Import emailRouter
import Objective from '../models/ObjectiveModel.js';
import Kr from '../models/KRModel.js';
import Krcon from '../models/KRConModel.js';

function route(app) {
    app.use('/', siteRouter); // Đăng ký siteRouter
    app.use('/api', emailRouter); // Đăng ký emailRouter, sử dụng prefix '/api'
    
    // API Express
    app.get('/api/get-kr-detail/:id', (req, res) => {
        const krId = req.params.id;

        // Thực hiện lần lượt các truy vấn
        Promise.all([
            Objective.findById(krId),
            Kr.findById(krId),
            Krcon.findById(krId),
        ])
        .then(results => {
            const [objective, kr, krcon] = results;

            // Kiểm tra từng model nếu có kết quả
            if (objective) {
                return res.json(objective);
            } else if (kr) {
                return res.json(kr);
            } else if (krcon) {
                return res.json(krcon);
            } else {
                return res.status(404).json({ error: 'Không tìm thấy KR' });
            }
        })
        .catch(err => {
            console.error('Lỗi khi truy vấn KR:', err);
            res.status(500).json({ error: 'Lỗi server' });
        });
    });
}

export default route; // Sử dụng export default
