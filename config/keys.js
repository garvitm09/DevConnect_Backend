const mongoose = require('mongoose');

const connectToMongoDB = async () => {
  await mongoose.connect(process.env.DATABASE_URI, {});
  console.log("Connected to MongoDB");
}

module.exports = connectToMongoDB;