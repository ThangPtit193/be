const device = require('../models/device')

const updateDeviceService = (id, data) => (new Promise(async(resolve,reject)=> {
  try {
      const response = await device.findByIdAndUpdate({_id : id},data,{new: true}  
    )
      resolve({
          err: response ? 0 : 1,
          mess: response ? 'Lấy nhiệt độ,độ ẩm thành công' : 'lấy nhiệt độ, độ ẩm thất bại',
          data: response ? response : null
      })
  } catch (error) {
      reject(error)
  }
}))

module.exports = {updateDeviceService};