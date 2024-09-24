const { saveHistory } = require('../services/historyAction'); // Đảm bảo đường dẫn đúng

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

module.exports = {
  saveHistory: saveHistoryController,
};
