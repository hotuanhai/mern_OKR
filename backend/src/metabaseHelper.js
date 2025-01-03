import jwt from 'jsonwebtoken';

const createSignedEmbedURL = (questionId, baseUrl, secretKey) => {
  const payload = {
    resource: { question: questionId }, // Hoặc { dashboard: dashboardId }
    params: {}, // Thêm tham số nếu cần
    exp: Math.round(Date.now() / 1000) + (60 * 10) // Hết hạn sau 10 phút
  };

  const token = jwt.sign(payload, secretKey);
  return `${baseUrl}/embed/question/${token}#bordered=true&titled=true`;
};

export default createSignedEmbedURL;
