// NextJS is a "edge time framework"
// here the backend is not continuously running
// it is only run when a request is made
// so we need to connect to the database on every request and check accordingly
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db.connections[0].readyState; // optional

    // console.log(db);
    // console.log(db.connections);

    console.log("DB Connection Successfully");
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
};

export default dbConnect;
