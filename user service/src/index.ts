import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()


const connectDb = async () => {
try {
    mongoose.connect(process.env.MONGO_URL as string,{
        dbName:"Spotify",
    })
} catch (error) {
    
}
}


const port  = process.env.PORT || 5000

const app = express()

app.get("/",(req,res)=>{
    res.send("server is working")
})

app.listen(5000, () => {
    console.log(`Server is running on port ${port}`)
})