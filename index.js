

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.SERVER_URL || 3001;

const {createDataService} = require('../be/services/device')

mongoose.connect(`mongodb+srv://tan9992015:tan9992015@cluster0.comarde.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        console.log("Kết nối mongoose thành công");
    })
    .catch(err => {
        console.log(err);
    });

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const createInitialData = async () => {
    try {
      const response = await createDataService();
      console.log('Initial data created:', response);
    } catch (error) {
      console.error('Error creating initial data:', error);
    }
  };
  
  // Gọi hàm tạo dữ liệu khi khởi động ứng dụng
  createInitialData();

routes(app);

app.listen(port, () => {
    console.log("Server đang chạy trên cổng: " + port);
});
