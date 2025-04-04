import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './route.js';

dotenv.config()

const connectDb = async () => {
try {
    mongoose.connect(process.env.MONGO_URL as string,{
        dbName:"Spotify",
    })
    console.log("Mongo Db Connectd")
} catch (error) {
    console.log(error)
}
}


const port  = process.env.PORT || 5000

const app = express()

app.use(express.json())

app.use("/api/v1",userRoutes)

app.get("/",(req,res)=>{
    res.send("server is working")
})

app.listen(5000, () => {
    console.log(`Server is running on port ${port}`)
    connectDb()
})