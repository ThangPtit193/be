const device = require('../models/device')

const createDataService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const numDoc = await device.countDocuments();
      if (numDoc > 0) {
        return resolve({ success: true, message: 'Đã tồn tại dữ liệu' });
      }

      const devices = [
        { name: 'Fan' },
        { name: 'TV' },
        { name: 'Bulb' },
        { name: 'Alert'}
      ];

      const responses = await Promise.all(
        devices.map(deviceData => device.create(deviceData))
      );

      resolve({
        success: true,
        data: responses, // Trả về mảng các document đã tạo
      });
    } catch (error) {
      reject({
        success: false,
        error: error.message, // Trả về thông báo lỗi
      });
    }
  });
};


const updateDataService = (body, id) => (new Promise(async (resolve, reject) => {
  try {
    const { action } = body
    const response = await device.findByIdAndUpdate({ _id: id }, { action }, { new: true }
    )
    resolve({
      err: response ? 0 : 1,
      data: response ? response : null
    })
  } catch (error) {
    reject(error)
  }
}))

const getDataService = () => (new Promise(async (resolve, reject) => {
  try {
    const response = await device.find()
    resolve({
      err: response ? 0 : 1,
      data: response ? response : null
    })
  } catch (error) {
    reject(error)
  }
}))


module.exports = { updateDataService, createDataService, getDataService };