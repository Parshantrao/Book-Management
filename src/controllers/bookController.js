const {userModel,bookModel,reviewModel}=require("../models")
const jwt = require("jsonwebtoken")
const validation = require("../validators/validation")
const secreteKey = "functionupPlutonium((@)))(%$#)()))(*&"


// - Create a book document from request body. Get userId in request body only.
// - Make sure the userId is a valid userId by checking the user exist in the users collection.
// - Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like [this](#successful-response-structure) 
// - Create atleast 10 books for each user
// - Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)


const createBook = async function(req,res){
    try{
        const requestBody = req.body 

        // Extracting data from requestBody obj
        let {title,excerpt,userId,ISBN,category,subcategory,releasedAt}=requestBody

        // Validation on Field which are mandatory
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

        // Validation for valid objectId
        if(!validation.isValidObjectId(userId)){
            res.status(400).send({status:true, msg:"Invalid userId"})
            return
        }
        
        // Validation for releasedAt type
        if(releasedAt){
            if(Object.prototype.toString.call(releasedAt)!="[object Date]"){
                res.status(400).send({status:true, msg:`${releasedAt} must be of type Date`})
                return 
            }
        }
        else{
            requestBody.releasedAt=new Date()    /////////////// Use moment package //////////////////////////////
        }

       

        //Changing subcategory string into array
        requestBody.subcategory=validation.makeArray(subcategory)



        //=================== DB CALL =================//
        /// Check for uniqueness of title
        const alreadyExistTitle = await bookModel.findOne({title})
        if(alreadyExistTitle){
            res.status(400).send({status:true, msg:`${title} is already taken`})
            return
        }

        /// Check for uniqueness for ISBN
        const alreadyExistISBN = await bookModel.findOne({ISBN})
        if(alreadyExistISBN){
            res.status(400).send({status:true, msg:`${ISBN} is already taken`})
            return
        }

        // creating book document
        const newBook = await bookModel.create(requestBody)

        res.status(201).send({status:false, message:"Success", data:newBook})

    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}


// Returns all books in the collection that aren't deleted. Return only book _id, title, excerpt, userId, category, releasedAt, reviews field. Response example [here](#get-books-response)
// - Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure) 
// - If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure) 
// - Filter books list by applying filters. Query param can have any combination of below filters.
//   - By userId
//   - By category
//   - By subcategory
//   example of a query url: books?filtername=filtervalue&f2=fv2
// - Return all books sorted by book name in Alphabatical order


const getBookByParam = async function(req,res){
    try{
        const querParams = req.query
        
        // Check if queryParams are given or not
        if(Object.keys(req.query).length==0){
            res.status(400).send({status:false, msg:"pls provide QueryParams"})
            return
        }

        // Check for valid queryParams
        let queryParamsArray=["userId","category","subcategory"]
        for(let key in querParams){
            if(!queryParamsArray.includes(key)){
                res.status(400).send({status:false, msg:`queryParams can only be- ${queryParamsArray.join(",")}`})
                return
            }
        }

        // Check for values of queryParams
        for(let key in querParams){
            if(querParams[key].length==0){
                res.status(400).send({status:false, msg:`${key} can't be empty`})
                return
            }
        }
               

        // converting subcategory queryParam value into array and then use $in operator
        if(querParams.subcategory){
            let subcategory=validation.makeArray(querParams.subcategory)
            querParams.subcategory={$in:[...subcategory]}
        }

        // adding isdeleted key in queryParam obj
        querParams.isDeleted = false

        ///=================== DB CALL ===============//
        const books = await bookModel.find(querParams).select({title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}).populate("userId").sort({title:1})

        if(books.length==0){
            res.status(404).send({status:false, msg:"No book found"})
            return
        }

        res.status(200).send({status:true, message:"Success", data:books})
    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}



const getBookById = async function(req,res){
    try{
        const bookId = req.params.bookId

        // Validation on bookId
        if(!validation.isValidObjectId(bookId)){
            res.status(400).send({status:false, msg:"Invalid BookId"})
            return
        }

        const bookDetails = await bookModel.findOne({_id:bookId, isDeleted:false}).lean()
        if(!bookDetails){
            res.status(404).send({status:false, msg:"no book found"})
            return
        }

        const reviewDetails = await reviewModel.find({bookId, isDeleted:false})
        
        bookDetails.reviewsData=reviewDetails

        res.status(200).send({status:true, message:"Books list", data:bookDetails})
    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}

// - Update a book by changing its
//   - title
//   - excerpt
//   - release date
//   - ISBN
// - Make sure the unique constraints are not violated when making the update
// - Check if the bookId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
// - Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure) 
// - Also make sure in the response you return the updated book document. 

const updateBook = async function(req,res){
    try{
        const bookId = req.params.bookId
        const requestBody = req.body

        // Validation on rquestBody obj
        if(!validation.isValidObject(requestBody)){
            res.status(400).send({status:false, msg:"pls provide data to update book document"})
            return
        }

        // Validation on fields whose type is String
        let typeStringField = ["title","excerpt","ISBN","category","subcategory"]
        for(let key of typeStringField){
            if(!validation.isValidString(requestBody[key]) && Object.keys(requestBody).includes(key)){
                res.status(400).send({status:false, msg:`${key} can't be empty / String only`})
                return
            }
        }

        // Validation on releasedAt
        if(requestBody.releasedAt){
            if(Object.prototype.toString.call(requestBody.releasedAt)!="[object Date]"){
                res.status(400).send({status:false, msg:"releasedAt type DATE only"})
                return
            }
        }

        // Check to make sure the unique constraints are not violated when making the update
        // let arr=["title","ISBN"]
        // for(let key in requestBody){
        //     console.log(key)
        //     if(arr.includes(key) && key == "title"){
        //         let uniqueFieldData = await bookModel.findOne({key:requestBody[key]})
        //         console.log(uniqueFieldData,{key:requestBody[key]})
        //         console.log(requestBody[key])
        //         if(uniqueFieldData){
        //             res.status(400).send({status:false, msg:`can't update ${key} field due to unique constraint`})
        //             return
        //         }
        //     }
        // }


         // Check to make sure the unique constraints are not violated when making the update
         let arr=["title","ISBN"]
         for(let key in requestBody){
             if(arr.includes(key) && key == "title"){
                 let uniqueFieldData = await bookModel.findOne({title:requestBody[key]})
                 if(uniqueFieldData){
                     res.status(400).send({status:false, msg:`can't update ${key} field due to unique constraint`})
                     return
                 }
             }
             if(arr.includes(key) && key == "ISBN"){
                 let uniqueFieldData = await bookModel.findOne({ISBN:requestBody[key]})
                 if(uniqueFieldData){
                     res.status(400).send({status:false, msg:`can't update ${key} field due to unique constraint`})
                     return
                 }
             }
         }

        

        const updateBook = await bookModel.findByIdAndUpdate(bookId,requestBody,{new:true})
        

        res.status(200).send({status:true, message:"Success", data:updateBook})


    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}

const deleteBook = async function(req,res){
    try{
        const bookId=req.params.bookId

        const deleteBook = await bookModel.findByIdAndUpdate(bookId,{isDeleted:true, deletedAt:new Date()})

        res.status(200).send({status:true, msg:"Successfully deleted"})


    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}



module.exports={
    createBook,
    getBookByParam,
    getBookById,
    updateBook,
    deleteBook

}