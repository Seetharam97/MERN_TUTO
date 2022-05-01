const nodemailer = require('nodemailer');
const ejs = require('ejs');
const {join} = require('path');
const  sendGrid = require('@sendgrid/mail');

sendGrid.setApiKey(process.env.mailApiKey)

const transporter = nodemailer.createTransport({
    
    port: 465,
    host: "smtp.sendgrid.net",
    auth:{
        user: 'apikey',
        pass: process.env.mailApiKey
    }

});

async function mailSending (mailData){
    try {
        // console.log(mailData.attachments)
        const data = await ejs.renderFile(join(__dirname,'../templates/', mailData.fileName), mailData, mailData.details)
        const mailDetails = {
            from:mailData.from,
            to:mailData.to,
            subject:mailData.subject,
            attachments: mailData.attachments,
            html:data
        }
        await transporter.sendMail(mailDetails, (err, data)=>{
            if(err){
                console.log("err", err.message)
            }else{
                console.log("Mail sent successfully");
                return 1
            }
        })
        
    } catch (error) {
        console.log(error.message)
        process.exit(1);
    }
}

async function sendMailSending (mailData){
    try {
        // console.log(mailData.attachments)
        const data = await ejs.renderFile(join(__dirname,'../templates/', mailData.fileName), mailData, mailData.details)
        const mailDetails = {
            from:mailData.from,
            to:mailData.to,
            subject:mailData.subject,
            attachments: mailData.attachments,
            html:data
        }
        await sendGrid.send(mailDetails, (err, data)=>{
            if(err){
                console.log("err", err.message)
                return 0
            }else{
                console.log("Mail sent successfully");
                return 1
            }
        })
        
    } catch (error) {
        console.log(error.message)
        return 0
    }
}



module.exports = {
    mailSending: mailSending,
    sendMailSending: sendMailSending
}