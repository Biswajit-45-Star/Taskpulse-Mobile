const dns = require("dns");

// Temporary diagnostic
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");
    console.log(`📂 Database Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error); // <-- full error print karo
    process.exit(1);
  }
};

export default connectDB;