const { saveHistory, getDeviceByTime } = require('../services/historyAction'); // Đảm bảo đường dẫn đúng

// Controller để lưu lịch sử hành động
const saveHistoryController = async (req, res) => {
  const { deviceId, deviceName, action } = req.body;

  try {
    const newHistory = await saveHistory(deviceId, deviceName, action);
    return res.status(201).json({ message: 'History action recorded', data: newHistory });
  } catch (error) {
    console.error('Error saving history:', error);
    return res.status(500).json({ message: error.message });
  }
};

const getDeviceHistoryByTime = async (req, res) => {
  try {
    // Lấy các tham số từ req.query
    const { startTime, page, pageSize } = req.query;

    // Gọi service để lấy dữ liệu
    const histories = await getDeviceByTime(startTime, page, pageSize);

    if (histories.success) {
      return res.status(200).json({
        success: true,
        message: 'Device history retrieved successfully',
        data: histories.data, // Đảm bảo data được trả về
      });
    } else {
      return res.status(400).json({
        success: false,
        message: histories.message, // Thông báo lỗi từ service
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve device history',
      error: error.message,
    });
  }
};

module.exports = {
  saveHistory: saveHistoryController,
  getDeviceHistoryByTime
};
