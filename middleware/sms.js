const {totp} = require('otplib')
require('dotenv').config()

function otpSend(type){
    if(type == "1stsend"){
        const secrect = 'secrectOTPKey_sample'
        const token = totp.generate(secrect)
        console.log(token)
        console.log(secrect)
    }else if(type == "resend"){
        const secrect = 'secrectOTPKey_sample'
        const token = totp.generate(secrect)
        console.log(token)
        console.log(secrect)
    }  
}

function verify(){
    const secrect = 'secrectOTPKey_sample'
    const token = totp.generate(secrect)
    console.log(token)
    console.log(secrect)
    // console.log(otp)
    const isSame = totp.check(token, secrect);
    console.log(isSame);

}

otpSend()
verify()

// module.exports = {
//     otpSend:otpSend
// }