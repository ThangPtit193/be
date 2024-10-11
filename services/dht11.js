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
    
    if (content) {
      if (searchBy === 'createdAt') {
        // Xử lý tìm kiếm theo thời gian
        if (content.includes('/') && content.split('/').length === 2) {
          // Trường hợp chỉ có ngày và tháng (ví dụ: "09/10")
          const [day, month] = content.split('/');
          const currentYear = new Date().getFullYear();
          const startDate = new Date(`${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00+07:00`);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);

          query.createdAt = {
            $gte: startDate,
            $lt: endDate
          };
        } else if (content.includes('/') && !content.includes(':')) {
          // Trường hợp chỉ có ngày tháng năm (ví dụ: "09/10/2024")
          const [day, month, year] = content.split('/');
          const startDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00+07:00`);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);

          query.createdAt = {
            $gte: startDate,
            $lt: endDate
          };
        } else if (content.includes('/') && content.includes(':')) {
          // Trường hợp ngày giờ đầy đủ (ví dụ: "09/10/2024 14:34:59")
          const [datePart, timePart] = content.split(' ');
          const [day, month, year] = datePart.split('/');
          const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}+07:00`;
          const searchDate = new Date(isoDate);

          query.createdAt = {
            $gte: searchDate,
            $lt: new Date(searchDate.getTime() + 1000) // Thêm 1 giây
          };
        } else if (content.includes(':')) {
          // Trường hợp chỉ có giờ (ví dụ: "14:34")
          query = {
            $expr: {
              $regexMatch: {
                input: { 
                  $dateToString: { 
                    format: "%H:%M", 
                    date: "$createdAt",
                    timezone: "+07:00"
                  } 
                },
                regex: content
              }
            }
          };
        }
      } else if (searchBy) {
        query[searchBy] = isNaN(Number(content)) ? content : Number(content);
      } else {
        query = {
          $or: [
            { temperature: isNaN(Number(content)) ? undefined : Number(content) },
            { humidity: isNaN(Number(content)) ? undefined : Number(content) },
            { light: isNaN(Number(content)) ? undefined : Number(content) }
          ].filter(cond => Object.values(cond)[0] !== undefined)
        };
      }
    }

    let sortOptions = {};
    if (orderBy && sortBy) {
      sortOptions[orderBy] = sortBy.toLowerCase() === 'asc' ? 1 : -1;
    } else {
      sortOptions['createdAt'] = -1;
    }

    const limit = parseInt(pageSize) || 10;
    const skip = (parseInt(page) - 1) * limit || 0;

    let dataSensors;
    if (!page && !pageSize) {
      dataSensors = await dataSensor.find(query).sort(sortOptions);
    } else {
      dataSensors = await dataSensor.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    }

    return { success: true, data: dataSensors };
  } catch (error) {
    throw new Error(error.message);
  }
};






module.exports = {createDataService, getDataByCondition };