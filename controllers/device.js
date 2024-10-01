const dataSensor = require('../models/dataSensor')
const { updateDataService, createDataService, getDataService } = require('../services/device')


// const createData = async(req, res) => {
//   try {
//     const response = await createDataService()
//     return res.status(200).json(response)
//    } catch (error) {
//         return res.status(400).json({
//             err: 1,
//             mess: error
//         })
//    }
// }


const updateData = async (req, res) => {
  try {
    const id = req.params.id
    const { action } = req.body
    // if(!action) return res.status(500).json({
    //   err: 1,
    //   mess: 'Missing input'
    // })
    const response = await updateDataService(req.body, id)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(400).json({
      err: 1,
      mess: error
    })
  }
}

const getData = async (req, res) => {
  try {
    const response = await getDataService()
    return res.status(200).json(response)
  } catch (error) {
    return res.status(400).json({
      err: 1,
      mess: error
    })
  }
}

const getDataByCondition = async (req, res) => {
  try {
    const { content, searchBy, orderBy, sortBy, page, pageSize } = req.query;

    let query = {};
    if (content && searchBy) {
      query[searchBy] = Number(content) // Tìm kiếm theo chuỗi có chứa content
    }

    const sortOptions = {};
    if (orderBy && sortBy) {
      sortOptions[orderBy] = sortBy.toLowerCase() === 'asc' ? 1 : -1; // Sắp xếp tăng dần hoặc giảm dần
    }

    const limit = parseInt(pageSize) || 10; // Số lượng bản ghi trên mỗi trang
    const skip = (parseInt(page) - 1) * limit || 0; // Bỏ qua số bản ghi cho việc phân trang

    // Thực hiện query
    const data = await dataSensor.find(query)
      .sort(sortOptions) // Sắp xếp
      .skip(skip) // Bỏ qua số bản ghi
      .limit(limit); // Giới hạn số bản ghi

    return res.status(200).json(data)
  } catch (error) {
    return res.status(400).json({
      err: 1,
      mess: error
    })
  }
}
module.exports = { updateData, getData, getDataByCondition }



