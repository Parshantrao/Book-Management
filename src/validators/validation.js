const mongoose=require("mongoose")

const isValidEmail = function(data){
    let emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(data.trim())
}

const isValidPassword = function(data){
    let passRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15})/
    return passRegex.test(data.trim())
}
const isValidObject = function(data){
    if(Object.prototype.toString.call(data)!="[object Object]" || Object.keys(data).length==0) return false
    return true
}

const isValid = function(data){
    if(typeof data == undefined || data == null ) return false
    return true  
}

const isValidString = function(data){
    if(Object.prototype.toString.call(data)!="[object String]" || data.trim().length==0) return false
    return true
}

const isValidNumber = function(data){
    if(Object.prototype.toString.call(data)!="[object Number]" || data.length==0) return false
    return true
}

const isValidPhone=(data)=>{
    let phoneRegex=/^[6-9]\d{9}$/
    return phoneRegex.test(data.trim())
}

const isLetters = (data)=>{
    let letRegex=/^[a-zA-Z]+$/
    return letRegex.test(data.trim())
}

const isValidTitle=(data)=>
{
    let arr=["Mr","Mrs","Miss"]
    if(!arr.includes(data.trim())) return false
    return true  
}

const isValidObjectId = (data)=>{
    return mongoose.Types.ObjectId.isValid(data)
}

const makeArray = (data)=>{
    let arr=data.toLowerCase().split(",").map(x=>x.trim()).filter(x=>x.length>0)
    return arr
}

module.exports={
    isValid,
    isValidString,
    isValidNumber,
    isValidObject,
    isValidPassword,
    isValidEmail,
    isValidPhone,
    isValidTitle,
    isLetters,
    isValidObjectId,
    makeArray
}