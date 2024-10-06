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



module.exports = { updateData, getData }



