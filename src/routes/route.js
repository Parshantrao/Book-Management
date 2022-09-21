const express = require("express")
const router = express.Router()
const {userController,bookController,reviewController}= require("../controllers")
const {authMid}=require("../middleware")


router.get("/test", function(req,res){
    res.send("Working")
})

router.use("/books", authMid.authenticationMid)

router.post("/register",userController.createUser)

router.post("/login", userController.userLogin)

router.post("/books", bookController.createBook)

router.get("/books", bookController.getBookByParam)

router.get("/books/:bookId", bookController.getBookById)

router.put("/books/:bookId",  bookController.updateBook)

router.delete("/books/:bookId", authMid.authorizationMid, bookController.deleteBook)

router.post("/books/:bookId/review", reviewController.createReviewDoc)

router.put("/books/:bookId/review/:reviewId", reviewController.updateReviewDoc)

router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReviewDoc)




module.exports=router