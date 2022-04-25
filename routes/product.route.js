const router = require('express').Router();
const moment = require('moment');
const req = require('express/lib/request');
const productSchema = require("../models/product.model");
const userSchema = require("../models/users.model");
const categorySchema = require("../models/category.model")
const {authVerify, isAdmin} = require("../middleware/auth");

// add product api for admin
router.post('/addProduct', authVerify, async(req,res)=>{
    try{
        let detail = req.body
        const data = new productSchema(detail);
        const result = await data.save();
        return res.status(200).json({'status': 'success', "message": "Product details added successfully", "result": result})
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

// get all product api for user
router.get("/getAllProducts", authVerify, async(req,res)=>{
    try{
        let skip = req.query.skip;
        let limit = req.query.limit;
        const productDetails = await productSchema.find().skip(skip).limit(limit).exec();
        if(productDetails.length > 0){
            return res.status(200).json({'status': 'success', message: "Product details fetched successfully", 'result': productDetails});
        }else{
            return res.status(404).json({'status': 'failure', message: "No Product details available"})
        }
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

// get individual product details
router.get("/getIndiProd", authVerify, async(req,res)=>{
    try {
        const productDetails = await productSchema.findOne({"uuid" : req.query.product_uuid}).exec();
        if(productDetails){
            return res.status(200).json({'status': 'success', message: "Product details fetched successfully", 'result': productDetails});
        }else{
            return res.status(404).json({'status': 'failure', message: "No Product details available"})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

// update the product details api call
router.put("/updateTheProduct", authVerify, async(req,res)=>{
    try {
        let condition = {"uuid": req.body.uuid}
        let updateData = req.body.updateData;
        let option = {new: true}
        const data = await productSchema.findOneAndUpdate(condition, updateData, option).exec();
        return res.status(200).json({'status': 'success', message: "Product details updated successfully", 'result': data});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

// delete product details api call
router.delete("/deleteTheProductDetail/:product_uuid", authVerify, async(req,res)=>{
    try {
        console.log(req.params.product_uuid)
        await productSchema.findOneAndDelete({uuid: req.params.product_uuid}).exec();
        return res.status(200).json({'status': 'success', message: "Product details deleted successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})

// get all product api for based on the user
router.get("/getAllProductsBasedOnUser/:userUuid", authVerify, async(req,res)=>{
    try{
        const productDetails = await productSchema.find({userUuid: req.params.userUuid}).exec();

        // aggregate[]
        if(productDetails.length > 0){
            return res.status(200).json({'status': 'success', message: "Product details fetched successfully", 'result': productDetails});
        }else{
            return res.status(404).json({'status': 'failure', message: "No Product details available"})
        }
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

// aggregate based
router.get("/userBasedProduct", async(req,res)=>{
    try {
        let start_date = req.query.start_date;
        let endDate = req.query.endDate;
        // let date = new Date(endDate)
        date = moment(endDate).utc().endOf("day").toDate();
        // date.setDate(date.getDate() + 1);
        console.log(date)
        // process.exit(1)
        let productDetails = await categorySchema.aggregate([
            {
                $match:{
                    // $and:[
                        "createdAt": { $gte: new Date(req.query.start_date +"T00:00:00.000Z"),$lte: new Date(req.query.end_date + "T23:59:59.999Z")}
                    // ]
                }
            },
            {
                '$lookup':{
                    from:'products',
                    localField: 'uuid',//category_uuid
                    foreignField: 'categoryUuid', //relation maintain key
                    as: 'product_details'
                }
            },
            {
                "$lookup":{
                    from: 'user',
                    localField: 'userUuid',
                    foreignField: 'uuid',
                    as:'user_data'
                }
            },
            {
                '$unwind':{
                    path:'$product_details',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                '$unwind':{
                    path: '$user_data',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "_id": 0,
                    "categoryName": 1,
                    "product_details.productName": 1,
                    "user_data.username":1

                }
            },
            {
                $sort:{categoryName: -1}
            },
            {
                $skip: parseInt(req.query.skip),
            },
            {
                $limit: parseInt(req.query.limit)
            }
        ])

        
        if(productDetails.length > 0){
            return res.status(200).json({'status': 'success', message: "Product details fetched successfully", 'result': productDetails});
        }else{
            return res.status(404).json({'status': 'failure', message: "No Product details available"})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

router.post('/addCategory', isAdmin, async(req,res)=>{
    try{
        const data = new categorySchema(req.body);
        const result = await data.save()
        return res.status(200).json({status: "success", message: 'category added successfully', result: result})
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})

module.exports = router;