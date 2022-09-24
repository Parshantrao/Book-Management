const mongoose = require("mongoose")
const validattion = require("../validators/validation")



const userSchema = mongoose.Schema({
    title:{
        type:String, required:[true, "title required"], trim:true, 
        enum:{
            values:['Mr','Mrs','Miss'],
            message:'{VALUE} is not supported'
        }
    },

    name:{type:String, required:true, trim:true, lowercase:true},

    phone:{type:String, required:true, unique:true, trim:true, 
        validate:validattion.isValidPhone,
        message:"phone number must be indian phone number (without +91)"
        // isAsync:false,
    },

    email:{
        type:String, required:true, unique:true, trim:true,lowercase:true,
        validate:{
            validator:validattion.isValidEmail,
            message:"Invalid email",
            
        }
    },//// Validation

    password:{
        type:String, required:true, trim:true,  
        minLength:[8,"minimum length should be 8"], 
        maxLength:[15,"maximum length should be 15"],
        validate:{
            validator:(v)=>{
            let passRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15})/
            return passRegex.test(v)
            },
            message:"Invalid password"
            
        }
    },

    address:{
        street:{type:String, trim:true, lowercase:true},
        city:{type:String, trim:true, lowercase:true},
        pincode:{type:String, trim:true, lowercase:true}

    }
    
},{timestamps:true})


module.exports=mongoose.model("User",userSchema)