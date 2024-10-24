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
  const convertInput = (input) => {

    if (input.includes('/')) {
      const parts = input.split(' '); 
      const datePart = parts[0];      
      const timePart = parts[1];     
      const dateParts = datePart.split('/'); 

      if (dateParts.length === 3 && timePart) {
        
        const [day, month, year] = dateParts;
        const formattedTime = convertInput(timePart);
        
        return `${year}-${month}-${day}T${formattedTime}`; 
      } else if (dateParts.length === 3) {
       
        const [day, month, year] = dateParts;
        return `${year}-${month}-${day}`;  
      } else if (dateParts.length === 2) {
       
        const [day, month] = dateParts;
        return `${month}-${day}`;
      }
    }
    
    if (input.includes(':')) {
      
      if (input.split(':').length === 3) {
        let [hours, minutes, seconds] = input.split(':');
        hours = parseInt(hours);
  
       
        if (hours >= 7) {
          hours -= 7;
        } else {
          hours += 17;
        }
  
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      else if (input.split(':').length === 2) {
        let [hours, minutes] = input.split(':');
        hours = parseInt(hours);
  
        if (hours >= 7) {
          hours -= 7;
        } else {
          hours += 17;
        }
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
  
    
    return null;
  };
  
  try {
    // Lấy tất cả các bản ghi, bao gồm cả createdAt, id, và name
    const histories = await History.find({}, { createdAt: 1, deviceId: 1, deviceName: 1, action: 1 }).sort({ createdAt: -1 });

    if (histories.length === 0) {
      console.log('No data found');
      return { success: false, message: 'No data found' };
    }

    // Kiểm tra nếu startTime tồn tại, thì lọc dữ liệu theo startTime
    let filteredHistories = histories;
    if (startTime) {
      filteredHistories = histories.filter(item => {
        const isoDateString = item.createdAt.toISOString();
        return isoDateString.includes(convertInput(startTime)); // Sử dụng includes để tìm kiếm startTime trong chuỗi ISO
      });
    }
    if(!startTime){
      return { success: true, data: filteredHistories };
    }

    if (page === '' && pageSize === '') {
           // Sắp xếp giảm dần
          return { success: true, data: filteredHistories }; // Trả về dữ liệu
        }
    
    filteredHistories.forEach(item => {
      console.log(`createdAt: ${item.createdAt.toISOString()}, id: ${item.deviceId}, name: ${item.deviceName}`);
    });

    // Xử lý phân trang
    const limit = parseInt(pageSize) || 10; // Số bản ghi trên mỗi trang
    const skip = (parseInt(page) - 1) * limit || 0; // Số bản ghi bỏ qua

    const paginatedData = filteredHistories.slice(skip, skip + limit);
    return { success: true, data: paginatedData };
  } catch (error) {
    console.log('Failed to get device by time:', error.message);
    return { success: false, message: 'Failed to get device by time: ' + error.message };
  }
};

module.exports = {
  saveHistory,
  getDeviceByTime
};
