import  express  from 'express';
import  dotenv  from 'dotenv';
import songRoutes from './router.js';
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

const app = express()

app.use(cors())

app.use("/api/v1",songRoutes)

const port = process.env.PORT 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
