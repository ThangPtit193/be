const {getData,createDataService} = require('../services/dht11')

const getAllData = async(req,res) => {
  try {
    const {limit, page, sort, filter} = req.query
    const response = await getData(Number(limit)|| 1, Number(page) || 1 , sort, filter)
   return res.status(200).json(response)
  } catch (error) {
       console.log(error)
       return res.status(400).json({
           err: 1,
           mess: error
       })
  }
}
const createData = async(req,res) => {
  try {
    const {light,temperature, humidity} = req.body
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


module.exports = {getAllData,createData}

