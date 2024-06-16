import mongoose from "mongoose";

const connect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`
    );
    return connectionInstance;
  } catch (error) {
    console.log(`Mongo connection failed: ${error.message}`);
    process.exit(0);
  }
};

export default connect;
