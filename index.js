const mqtt = require('mqtt');
const Data = require('./models/dataSensor');
const options = {
  host: '667e33c453fe4f028d4486b0f821713b.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'songcuon123',
  password: 'songcuon123'
}

const client = mqtt.connect(options);

const topic = "Data_Sensor";
const topicLight = "Light"
client.on('connect', () => {
  console.log('MQTT Connected');
  client.subscribe([topic, topicLight]);
})

let data = {
  [topic]: null,
  [topicLight]: null
};

client.on('message', async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    console.log('MQTT Received Topic:', topic);
    console.log('Message:', payload);

    if (topic === "Data_Sensor") {
      // Access data fields from the payload for "Data_Sensor"
      data.humidity = payload.humidity;
      data.temperature = payload.temperature;

      console.log(`Humidity: ${data.humidity}%`);
      console.log(`Temperature: ${data.temperature}°C`);
    } else if (topic === "Light") {
      // Access data fields from the payload for "Light"
      data.light = payload.percent;

      console.log(`Light Intensity: ${data.light}%`);
    }

    // Kiểm tra xem tất cả dữ liệu đã nhận được chưa
    if (data.temperature !== null && data.humidity !== null && data.light !== null) {
      const dataSensor = new Data(data);
      await dataSensor.save();
      console.log('Data saved to MongoDB');
      
      // Sau khi lưu, đặt lại dữ liệu để chuẩn bị cho lần nhận dữ liệu tiếp theo
      data = {
        temperature: null,
        humidity: null,
        light: null
      };
    }

  } catch (error) {
    console.error('Error parsing message:', error);
  }
});

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors'); // Chuyển đổi từ import sang require
const bodyParser = require('body-parser');


const app = express();
const port = process.env.SERVER_URL || 3001;

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

routes(app);

app.listen(port, () => {
    console.log("Server đang chạy trên cổng: " + port);
});