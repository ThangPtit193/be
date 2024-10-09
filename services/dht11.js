const dataSensor = require('../models/dataSensor')

// const getData = (limit, page, sort, filter) => (new Promise(async (resolve, reject) => {
//   try {
//     const totalData = await data.countDocuments();
//     let response;

//     if (filter) {
//       response = await data.find({ [filter[0]]: { '$regex': filter[1] } }).lean().limit(limit).skip(limit * (page - 1));
//     } else if (sort) {
//       const order = Number(sort[1])
//       const label = sort[0]
//       response = await data.find().lean().limit(limit).skip(limit * (page - 1)).sort({ [label]: order });
//     } else {
//       response = await data.find().lean().limit(limit).skip(limit * (page - 1));
//     }

//     resolve({
//       err: response ? 0 : 1,
//       mess: response ? 'lấy tất cả sản phẩm thành công' : 'lấy tất cả sản phẩm thất bại',
//       data: response,
//       totalData: totalData,
//       currentPage: page,
//       totalPage: Math.ceil(totalData / limit)
//     });
//   } catch (error) {
//     reject(error);
//   }
// }));

const createDataService = (body) => (new Promise(async (resolve, reject) => {
  try {
    const { light, temperature, humidity } = body
    const response = await dataSensor.create({
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
    // Nếu có content và searchBy, tạo điều kiện tìm kiếm theo searchBy
    if (content) {
      if (searchBy) {
        query[searchBy] = isNaN(Number(content)) ? content : Number(content); // Chuyển đổi sang số nếu có thể
      } else {
        // Nếu không có searchBy, tìm kiếm content trong các trường cụ thể
        query = {
          $or: [
            { temperature: isNaN(Number(content)) ? undefined : Number(content) }, // Nếu content là số, tìm kiếm trong nhiệt độ
            { humidity: isNaN(Number(content)) ? undefined : Number(content) },    // Tương tự cho độ ẩm
            { light: isNaN(Number(content)) ? undefined : Number(content) }        // Tương tự cho ánh sáng
          ].filter(cond => Object.values(cond)[0] !== undefined) // Loại bỏ các điều kiện không hợp lệ
        };
      }
    }
    let sortOptions = {};
    // Nếu có orderBy và sortBy, thêm điều kiện sắp xếp
    if (orderBy && sortBy) {
      sortOptions[orderBy] = sortBy.toLowerCase() === 'asc' ? 1 : -1; // Sắp xếp tăng hoặc giảm dần
    } else {
      // Mặc định sắp xếp theo thời gian tạo (createdAt) giảm dần để lấy dữ liệu mới nhất trước
      sortOptions['createdAt'] = -1;
    }
    const limit = parseInt(pageSize) || 10; // Số bản ghi trên mỗi trang
    const skip = (parseInt(page) - 1) * limit || 0; // Số bản ghi bỏ qua
    let dataSensors;
    // Kiểm tra nếu không có trang và kích thước trang
    if (!page && !pageSize) {
      dataSensors = await dataSensor.find(query); // Không có phân trang
    } else {
      // Thực hiện query với điều kiện phân trang
      dataSensors = await dataSensor.find(query)
        .sort(sortOptions) // Sắp xếp
        .skip(skip) // Bỏ qua số bản ghi
        .limit(limit); // Giới hạn số bản ghi
    }

    return { success: true, data: dataSensors }; // Trả về dữ liệu
  } catch (error) {
    throw new Error(error.message); // Ném ra lỗi để controller xử lý
  }
};






module.exports = {createDataService, getDataByCondition };