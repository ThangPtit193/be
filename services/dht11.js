const data = require('../models/dataSensor')

const getData = (limit, page, sort, filter) => (new Promise(async (resolve, reject) => {
    try {
      const totalData = await data.countDocuments();
      let response;
  
      if (filter) {
        response = await data.find({[filter[0]]: {'$regex': filter[1] }}).lean().limit(limit).skip(limit * (page-1));
      } else if (sort) {
        const order = Number(sort[1])
        const label = sort[0]
        response = await data.find().lean().limit(limit).skip(limit * (page -1)).sort({[label]: order});
      } else {
        response = await data.find().lean().limit(limit).skip(limit * (page -1));
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

const createDataService = (body) => (new Promise(async(resolve,reject)=> {
    try {
        const {light,temperature, humidity} = body
        const response = await data.create({
            light:light, temperature:temperature,humidity:humidity
        })
        resolve({
            err: response ? 0 : 1,
            data: response
        })
    } catch (error) {
        reject(error)
    }
  }))

module.exports = {getData,createDataService};