const {userModel,bookModel,reviewModel}=require("../models")
const jwt = require("jsonwebtoken")
const validation = require("../validators/validation")
const secreteKey = "functionupPlutonium((@)))(%$#)()))(*&"



// POST /books/:bookId/review
// - Add a review for the book in reviews collection.
// - Check if the bookId exists and is not deleted before adding the review. Send an error response with appropirate status code like [this](#error-response-structure) if the book does not exist
// - Get review details like review, rating, reviewer's name in request body.
// - Update the related book document by increasing its review count
// - Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like [this](#successful-response-structure)

const createReviewDoc = async function(req,res){
    try{
        const requestBody = req.body 
        const bookId = req.param.bookId

        //Extracting values from requestBody obj
        let {reviewedBy,rating,review,reviewedAt}=requestBody

        // Validation on requestBody obj
        if(!validation.isValidObject(requestBody)){
            res.status(400).send({status:false, msg:"pls provide review details"})
            return
        }

        // Validation on bookId
        if(!validation.isValidObjectId(bookId)){
            res.status(400).send({status:false, msg:"Invalid bookId"})
            return
        }

        // Check for bookId exist
        const bookDetails = await bookModel.findOne({_id:bookId, isDeleted:false})
        if(!bookDetails){
            res.status(404).send({status:false, msg:"no book found"})
            return
        }
        
    /////////  bookId:{type:ObjectId, require:true, ref:"Book"},
    //  reviewedBy:{type:String, require:true, default:"Guest"},
    //  reviewedAt:{type:Date, require:true},
    //  rating:{
    //     type:Number,require:true,
    //     min:[1,"rating must be grater then 1"],
    //     max:[5,"rating must be less than 5"]
    // },
    //  review:{type:String}
        // validation on reviewedBy
        if(reviewedBy){
            if(!validation.isValidString(reviewedBy) || !validation.isLetters(reviewedBy)){
                res.status(400).send({status:false, msg:"reviewedBy can contain letters only of type String "})
                return
            }
        }

        // validation on rating
        if(!rating){
            res.status(400).send({status:false, msg:"pls provide rating"})
            return
        }
        if(!validation.isValidNumber(rating)){
            res.status(400).send({status:false, msg:"rating type is Number"})
            return
        }
        if(rating<1 || rating>5){
            res.status(400).send({status:false, msg:"rating must be in between 1 to 5"})
            return
        }

        // validation on review
        if(review){
            if(!validate.isValidString(review) || !validation.isLetters(review)){
                res.status(400).send({status:false, msg:"review can contain letters only of type String "})
                return
            }
        }

        // validation on reviewedAt
        if(reviewedAt){
            if(Object.prototype.toString.call(reviewedAt)!="[object Date]"){
                res.status(400).send({status:false, msg:"reviewedAt must be in Date type"})
                return
            }
        }
        if(!reviewedAt){
            requestBody.reviewedAt=new Date()
        }

        // adding bookId in requesBody
        requestBody.bookId=bookId

        // creating reviews Document
        const newReview = await reviewModel.create(requestBody)

        // increasing review count in book document
        const book = await bookModel.findByIdAndUpdate(bookId,{$inc:{reviews:1}}).lean()
        book.reviewer=newReview

        res.status(200).send({status:true, message:"Success", data:book})


    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}


const updateReviewDoc = async function(req,res){
    try{

        //     ### PUT /books/:bookId/review/:reviewId
        // - Update the review - review, rating, reviewer's name.
        // - Check if the bookId exists and is not deleted before updating the review. Check if the review exist before updating the review. Send an error response with appropirate status code like [this](#error-response-structure) if the book does not exist
        // - Get review details like review, rating, reviewer's name in request body.
        // - Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like [this](#successful-response-structure)
        //     }

        const requestBody=req.body 
        const bookId=req.param.bookId
        const reviewId=req.param.reviewId

        //Extracting values from requestBody obj
        let {reviewedBy,rating,review,reviewedAt}=requestBody

        // validation for requestbody obj
        if(!validation.isValidObject(requestBody)){
            res.status(400).send({status:false, msg:"pls provide data to update"})
            return 
        }

        // validation for bookId and reviewId
        if(!validation.isValidObjectId(bookId)){
            res.status(400).send({status:false, msg:"Invalid bookId"})
            return
        }
        if(!validation.isValidObjectId(reviewId)){
            res.status(400).send({status:false, msg:"Invalid reviewId"})
            return
        }

        // Check for bookId exist
        const bookDetails = await bookModel.findOne({_id:bookId, isDeleted:false})
        if(!bookDetails){
            res.status(404).send({status:false, msg:"no book found"})
            return
        }

        // Check for reviewId exist
        const reviewDetails = await bookModel.findOne({_id:reviewId})
        if(!reviewDetails){
            res.status(404).send({status:false, msg:"no book found"})
            return
        }

        // vaidation on reviewedBy
        if(reviewedBy){
            if(!validation.isValidString(reviewedBy) || !validation.isLetters(reviewedBy)){
                res.status(400).send({status:false, msg:"reviewedBy can contain letters only of type String "})
                return
            }
        }

        // validation on rating
        if(rating){
            if(!validation.isValidNumber(rating)){
                res.status(400).send({status:false, msg:"rating type is Number"})
                return
            }
            if(rating<1 || rating>5){
                res.status(400).send({status:false, msg:"rating must be in between 1 to 5"})
                return
            }
        }

        // validation on review
        if(review){
            if(!validate.isValidString(review) || !validation.isLetters(review)){
                res.status(400).send({status:false, msg:"review can contain letters only of type String "})
                return
            }
        }

        // Update reviewDoc
        const updatedReviewDoc = await reviewModel.findByIdAndUpdate(reviewId,requestBody,{new:true})

        const book = await bookModel.findById(bookId).lean()
        book.reviewer=updatedReviewDoc

        res.status(200).send({status:true, message:"Success", data:book})


    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}



const deleteReviewDoc = async function(req,res){
    try{

    //     ### DELETE /books/:bookId/review/:reviewId
    // - Check if the review exist with the reviewId. Check if the book exist with the bookId. Send an error response with appropirate status code like [this](#error-response-structure) if the book or book review does not exist
    // - Delete the related reivew.
    // - Update the books document - decrease review count by one

        
        const bookId=req.param.bookId
        const reviewId=req.param.reviewId

        // validation for bookId and reviewId
        if(!validation.isValidObjectId(bookId)){
            res.status(400).send({status:false, msg:"Invalid bookId"})
            return
        }
        if(!validation.isValidObjectId(reviewId)){
            res.status(400).send({status:false, msg:"Invalid reviewId"})
            return
        }

        
        // Check for bookId exist
        const bookDetails = await bookModel.findOne({_id:bookId, isDeleted:false})
        if(!bookDetails){
            res.status(404).send({status:false, msg:"no book found"})
            return
        }

        // Check for reviewId exist
        const reviewDetails = await bookModel.findOne({_id:reviewId})
        if(!reviewDetails){
            res.status(404).send({status:false, msg:"no book found"})
            return
        }

        // Deleting reviewDoc
        const deletedDoc = await reviewModel.findByIdAndUpdate(reviewId,{isDeleted:true})

        // Updating bookDoc
        const book = await bookModel.findByIdAndUpdate(bookId,{$inc:{reviews:-1}})

        res.status(200).send({status:true, message:"successfully deleted"})

    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}


module.exports={
    createReviewDoc,updateReviewDoc,deleteReviewDoc
}