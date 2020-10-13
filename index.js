import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan'; 

import router from './router.js';
const app = express();


const connectDB = async () => {
    try {
       const result = await mongoose.connect(process.env.MONGODB_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

                if(result){
                    console.log("connection DB success");
                }else{
                    console.log("connect failur");
                }
            

    } catch (err) {
        console.log(err);
    }
}

connectDB();

//middlewares
app.use(morgan('dev'));

app.use(express.json());

//routes
app.get('/',(req,res)=>{
    res.json({
        message : 'sucess',
    })
})


app.use('/api',router); 

const PORT = process.env.PORT || '4000';

app.listen('3000',()=>{
    console.log(`app listen to port = ${PORT}`);
});