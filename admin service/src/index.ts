import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./route.js";
import cloudinary from "cloudinary";
import redis from 'redis';
import cors from 'cors';
dotenv.config();

export const redisClinet = redis.createClient({
  password:process.env.Redis_Password,
  socket:{
      host:"redis-14132.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
      port:14132
  }
})

redisClinet.connect().then(()=>console.log("redis connected")).catch((err)=>console.log(err))



cloudinary.v2.config({
cloud_name:process.env.Cloud_Name,
api_key:process.env.Cloud_API_Key,
api_secret:process.env.Cloud_Api_Secret,
})

const app = express();
app.use(cors());
app.use(express.json());

async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS albums(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

    await sql`
        CREATE TABLE IF NOT EXISTS songs(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255),
        audio VARCHAR(255) NOT NULL,
        album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initializing database", error);
  }
}

app.use("/api/v1",adminRoutes)

const port = process.env.PORT;
initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
