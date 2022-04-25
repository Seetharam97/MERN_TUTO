const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config()
const port = process.env.PORT || 8000;

const productRouter = require('./routes/product.route');
const userRouter = require('./routes/user.route');

const app = express();
app.use(cors());

// healthCheck
app.get("/healthCheck", async(req,res)=>{
    res.send({status: 'Success'})
})

// mongoDB collection
mongoose.connect(process.env.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(data=>{
    console.log("Database connected")
}).catch(err=>{
    console.log(err.message)
    process.exit(1)
})

app.use(express.json());
app.set('view engine', 'ejs')
// router connection
app.use('/api/v1/product/', productRouter);
app.use('/api/v2/users/', userRouter);

// server connection
app.listen(port, ()=>{
    console.log(`http://127.0.0.1:${port}`)
});