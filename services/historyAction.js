const History = require('../models/historyAction'); // Đảm bảo đường dẫn đúng

// Service để lưu lịch sử hành động
const saveHistory = async (deviceId, deviceName, action) => {
  try {
    const newHistory = await History.create({
      deviceId,
      deviceName,
      action,
      timestamp: new Date(),
    });
    return newHistory;
  } catch (error) {
    throw new Error('Failed to save history action: ' + error.message);
  }
};

const getDeviceByTime = async (startTime, endTime, page, pageSize) => {
  try {
    let condition = {};

    // Tạo điều kiện truy vấn dựa vào startTime và endTime
    if (startTime && endTime) {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      condition.createdAt = { $gte: startDate, $lte: endDate };
    }

    let histories = [];

    // Lấy tất cả dữ liệu nếu không có phân trang
    if (page === '' && pageSize === '') {
      histories = await History.find(condition);
      return { success: true, data: histories }; // Trả về dữ liệu
    }

    // Giới hạn số lượng bản ghi trả về và bỏ qua một số bản ghi dựa vào phân trang
    const limit = parseInt(pageSize) || 10; // Số bản ghi trên mỗi trang
    const skip = (parseInt(page) - 1) * limit || 0; // Số bản ghi bỏ qua

    // Truy vấn dữ liệu với createdAt nằm trong khoảng thời gian
    histories = await History.find(condition).skip(skip).limit(limit);

    return { success: true, data: histories };
  } catch (error) {
    // Bắt lỗi và trả về object có định dạng rõ ràng
    return { success: false, message: 'Failed to get device by time: ' + error.message };
  }
};
module.exports = {
  saveHistory,
  getDeviceByTime
};
