const mongoose = require("mongoose");

// mongodb URI
const URI = process.env.MONGODB_URI;

//connection method=>
const connectDB = async()=>{
try {
await mongoose.connect(URI);
console.log("database connected succesfullly!");
} catch (error) {
console.log("database connection failed!",error);
process.exit(0);
}
}
module.exports = connectDB;