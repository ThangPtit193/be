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

const getDeviceByTime = async (startTime, page, pageSize) => {
  try {
    let condition = {};

    // Tạo điều kiện truy vấn dựa vào startTime và endTime
    if (startTime) {
      if (startTime.includes('/') && startTime.split('/').length === 2) {
        // Xử lý trường hợp chỉ có ngày và tháng (ví dụ: "09/10")
        const [day, month] = startTime.split('/');
        const currentYear = new Date().getFullYear();
        const startDate = new Date(`${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00+07:00`);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        condition = {
          createdAt: {
            $gte: startDate,
            $lt: endDate
          }
        };
      } else if (startTime.includes('/') && !startTime.includes(':')) {
        // Xử lý trường hợp chỉ có ngày tháng năm (ví dụ: "09/10/2024")
        const [day, month, year] = startTime.split('/');
        const startDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00+07:00`);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        condition = {
          createdAt: {
            $gte: startDate,
            $lt: endDate
          }
        };
      } else if (startTime.includes('/') && startTime.includes(':')) {
        // Xử lý trường hợp ngày giờ đầy đủ (ví dụ: "09/10/2024 14:34:59")
        const [datePart, timePart] = startTime.split(' ');
        const [day, month, year] = datePart.split('/');
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}+07:00`;
        const searchDate = new Date(isoDate);

        condition = {
          createdAt: {
            $gte: searchDate,
            $lt: new Date(searchDate.getTime() + 1000) // Thêm 1 giây
          }
        };
      } else {
        // Xử lý trường hợp chỉ có giờ (ví dụ: "14:34")
        condition = {
          $expr: {
            $regexMatch: {
              input: { 
                $dateToString: { 
                  format: "%H:%M", 
                  date: "$createdAt",
                  timezone: "+07:00"
                } 
              },
              regex: startTime
            }
          }
        };
      }
    }

    console.log("Điều kiện tìm kiếm:", condition);


    let histories = [];

    // Nếu không có phân trang, trả về tất cả dữ liệu và sắp xếp theo thời gian giảm dần
    if (page === '' && pageSize === '') {
      histories = await History.find(condition).sort({ createdAt: -1 }); // Sắp xếp giảm dần
      return { success: true, data: histories }; // Trả về dữ liệu
    }

    // Giới hạn số lượng bản ghi trả về và bỏ qua một số bản ghi dựa vào phân trang
    const limit = parseInt(pageSize) || 10; // Số bản ghi trên mỗi trang
    const skip = (parseInt(page) - 1) * limit || 0; // Số bản ghi bỏ qua

    // Truy vấn dữ liệu với createdAt nằm trong khoảng thời gian và sắp xếp giảm dần
    histories = await History.find(condition).sort({ createdAt: -1 }).skip(skip).limit(limit);

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
