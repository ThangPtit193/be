const data = require('../models/dataSensor')

const getData = (limit, page, sort, filter) => (new Promise(async (resolve, reject) => {
  try {
    const totalData = await data.countDocuments();
    let response;

    if (filter) {
      response = await data.find({ [filter[0]]: { '$regex': filter[1] } }).lean().limit(limit).skip(limit * (page - 1));
    } else if (sort) {
      const order = Number(sort[1])
      const label = sort[0]
      response = await data.find().lean().limit(limit).skip(limit * (page - 1)).sort({ [label]: order });
    } else {
      response = await data.find().lean().limit(limit).skip(limit * (page - 1));
    }

    resolve({
      err: response ? 0 : 1,
      mess: response ? 'lấy tất cả sản phẩm thành công' : 'lấy tất cả sản phẩm thất bại',
      data: response,
      totalData: totalData,
      currentPage: page,
      totalPage: Math.ceil(totalData / limit)
    });
  } catch (error) {
    reject(error);
  }
}));

const createDataService = (body) => (new Promise(async (resolve, reject) => {
  try {
    const { light, temperature, humidity } = body
    const response = await data.create({
      light: light, temperature: temperature, humidity: humidity
    })
    resolve({
      err: response ? 0 : 1,
      data: response
    })
  } catch (error) {
    reject(error)
  }
}))

const getDataByCondition = async ({ content, searchBy, orderBy, sortBy, page, pageSize }) => {
  try {
    let query = {};

    // Nếu có content và searchBy, tạo điều kiện tìm kiếm
    if (content && searchBy) {
      query[searchBy] = Number(content); // Giả sử tìm kiếm theo số
    }

    const sortOptions = {};

    // Nếu có orderBy và sortBy, thêm điều kiện sắp xếp
    if (orderBy && sortBy) {
      sortOptions[orderBy] = sortBy.toLowerCase() === 'asc' ? 1 : -1; // Sắp xếp tăng hoặc giảm dần
    }

    const limit = parseInt(pageSize) || 10; // Số bản ghi trên mỗi trang
    const skip = (parseInt(page) - 1) * limit || 0; // Số bản ghi bỏ qua

    // Thực hiện query
    const dataSensor = await data.find(query)
      .sort(sortOptions) // Sắp xếp
      .skip(skip) // Bỏ qua số bản ghi
      .limit(limit); // Giới hạn số bản ghi

    return dataSensor; // Trả về dữ liệu
  } catch (error) {
    throw new Error(error); // Ném ra lỗi để controller xử lý
  }
};

module.exports = { getData, createDataService, getDataByCondition };