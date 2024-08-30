const data = require('../models/dataSensor')

const getData = () => (new Promise(async(resolve,reject)=> {
  try {
      const response = await data.find()
      resolve({
          err: response ? 0 : 1,
          mess: response ? 'Lấy nhiệt độ,độ ẩm thành công' : 'lấy nhiệt độ, độ ẩm thất bại',
          data: response ? response : null
      })
  } catch (error) {
      reject(error)
  }
}))

module.exports = {getData};