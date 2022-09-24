const validation = require("../validators/validation");
const moment = require("moment");

const createReviewDocMid = async function (req, res, next) {
  try {
    // const requestBody = req.body;
    const bookId = req.params.bookId;

    //Extracting values from requestBody obj
    let { reviewedBy, rating, review, reviewedAt } = req.body;

    // Validation on requestBody obj
    if (!validation.isValidObject(req.body)) {
      res
        .status(400)
        .send({ status: false, msg: "pls provide review details" });
      return;
    }

    // Validation on bookId
    if (!validation.isValidObjectId(bookId)) {
      res.status(400).send({ status: false, msg: "Invalid bookId" });
      return;
    }

    // validation on reviewedBy
    if (reviewedBy) {
      if (
        !validation.isValidName(reviewedBy)
      ) {
        res
          .status(400)
          .send({
            status: false,
            msg: "reviewedBy can contain letters only of type String ",
          });
        return;
      }
    }

    // validation on rating
    if (!validation.isValid(rating)) {
      res.status(400).send({ status: false, msg: "pls provide rating" });
      return;
    }
    if (!validation.isValidRating(rating)) {
      res.status(400).send({ status: false, msg: "rating must be a number and  in between 1 to 5" });
      return;
    }
   

    // validation on review
    if (review) {
      if (!validation.isValidName(review) ) {
        res
          .status(400)
          .send({
            status: false,
            msg: "review can contain letters only of type String ",
          });
        return;
      }
    }

    req.body.reviewedAt = moment().format("YYYY-MM-DD");

    // adding bookId in requesBody
    req.body.bookId = bookId;

    req.requestBody = req.body;
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};




const updateReviewDocMid = async function (req, res, next) {
  try {
    // const requestBody = req.body;
    const bookId = req.params.bookId;
    const reviewId = req.params.reviewId;

    //Extracting values from requestBody obj
    let { reviewedBy, rating, review } = req.body;

    // validation for requestbody obj
    if (!validation.isValidObject(req.body)) {
      res
        .status(400)
        .send({ status: false, msg: "pls provide data to update" });
      return;
    }

    // validation for bookId and reviewId
    if (!validation.isValidObjectId(bookId)) {
      res.status(400).send({ status: false, msg: "Invalid bookId" });
      return;
    }
    if (!validation.isValidObjectId(reviewId)) {
      res.status(400).send({ status: false, msg: "Invalid reviewId" });
      return;
    }

    // vaidation on reviewedBy
    if (reviewedBy) {
      if (
        !validation.isValidName(reviewedBy) 
      ) {
        res
          .status(400)
          .send({
            status: false,
            msg: "reviewedBy can contain letters only of type String ",
          });
        return;
      }
    }

    // validation on rating
    if (rating) {
      if (!validation.isValidRating(rating)) {
        res.status(400).send({ status: false, msg: "rating must be a number and  in between 1 to 5" });
        return;
      }
    }

    // validation on review
    if (review) {
      if (!validation.isValidName(review) ) {
        res
          .status(400)
          .send({
            status: false,
            msg: "review can contain letters only of type String ",
          });
        return;
      }
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};



module.exports = {
  createReviewDocMid,
  updateReviewDocMid,
};
