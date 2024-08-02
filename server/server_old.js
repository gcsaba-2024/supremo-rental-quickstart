const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const carList = require("./carlist.json");
const userList = require('./users.json');
const carHealth = require('./carhealth.json');
//const ordersData = require('./orders.json');
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your React app's domain and port
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};


//app.use(cors(corsOptions));
app.use(cors());
app.options('*', cors())

app.use(express.json());
const { writeFile } = require('fs').promises;  // Import the promise version of writeFile


// Define the target API URL
const apiTarget = 'http://152.67.25.167';

//console.log("SANDY_URL ", process.env.CARS_GET_REMOTE_URL);
const axios = require('axios');

app.get("/car-service-redis/cars", async (req, res) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: process.env.CARSRENTAL_GETALL_HOST+process.env.LISTALL_CARS_REDIS_API,
    headers: { }
  };
  axios.request(config)
  .then((response) => {
    res.send(response.data);
    console.log("response.data get all cars ", response.data);
  })
  .catch((error) => {
    // console.log(error);
    res.send(error);
  });
  
  //res.send(carList);

})


app.get("/car-service-redis/cars/:id", async (req, res) => {
  const carId = req.params.id;
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: process.env.CARSRENTAL_GETALL_HOST+process.env.LISTALL_CARS_REDIS_API+"/"+carId,
    headers: { }
  };

  axios.request(config)
  .then((response) => {
    res.send(response.data);
  })
  .catch((error) => {
    // console.log(error);
    res.send(error);
  });
  // const carid = req.params.id;
  // console.log("carid ", carid);
  // const car = carList.find((car_obj) => {
  //   return car_obj.id === carid;
  // });
  // console.log("car is ", car);
  // res.send(car)
});

app.get("/car-service-redis/carshealth/:carid", async (req, res) => {
  // axios.request(config)
  // .then((response) => {
  //   res.send(response.data);
  // })
  // .catch((error) => {
  //   // console.log(error);
  //   res.send(error);
  // });
  const carId = req.params.carid;
  console.log("userid ", carId);
  const carHealthD = carHealth.find((car_id) => {
    return car_id.carid === carId;
  });
  console.log("car health is ", carHealthD);
  res.send(carHealthD);
});

app.get("/order-service/user-orders", async (req, res) => {
  try {
    // Extract userid from request query parameters
    const userId = req.query.userid;

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://152.67.25.167/order-service/orders',
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      console.log("list of orders ",JSON.stringify(response.data));
      ordersData = response.data;
      let sortedOrders = ordersData.sort((a, b) => new Date(b.order_when) - new Date(a.order_when))
      let filteredOrders = sortedOrders.filter(order => order.userid === userId);
      console.log("Post filter list of orders ", filteredOrders);
      res.send(filteredOrders);


    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });



    // Define the axios request config
    // const config = {
    //   method: 'get',
    //   url: `${apiTarget}/order-service/user-orders`,
    //   params: { userid: userId }, // Pass userid as a query parameter
    //   headers: {}
    // };

    // // Make the axios request
    // const response = await axios(config);
    // Sort the array by order_when in descending order
  //   let sortedOrders = ordersData.sort((a, b) => new Date(b.order_when) - new Date(a.order_when));

  //   // Filter the sorted array by userid
  //   let filteredOrders = sortedOrders.filter(order => order.userid === userId);
  //   // let filteredOrders = ordersData.filter(order => order.userid === userId);

  //   // Send the response data to the client
  //   //res.send(response.data);
  //   res.send(filteredOrders);
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


app.post("/order-service/create-order", async (req, res) => {
  try {
    const payload = req.body;
    console.log("create order payload is ", payload);
    // const orderId = "O-" + (Math.floor(10000000 + Math.random() * 90000000));
    // payload.order_when = new Date().toISOString();
    // payload.orderid = orderId;
    // payload.ordered = payload.ordered === "TRUE";
    // ordersData.push(payload);

    // // Use JSON.stringify to convert the array to a JSON string
    // await writeFile('./orders.json', JSON.stringify(ordersData, null, 2));

    // console.log("New order created:", payload);
    // res.send({ code: 0, msg: 'OK', result: payload });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.CARSRENTAL_GETALL_HOST+process.env.USER_CREATE_ORDER,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : payload
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });


  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ code: 1, msg: 'Internal Server Error' });
  }
});

app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.post("/user-service-redis/authn", async (req, res) => {
  console.log('Before fetch request');
  const payload = await req.body;
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://152.67.25.167/user-service-redis/authn',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : payload
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));

    //if(response.data.code === 0 && response.data.msg==="OK"){
      const loginResponse = response.data;
      loginResponse.userid = payload.userid;
      console.log(" with user id ", loginResponse);
      res.send(loginResponse);
    //}
    //let filteredUser = response.data.filter(user => user.userid === payload.userid)[0];
  })
  .catch((error) => {
    console.log(error);
    res.send({ code: 1, msg: 'KO', userid: payload.userid });
  });


  // console.log("payload is ", typeof userList);
  // let data = JSON.stringify(payload);
  // let filteredUser = userList.filter(user => user.userid === payload.userid)[0];

  // // Check if the user was found
  // if (filteredUser) {
  //   console.log(filteredUser);
  //   res.send(filteredUser);
  // } else {
  //   console.log('User not found.');
  //   res.send({ code: 1, msg: 'KO' });
  // }

});

app.get("/user-service-redis/users/:userid", async (req, res) => {
  const userID = req.params.userid;
  if(userID){
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://152.67.25.167/user-service-redis/users/${userID}`,
    headers: { }
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    res.send(response.data);
  })
  .catch((error) => {
    console.log(error);
    res.send(error);
  });
} else {
  res.send("Error - Invalid User")
}
  // const userId = req.params.userid;
  // console.log("userid ", userId);
  // const userD = userList.find((user_id) => {
  //   return user_id.userid === userId;
  // });
  // console.log("car is ", userD);
  // res.send(userD)
});

app.post("/askme-search", async (req, res) => {
  console.log('Before fetch request');
  const payload = await req.body;

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: 'https://e2enllqghisyp4q3oocddrbcoe.apigateway.ap-mumbai-1.oci.customer-oci.com/opensearch/my_index/_search',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Basic b3BlbnNlYXJjaDpPcmFjbGUjMTIz'
    },
    data: payload
  };
  
  axios.request(config)
    .then((response) => {
      console.log(" response search data ", JSON.stringify(response.data));
      res.send(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
});


const port = 5000;
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
