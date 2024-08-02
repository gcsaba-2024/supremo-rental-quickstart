const express = require('express');
const axios = require('axios');
const cors = require("cors");
const { writeFile } = require('fs').promises;

const carHealth = require('./carhealth.json');

const app = express();
const corsOptions = {
  origin: '*', // Replace with your React app's domain and port
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Define the target API URL
const apiTarget = 'http://152.67.25.167';

app.get("/car-service-redis/cars", async (req, res) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.CARSRENTAL_GETALL_HOST}${process.env.LISTALL_CARS_REDIS_API}`,
    headers: {}
  };

  try {
    const response = await axios.request(config);
    res.send(response.data);
    console.log("response.data get all cars", response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch car data' });
  }
});

app.get("/car-service-redis/cars/:id", async (req, res) => {
  const carId = req.params.id;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.CARSRENTAL_GETALL_HOST}${process.env.LISTALL_CARS_REDIS_API}/${carId}`,
    headers: {}
  };

  try {
    const response = await axios.request(config);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch car data' });
  }
});

app.get("/car-service-redis/carshealth/:carid", async (req, res) => {
  const carId = req.params.carid;
  const carHealthD = carHealth.find(car => car.carid === carId);
  if (carHealthD) {
    res.send(carHealthD);
  } else {
    res.status(404).send({ error: 'Car health data not found' });
  }
});

app.get("/order-service/user-orders", async (req, res) => {
  const userId = req.query.userid;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://152.67.25.167/order-service/orders',
    headers: {}
  };

  try {
    const response = await axios.request(config);
    let ordersData = response.data;
    let sortedOrders = ordersData.sort((a, b) => new Date(b.order_when) - new Date(a.order_when));
    let filteredOrders = sortedOrders.filter(order => order.userid === userId);
    const limitedOrders = filteredOrders.slice(0, 20);
    res.send(limitedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch orders' });
  }
});

app.post("/order-service/create-order", async (req, res) => {
  const payload = req.body;
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.CARSRENTAL_GETALL_HOST}${process.env.USER_CREATE_ORDER}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: payload
  };

  try {
    const response = await axios.request(config);
    console.log("New order created:", response.data);
    res.send(response.data);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ error: 'Failed to create order' });
  }
});

app.post("/user-service-redis/authn", async (req, res) => {
  const payload = req.body;
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://152.67.25.167/user-service-redis/authn',
    headers: {
      'Content-Type': 'application/json'
    },
    data: payload
  };

  try {
    const response = await axios.request(config);
    const loginResponse = response.data;
    loginResponse.userid = payload.userid;
    res.send(loginResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Authentication failed' });
  }
});

app.get("/user-service-redis/users/:userid", async (req, res) => {
  const userID = req.params.userid;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://152.67.25.167/user-service-redis/users/${userID}`,
    headers: {}
  };

  try {
    const response = await axios.request(config);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch user data' });
  }
});

const https = require('https');

const agent = new https.Agent({  
  rejectUnauthorized: false
});

app.post("/askme-search", async (req, res) => {
  const payload = req.body;
  console.log('semantic payload ', payload);
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://amaaaaaallb34niatbbhvati5nvlalh4xsghj6hvsszszior6gg3xpky75ba.opensearch.us-ashburn-1.oci.oraclecloud.com:9200/keyword-testdrive-index/_search',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic b3NtYXN0ZXI6T3NtYXN0ZXJAMTIz',
    },
    data: payload,
    httpsAgent: agent
  };

  try {
    console.log('Sending request to OpenSearch...');
    const response = await axios.request(config);
    console.log('Received response from OpenSearch:', response.data);
    res.send(response.data);
  } catch (error) {
    console.error('Error occurred during semantic search:', error);

    if (error.response) {
      // Server responded with a status other than 200 range
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      res.status(error.response.status).send({ error: error.response.data });
    } else if (error.request) {
      // Request was made but no response was received
      console.error('No response received:', error.request);
      res.status(500).send({ error: 'No response received from the server' });
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Request setup error:', error.message);
      res.status(500).send({ error: 'Error in setting up the request' });
    }
  }
});

app.post('/askme-semanticsearch', async (req, res) => {
  const payload = req.body;
  console.log('semantic payload ', payload);
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://amaaaaaallb34niatbbhvati5nvlalh4xsghj6hvsszszior6gg3xpky75ba.opensearch.us-ashburn-1.oci.oraclecloud.com:9200/semantic-testdrive-index-knn1024/_search',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic b3NtYXN0ZXI6T3NtYXN0ZXJAMTIz',
    },
    data: payload,
    httpsAgent: agent
  };

  try {
    console.log('Sending request to OpenSearch...');
    const response = await axios.request(config);
    console.log('Received response from OpenSearch:', response.data);
    res.send(response.data);
  } catch (error) {
    console.error('Error occurred during semantic search:', error);

    if (error.response) {
      // Server responded with a status other than 200 range
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      res.status(error.response.status).send({ error: error.response.data });
    } else if (error.request) {
      // Request was made but no response was received
      console.error('No response received:', error.request);
      res.status(500).send({ error: 'No response received from the server' });
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Request setup error:', error.message);
      res.status(500).send({ error: 'Error in setting up the request' });
    }
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
