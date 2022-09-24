const {userModel,bookModel,reviewModel}=require("../models")
const validation = require("../validators/validation")
const jwt = require("jsonwebtoken")
const secreteKey = "functionupPlutonium((@)))(%$#)()))(*&"




const createUser = async function(req,res){
    try{
        const data = req.body

        // Extracting values from requestBody
        let {phone,email}=data

        //==================DB CAlls=====================//

         //// Check for uniqueness of phone and email
         const user = await userModel.find({$or : [ {phone} , {email} ] })    /// Object ShortHand property
         for(let key of user){
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

        return res.status(201).send({status:true , message:"Success", data:newUser})
    }
    catch(err){
        return res.status(500).send({statu:false, msg:err.message})
    }
}



const userLogin = async function(req,res){
    try{
        let requestBody = req.body

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
            if(typeof (requestBody[key]) != "string" || requestBody[key].trim().length==0){
                res.status(400).send({status:false, msg:`${key} can't be empty / String only`})
                return
            }
        } 

        // Validation for email
        if(!validation.isValidEmail(requestBody["email"])){
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

        return res.status(201).send({status:true, message:"Success", data:{token:token}})

    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})
    }
}

module.exports={
    createUser,
    userLogin
}