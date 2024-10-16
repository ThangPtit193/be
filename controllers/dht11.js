const { createDataService, getDataByCondition } = require('../services/dht11')

const getAllData = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query
    const response = await getData(Number(limit) || 1, Number(page) || 1, sort, filter)
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      err: 1,
      mess: error
    })
  }
}

const createData = async (req, res) => {
  try {
    const { light, temperature, humidity, fog } = req.body
    // if(!light || !temperature || !humidity) return res.status(500).json({
    //   err: 1,
    //   mess:"missing input"
    // })
    const response = await createDataService(req.body)
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      err: 1,
      mess: error
    })
  }
}



const getDataWithCondition = async (req, res) => {
  try {
    // Lấy các tham số từ query string
    const { content, searchBy, orderBy, sortBy, page, pageSize } = req.query;

    // Gọi service để lấy dữ liệu với các điều kiện
    const dataSensor = await getDataByCondition({
      content,
      searchBy,
      orderBy,
      sortBy,
      page,
      pageSize,
    });

    // Trả về kết quả thành công với dữ liệu
    return res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: dataSensor.data,
    });
  } catch (error) {
    // Xử lý lỗi nếu service ném ra lỗi
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve data',
      error: error.message,
    });
  }
};

module.exports = { getAllData, createData, getDataWithCondition }

