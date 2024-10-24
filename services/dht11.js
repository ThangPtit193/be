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
    const { light, temperature, humidity, fog } = body
    const response = await dataSensor.create({
      light: light, temperature: temperature, humidity: humidity, fog: fog
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
      } else if (input.split(':').length === 2) {
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
    const dataSensors = await dataSensor.find({}, { createdAt: 1, _id: 1, temperature: 1, humidity: 1, light: 1, fog: 1 }).sort({ createdAt: -1 });

    if (dataSensors.length === 0) {
      console.log('No data found');
      return { success: false, message: 'No data found' };
    }

    // Kiểm tra nếu content tồn tại, thì lọc dữ liệu theo content
    let filteredDatas = dataSensors;
    if (content) {
      if (searchBy === 'createdAt') {
        filteredDatas = dataSensors.filter(item => {
          const isoDateString = item.createdAt.toISOString();
          return isoDateString.includes(convertInput(content)); // Sử dụng includes để tìm kiếm content trong chuỗi ISO
        });
      } else if (searchBy === 'temperature' || searchBy === 'humidity' || searchBy === 'light' || searchBy === 'fog') {
        filteredDatas = dataSensors.filter(item => {
          return item[searchBy] === (isNaN(Number(content)) ? content : Number(content));
        });
      } else if (searchBy) {
        // Handle other fields (temperature, humidity, light)
        filteredDatas = dataSensors.filter(item => {
          return item[searchBy] === (isNaN(Number(content)) ? content : Number(content));
        });
      } else {
        // General filter logic (using light, temperature, or humidity)
        filteredDatas = dataSensors.filter(item => {
          return (
            item.temperature === (isNaN(Number(content)) ? content : Number(content)) ||
            item.humidity === (isNaN(Number(content)) ? content : Number(content)) ||
            item.fog === (isNaN(Number(content)) ? content : Number(content)) ||
            item.light === (isNaN(Number(content)) ? content : Number(content))
          );
        });
      }
    }

    // Sắp xếp dữ liệu nếu có orderBy và sortBy
    if (orderBy && sortBy) {
      const order = sortBy.toLowerCase() === 'asc' ? 1 : -1;
      filteredDatas.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return -order;
        if (a[orderBy] > b[orderBy]) return order;
        return 0;
      });
    }

    if (page === '' && pageSize === '') {
      // Trả về dữ liệu đã lọc
      return { success: true, data: filteredDatas };
    }

    filteredDatas.forEach(item => {
      console.log(`createdAt: ${item.createdAt.toISOString()}, id: ${item._id}, temperature: ${item.temperature}, humidity: ${item.humidity}, light: ${item.light}`);
    });

    // Xử lý phân trang
    const limit = parseInt(pageSize) || 10; // Số bản ghi trên mỗi trang
    const skip = (parseInt(page) - 1) * limit || 0; // Số bản ghi bỏ qua

    const paginatedData = filteredDatas.slice(skip, skip + limit);
    return { success: true, data: paginatedData };
  } catch (error) {
    console.log('Failed to get device by time:', error.message);
    return { success: false, message: 'Failed to get device by time: ' + error.message };
  }
};






module.exports = { createDataService, getDataByCondition };