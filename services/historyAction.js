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

module.exports = {
  saveHistory,
};
