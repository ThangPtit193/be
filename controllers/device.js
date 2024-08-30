const {updateDeviceService} = require('../services/device')

const updateDeviceState = async(req,res) => {
  try {
    const id = req.params.id
    const data = req.body
   const response = await updateDeviceService(id,data)
   return res.status(200).json(response)
  } catch (error) {
       console.log(error)
       return res.status(400).json({
           err: 1,
           mess: error
       })
  }
}
module.exports = {updateDeviceState}

