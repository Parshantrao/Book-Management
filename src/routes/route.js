const express = require("express")
const router = express.Router()
const {userController,bookController,reviewController}= require("../controllers")
const {authMid, userMiddleware, bookMiddleware, reviewMiddleware}=require("../middleware")



router.get("/test", function(req,res){
    res.send("Working")
})

// user API's
router.post("/register",userMiddleware.createUserMid, userController.createUser)
router.post("/login", userController.userLogin)

// book API's
router.post("/books", authMid.authenticationMid ,bookMiddleware.createBookMid,  bookController.createBook)
router.get("/books", authMid.authenticationMid ,bookMiddleware.getBookMid, bookController.getBookByParam)
router.get("/books/:bookId", authMid.authenticationMid , bookController.getBookById)
router.put("/books/:bookId", authMid.authenticationMid ,bookMiddleware.updateBookMid,  bookController.updateBook)
router.delete("/books/:bookId", authMid.authenticationMid , bookController.deleteBook)

// review API's
router.post("/books/:bookId/review",reviewMiddleware.createReviewDocMid, reviewController.createReviewDoc)
router.put("/books/:bookId/review/:reviewId",reviewMiddleware.updateReviewDocMid, reviewController.updateReviewDoc)
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReviewDoc)




module.exports=router