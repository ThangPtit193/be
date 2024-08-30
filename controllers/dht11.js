const {getData} = require('../services/dht11')

const getAllData = async(req,res) => {
  try {
   const response = await getData()
   return res.status(200).json(response)
  } catch (error) {
       console.log(error)
       return res.status(400).json({
           err: 1,
           mess: error
       })
  }
}
module.exports = {getAllData}

