const {userModel,bookModel,reviewModel}=require("../models")
const validation = require("../validators/validation")
const moment = require("moment")




const createBookMid = async function(req,res,next){
    try{
        const requestBody = req.body 

        // Extracting data from requestBody obj
        let {title,excerpt,userId,ISBN,category,subcategory,releasedAt}=requestBody

        if(!validation.isValidObject(requestBody)){
            res.status(400).send({status:false, msg:"pls provide book details"})
            return
        }

        // Check on Field which are mandatory
        let mandField=["title","excerpt","userId","ISBN","category","subcategory"]
        for(let key of mandField){
            if(!validation.isValid(requestBody[key])){
                res.status(400).send({status:false, msg:`${key} is required`})
                return
            }
        }

        // Validation on fields whose type is String
        let typeStringField = ["title","excerpt","ISBN","category","subcategory"]
        for(let key of typeStringField){
            if(!validation.isValidString(requestBody[key])){
                res.status(400).send({status:false, msg:`${key} can't be empty / String only`})
                return
            }
        }

        // Validation on field that contains only letters in their values'
        let arr=["title","excerpt","category","subcategory"]
        for(let key of arr){
            if(!validation.isLetters(requestBody[key])){
                res.status(400).send({status:false, msg:`${key} only contains letter`})
                return
            }
        }

        // Validation on ISBN value
        if(!validation.isValidISBN(ISBN)){
            res.status(400).send({status:false, msg:"Invalid ISBN value"})
            return
        }

        // Validation for valid objectId
        if(!validation.isValidObjectId(userId)){
            res.status(400).send({status:true, msg:"Invalid userId"})
            return
        }
        
        // Check for releasedAt 
        if(releasedAt){
            if(!moment(releasedAt,"YYYY-MM-DD",true).isValid()){
               return res.status(400).send({status:false, msg:"releasedAt should be in YYYY-MM-DD format"})
            }
            let date=moment().format("YYYY-MM-DD")
            if(!moment(releasedAt).isAfter(date)){
                return res.status(400).send({status:false, msg:"pls provide an upcoming date"})
            }
        }
        if(!releasedAt){
            requestBody.releasedAt=moment().add(3, 'months').format("YYYY-MM-DD")
        }
        req.requestBody=requestBody
        next()

    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}


const getBookMid = async function(req,res,next){
    try{
        const queryParams = req.query
        
        // Check if queryParams are given or not
        if(Object.keys(req.query).length==0){
            res.status(400).send({status:false, msg:"pls provide QueryParams"})
            return
        }

        // Check for valid queryParams
        let queryParamsArray=["userId","category","subcategory"]
        for(let key in queryParams){
            if(!queryParamsArray.includes(key)){
                res.status(400).send({status:false, msg:`queryParams can only be- ${queryParamsArray.join(",")}`})
                return
            }
        }

        // Check for values of queryParams
        for(let key in queryParams){
            if(queryParams[key].length==0){
                res.status(400).send({status:false, msg:`${key} can't be empty`})
                return
            }
        }
               
        // adding isdeleted key in queryParam obj
        queryParams.isDeleted = false

        req.queryParams=queryParams

        next()
    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}

const updateBookMid = async function(req,res,next){
    try{
        const bookId = req.params.bookId
        const requestBody = req.body

        // Validation on requestBody obj
        if(!validation.isValidObject( requestBody )){
            res.status(400).send({status:false, msg:"pls provide data to update book document"})
            return
        }

        let arr=["title","excerpt","category","subcategory"]

        // Validation on fields whose type is String
        for( let key in requestBody ){
            if( !validation.isValidString( requestBody[key] )  ){
                res.status( 400 ).send( {status:false, msg:`${key} can't be empty / String only`} )
                return
            }
            if(arr.includes(key)){
                if( !validation.isLetters( requestBody[key] ) ){
                    res.status( 400 ).send( {status:false, msg:`${key} can only contains letters`} )
                    return
                }
            }
        }

        // validation on ISBN
        if(requestBody.ISBN){
            if(!validation.isValidISBN(requestBody.ISBN)){
                res.status( 400 ).send( {status:false, msg:"Invalid ISBN"} )
                return
            }
        }

        // Check for releasedAt 
        if( requestBody.releasedAt ){
            if(!moment(requestBody.releasedAt,"YYYY-MM-DD",true).isValid()){
               return res.status(400).send({status:false, msg:"releasedAt should be in YYYY-MM-DD format"})
            }
            let date=moment().format("YYYY-MM-DD")
            if(!moment(requestBody.releasedAt).isAfter(date)){
                return res.status(400).send({status:false, msg:"pls provide an upcoming date"})
            }
        }
        
       next()

    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}


module.exports={
    createBookMid,
    getBookMid,
    updateBookMid
}