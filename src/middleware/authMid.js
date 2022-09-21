const validation = require("../validators/validation")
const secreteKey = "functionupPlutonium((@)))(%$#)()))(*&"
const jwt = require("jsonwebtoken")
const {bookModel,userModel,reviewModel}=require("../models")

const authenticationMid = async function(req,res,next){
    try{
        const token = req.headers["x-api-key"]

        if(!token){
            res.status(400).send({status:false, msg:"token is missing"})
            return
        }

        const decode = jwt.verify(
            token,
            secreteKey,
            (err,result)=>{
                if(err) return res.status(401).send({status:false, msg:err.message})
                console.log(result)
                req.headers.userId=result.userId
                req.decodedToken=result
                next()
            }
        )

    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}

const authorizationMid = async function(req,res,next){
    try{
        const decodedToken=req.decodedToken

        ////  1. If BookId is present in pathParams
        const bookId = req.params.bookId
        console.log(bookId)
        if(bookId){
            // validation on bookId
            if(!validation.isValidObjectId(bookId)){
                res.status(400).send({status:false, msg:"Invalid bookId"})
                return
            }

            // getting userId
            const book = await bookModel.findOne({_id:bookId, isDeleted:false})
            if(!book){
                res.status(400).send({status:false, msg:"no book found"})
                return
            }

            let userId = book.userId

            // Authorization Check
            const userIdFromDecodedToken = decodedToken["userId"]
            
            if(userId!=userIdFromDecodedToken){
                res.status(403).send({status:false, msg:"Unauthorization"})
                return
            }
        }

        

        ////  2. If userId is present in requestBody
        const userId = req.body.userId
        if(userId){
            // validation on userId
            if(!validation.isValidObjectId(userId)){
                res.status(400).send({status:false, msg:"Invalid userId"})
                return
            }

            const user = await userModel.findById(userId)
            if(!user){
                res.status(400).send({status:true, msg:"no user found"})
                return
            }

            // Authorization Check
            const userIdFromDecodedToken = decodedToken["userId"]
            
            if(userId!=userIdFromDecodedToken){
                res.status(403).send({status:false, msg:"Unauthorization"})
                return
            }
        }
        next()
    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}



module.exports={
    authenticationMid,
    authorizationMid
}