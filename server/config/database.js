const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Mongodb connected successfully ${connect.connection.host}`);
  } 
  catch (error) {
    console.error("Some Error has occurred:", error.message);
  }
};

module.exports = dbConnect;
