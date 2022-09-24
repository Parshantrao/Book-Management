const mongoose=require("mongoose")

const isValidEmail = function(data){
    let emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(typeof data =="string" && data.trim().length !==0 && emailRegex.test(data.trim())) return true
    return false
}

const isValidPassword = function(data){
    let passRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15})/
    if(typeof data =="string" && data.trim().length !==0 && passRegex.test(data.trim())) return true
    return false
}

const isValidPhone=(data)=>{
    let phoneRegex=/^[6-9]\d{9}$/
    if(typeof data =="string" && data.trim().length !==0 && phoneRegex.test(data.trim())) return true
    return false
}

const isValidTitle=(data)=>
{
    let arr=["Mr","Mrs","Miss"]
    if (typeof data == "string" && data.trim().length !== 0 && arr.includes(data.trim())) return true
    return false
}

const isValidISBN = (data)=>{
    let ISBNregex=/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    if(typeof data =="string" && data.trim().length !==0 && ISBNregex.test(data.trim())) return true
    return false
}


const isValidObject = function(data){
    if(Object.prototype.toString.call(data)=="[object Object]" && Object.keys(data).length!=0) return true
    return false
}

const isValid = function(data){
    if(typeof data == undefined || data == null ) return false
    return true  
}


const isValidRating = function(data){
    if(Object.prototype.toString.call(data)=="[object Number]" && data>=1 && data<=5) return true
    return false
}

const isValidName = function(data){
    if(Object.prototype.toString.call(data)=="[object String]" && data.trim().length!=0 && /^[a-zA-Z]+$/.test(data.trim()) ) return true
    return false
}

const isValidObjectId = (data)=>{
    return mongoose.Types.ObjectId.isValid(data)
}

const isValidPincode=(data)=>{
    let pincodeRegex=/^[1-9][0-9]{5}$/
    if(typeof data =="string" && data.trim().length !==0 && pincodeRegex.test(data.trim())) return true
    return false
}


module.exports={
    isValid,
    isValidName,
    isValidRating,
    isValidObject,
    isValidPassword,
    isValidEmail,
    isValidPhone,
    isValidTitle,
    isValidObjectId,
    isValidPincode,
    isValidISBN
}