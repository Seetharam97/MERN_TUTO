const fcm = require('fcm-notification');
const { restart } = require('nodemon');
const { createIndexes } = require('../models/users.model');
const serverKey = require('../test-651f1-firebase-adminsdk-ug6k1-45e580eb9b.json')
console.log(serverKey.project_id)
const FCM = new fcm(serverKey)


async function sendNotification(message){
    try {
        console.log(message)
        let messageData= message.notification
        console.log("+".repeat(200))
        // process.exit(1)
        const messages = {
            notification:{
                title: messageData.title,
                // message: messageData.message,
                body: messageData.bodyMessage
            },
            
            // token:req.body.fcmtoken
            token: "eEux8a1nSJ2XfNcIMoYwwL:APA91bEAsayVOT_MxJvd_UejV-BPSeTzPouFwLF_aSJXFxi5hj6Vcz1_9aDP5w8eIEyp9Ek_W2_wcV9jBq64k6TS9dBKVNQTarkKgOp_U3iFtQM4S171UGuehjzCl2jjxwL1xk1fkAZO"
        }
        // console.log(message)
        console.log(messages)
        console.log("_".repeat(200))

        await FCM.send(messages, (data, err)=>{
            if(err){
                return "Notification not sent"
            }else{
                return "Notification sent successfully"
            }
        })
        // }).then(data=>{
        //     return "Notification sent successfully"
        //     // res.send(200).json({status: "Success", message: "notification sent successfully"})
        // }).catch(err=>{
        //     return "Notification not sent"
        //     // res.send(200).json({status: "Failed", message: "notification not sent"})
        // })
        
    } catch (error) {
        console.log(error.message)
        return  error.message
    }
}

module.exports = {
    sendNotification
}