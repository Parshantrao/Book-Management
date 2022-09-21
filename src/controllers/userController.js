const {userModel,bookModel,reviewModel}=require("../models")
const validation = require("../validators/validation")
const jwt = require("jsonwebtoken")
const secreteKey = "functionupPlutonium((@)))(%$#)()))(*&"




const createUser = async function(req,res){
    try{
        const data = req.body

        // Extracting values from requestBody
        let {title,name,phone,email,password,address}=data

        // Validation on requestBody
        if(!validation.isValidObject(data)){
            res.status(400).send({status:false, msg:"pls provide user details"})
            return
        }

        //Check for mandatory fields
        let arrOfMandField = ["title","name","phone","email","password"]
        for(let key of arrOfMandField){
            if(!Object.keys(data).includes(key)){
                res.status(400).send({status:false, msg:`${key} must be present`})
                return
            }
        }

        //Check for type String
        let typeStringField = ["title","name","email","phone","password"]
        for(let key of typeStringField){
            if(!validation.isValidString(data[key])){
                res.status(400).send({status:false,msg:`${key} can't be empty / String only`})
                return
            }
        }

        ///check for field that  CAN contains only letters
        let letField = ["name"]
        for(let key of letField){
            if(!validation.isLetters(data[key])){
                res.status(400).send({status:false,msg:`${key} must contain letters only`})
                return
            }
        }

        //1.validation on title
        if(!validation.isValidTitle(title)){
            res.status(400).send({status:false, msg:"title must be from - Mr, Mrs, Miss"})
            return
        }

        //3. Validation on phone number
        if(!validation.isValidPhone(phone)){
            res.status(400).send({status:false, msg:"phone must be indian phone number (without +91)"})
            return
        }

        //4. Validation on email
        if(!validation.isValidEmail(email)){
            res.status(400).send({status:false, msg:"email is Invalid"})
            return
        }

        //5. Validation on password

        if(!validation.isValidPassword(password)){
            res.status(400).send({status:false, msg:"password must contain uppercase,lowercase,number,special charactor"})
            return
        }

        //6. Vaidation on address
        if(address){
            if(!validation.isValidObject(address)){
                res.status(400).send({status:false, msg:"pls provide address in correct formate"})
                return
            }

            // Check for types of value to be String 
            let arr=["street","city","pincode"]
            for(let key in address){
                if(!validation.isValidString(address[key])){
                    res.status(400).send({status:false, msg:`${key} can't be empty / String only`})
                    return
                }
            }

            // Check for city to have only letters in value
            if(address["city"]){
                if(!validation.isLetters(address["city"])){
                    res.status(400).send({status:false, msg:"city must contains letters only"})
                    return
                }
            }
            if(address["pincode"]){
                if(!/^[1-9][0-9]{5}$/.test(address["pincode"])){
                    res.status(400).send({status:false, msg:"invalid pincode"})
                    return
                }
            }
         
        }

        //==================DB CAlls=====================//

         //// Check for uniqueness of phone and email
         const user = await userModel.find({$or : [ {phone:phone} , {email:email} ] })    /// Object ShortHand property
         for(let key of user){
            // console.log(user,key)
            if(key.phone==phone.trim()){
                res.status(400).send({status:false,msg:`${phone} number is already taken`})
                return 
            }
            if(key.email==email.trim().toLowerCase()){
                res.status(400).send({status:false,msg:`${email} email is already taken`})
                return
            }
        }
         

        // creating user document
        const newUser = await userModel.create(data)

        res.status(201).send({status:true , message:"Success", data:newUser})
    }
    catch(err){
        res.status(500).send({statu:false, msg:err.message})
    }
}



const userLogin = async function(req,res){
    try{
        let requestBody = req.body

        // Extracting data from requestBody obj
        let {email, password}=requestBody

        // validation for requestBody obj
        if(!validation.isValidObject(requestBody)){
            res.status(400).send({status:false, msg:"pls provide credentials to login"})
            return
        }

        // Check for mandatory fields
        let mandField = ["email","password"]
        for(let key of mandField){
            if(!validation.isValid(requestBody[key])){
                res.status(400).send({status:false, msg:`${key} must be present`})
                return
            }
        }

        // Check for values to be in String type only
        for(let key of mandField){
            if(!validation.isValidString(requestBody[key])){
                res.status(400).send({status:false, msg:`${key} can't be empty / String only`})
                return
            }
        } 

        // Validation for email
        if(!validation.isValidEmail(email)){
            res.status(400).send({status:false, msg:"Invalid email"})
            return
        }

        // ===================== DB Call ====================
        const user = await userModel.findOne(requestBody)
        if(!user){
            res.status(401).send({status:false, msg:"Invalid credentials"})
            return
        }

        // Creating token
        const token = jwt.sign(
            {
                userId:user._id
               
            },
            secreteKey,
            {
                expiresIn:"1h"
            }
        )

        res.status(201).send({status:true, message:"Success", data:{token:token}})

    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}

module.exports={
    createUser,
    userLogin
}