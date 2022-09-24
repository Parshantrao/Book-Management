const {userModel,bookModel,reviewModel}=require("../models")
const validation = require("../validators/validation")
const moment = require("moment")




const createBook = async function(req,res){
    try{
        const requestBody = req.requestBody 

        // Extracting data from requestBody obj
        let {title,ISBN}=requestBody

        //=================== DB CALLs =================//
        
         //// Check for uniqueness of title and ISBN
         const book = await bookModel.find({$or : [ {title} , {ISBN} ] })    /// Object ShortHand property
         for(let key of book){
            if(key.title==title.trim().toLowerCase()){
                res.status(400).send({status:false,msg:`${title} is already taken`})
                return 
            }
            if(key.ISBN==ISBN.trim()){
                res.status(400).send({status:false,msg:`${ISBN} ISBN is already taken`})
                return
            }
        }


        // creating book document
        const newBook = await bookModel.create(requestBody)

        return res.status(201).send({status:false, message:"Success", data:newBook})

    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})
    }
}



const getBookByParam = async function(req,res){
    try{
        const queryParams = req.queryParams
        

        ///=================== DB CALL ===============//
        const books = await bookModel.find(queryParams).select({title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}).populate("userId").sort({title:1})

        if(books.length==0){
            res.status(404).send({status:false, msg:"No book found"})
            return
        }

        return res.status(200).send({status:true, message:"Success", data:books})
    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})
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

        return res.status(200).send({status:true, message:"Books list", data:bookDetails})
    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})
    }
}





const updateBook = async function(req,res){
    try{
        const bookId = req.params.bookId
        const requestBody = req.body

        // Check to make sure the unique constraints are not violated when making the update
        
        let uniqueFieldData = await bookModel.find( {$or : [ {title:requestBody.title} , {ISBN:requestBody.ISBN} ] } )
        for(let key of uniqueFieldData){
            if(key.title=requestBody.title){
                res.status(400).send({status:false, msg:"can't update title due to unique constraint"})
                return
            }
            if(key.ISBN=requestBody.ISBN){
                res.status(400).send({status:false, msg:"can't update ISBN due to unique constraint"})
                return
            }
        }

        const updateBook = await bookModel.findOneAndUpdate({_id:bookId,isDeleted:false},{$set:requestBody},{new:true})
        if(!updateBook){
            res.status(404).send({status:false, msg:"book not found"})
            return
        }

        /// Check for authorization
        if(req.headers.userId != updateBook.userId.toString()){
            res.status(403).send({status:false, msg:"unauthorized"})
            return
        }
        
        return res.status(200).send({status:true, message:"Success", data:updateBook})
    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})
    }
}




const deleteBook = async function(req,res){
    try{
        const bookId=req.params.bookId

        const book=await bookModel.findOne({_id:bookId,isDeleted:false})
        if(!book){
            res.status(400).send({status:false, msg:"book does not exist"})
            return
        }

         /// Check for authorization
         if(req.headers.userId!=book.userId.toString()){
            res.status(403).send({status:false, msg:"unauthorized"})
            return
        }

        const deleteBook = await bookModel.findByIdAndUpdate(bookId,{isDeleted:true, deletedAt:moment().format("YYYY-MM-DD")})

        return res.status(200).send({status:true, msg:"Successfully deleted"})

    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})
    }
}




module.exports={
    createBook,
    getBookByParam,
    getBookById,
    updateBook,
    deleteBook

}