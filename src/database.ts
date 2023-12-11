import mongoose, { ConnectOptions } from 'mongoose';
import { config } from 'dotenv';
config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const cluster = process.env.DB_CLUSTER;
const databaseName = process.env.DB_NAME;

const uri: string = `mongodb+srv://${username}:${password}@${cluster}/${databaseName}?retryWrites=true&w=majority`;

const options: ConnectOptions = {
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
};

export const connect = async () => {
  try {
    await mongoose.connect(uri, options);
    console.log("MongoDB Connected");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error: ", error.message);
    }
  }
};

export const disconnect = async () => {
  await mongoose.connection.close();
  console.log("MongoDB Disconnected");
};
