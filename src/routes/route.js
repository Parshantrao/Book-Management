const express = require("express")
const router = express.Router()
const {userController,bookController,reviewController}= require("../controllers")
const {authMid, userMiddleware, bookMiddleware}=require("../middleware")


router.get("/test", function(req,res){
    res.send("Working")
})

router.use("/books", authMid.authenticationMid)

router.post("/register",userMiddleware.createUserMid, userController.createUser)

router.post("/login", userController.userLogin)

router.post("/books",bookMiddleware.createBookMid,  bookController.createBook)

router.get("/books",bookMiddleware.getBookMid, bookController.getBookByParam)

router.get("/books/:bookId", bookController.getBookById)

router.put("/books/:bookId",bookMiddleware.updateBookMid,  bookController.updateBook)

router.delete("/books/:bookId", bookController.deleteBook)

router.post("/books/:bookId/review", reviewController.createReviewDoc)

router.put("/books/:bookId/review/:reviewId", reviewController.updateReviewDoc)

router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReviewDoc)




module.exports=router