const secreteKey = "functionupPlutonium((@)))(%$#)()))(*&"
const jwt = require("jsonwebtoken")

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
                req.headers.userId=result.userId
                // req.decodedToken=result
                next()
            }
        )

    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}





module.exports={
    authenticationMid
    
}