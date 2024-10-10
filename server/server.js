require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router/auth-router");
const connectDB = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");

// handling cors policy issue 
const corsOptions = { 
  origin:"http://localhost:5173", 
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD", 
  credentials : true, 
}; 
 
app.use(cors(corsOptions)); 

app.use(express.json());

app.use("/api/infra-mgmt-app/auth", router);

// using error-middleware
app.use(errorMiddleware);

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("server running properly!");
  });
});
