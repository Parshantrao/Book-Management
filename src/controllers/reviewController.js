const { userModel, bookModel, reviewModel } = require("../models");
const jwt = require("jsonwebtoken");
const validation = require("../validators/validation");

const createReviewDoc = async function (req, res) {
  try {
    const requestBody = req.requestBody;
    const bookId = req.params.bookId;

    // creating reviews Document
    const newReview = await reviewModel.create(requestBody);

    // increasing review count in book document
    const book = await bookModel.findOneAndUpdate({_id:bookId, isDeleted:false}, { $inc: { reviews: 1 } },{new:true}).lean();
    if (!book) {
      res.status(404).send({ status: false, msg: "no book found" });
      return;
    }

    book.reviewer = newReview;

    return res.status(201).send({ status: true, message: "Success", data: book });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};




const updateReviewDoc = async function (req, res) {
  try {
    const requestBody = req.body;
    const bookId = req.params.bookId;
    const reviewId = req.params.reviewId;

    // Update reviewDoc
    const updatedReviewDoc = await reviewModel.findOneAndUpdate({_id:reviewId, isDeleted:false},requestBody,{new:true})
    if (!updatedReviewDoc) {
      res.status(404).send({ status: false, msg: "no review found" });
      return;
    }

    const book = await bookModel.findOne({_id:bookId, isDeleted:false}).lean();
    console.log(book)
    if (!book) {
      res.status(404).send({ status: false, msg: "no book found" });
      return;
    }
    book.reviewer = updatedReviewDoc;

    return res.status(200).send({ status: true, message: "Success", data: book });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};




const deleteReviewDoc = async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const reviewId = req.params.reviewId;

    // validation for bookId and reviewId
    if (!validation.isValidObjectId(bookId)) {
      res.status(400).send({ status: false, msg: "Invalid bookId" });
      return;
    }
    if (!validation.isValidObjectId(reviewId)) {
      res.status(400).send({ status: false, msg: "Invalid reviewId" });
      return;
    }

    // Deleting reviewDoc
    const deletedDoc = await reviewModel.findOneAndUpdate(
      { _id: reviewId, isDeleted: false },
      { isDeleted: true }
    );
    if (!deletedDoc) {
      res.status(404).send({ status: false, msg: "no review found" });
      return;
    }

    // Updating bookDoc
    const book = await bookModel.findOneAndUpdate(
      { _id: bookId, isDeleted: false },
      { $inc: { reviews: -1 } }
    );
    if (!book) {
      res.status(404).send({ status: false, msg: "no book found" });
      return;
    }

    return res.status(200).send({ status: true, message: "successfully deleted" });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = {
  createReviewDoc,
  updateReviewDoc,
  deleteReviewDoc,
};
