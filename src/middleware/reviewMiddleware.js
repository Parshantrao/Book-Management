const validation = require("../validators/validation");
const moment = require("moment");

const createReviewDocMid = async function (req, res, next) {
  try {
    const requestBody = req.body;
    const bookId = req.param.bookId;

    //Extracting values from requestBody obj
    let { reviewedBy, rating, review, reviewedAt } = requestBody;

    // Validation on requestBody obj
    if (!validation.isValidObject(requestBody)) {
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
        !validation.isValidString(reviewedBy) ||
        !validation.isLetters(reviewedBy)
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
    if (!rating) {
      res.status(400).send({ status: false, msg: "pls provide rating" });
      return;
    }
    if (!validation.isValidNumber(rating)) {
      res.status(400).send({ status: false, msg: "rating type is Number" });
      return;
    }
    if (!/^([1-5])$/.test(rating)) {
      res
        .status(400)
        .send({ status: false, msg: "rating must be in between 1 to 5" });
      return;
    }

    // validation on review
    if (review) {
      if (!validation.isValidString(review) || !validation.isLetters(review)) {
        res
          .status(400)
          .send({
            status: false,
            msg: "review can contain letters only of type String ",
          });
        return;
      }
    }

    requestBody.reviewedAt = moment().format("YYYY-MM-DD");

    // adding bookId in requesBody
    requestBody.bookId = bookId;
    req.requestBody = requestBody;
    next();
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};




const updateReviewDocMid = async function (req, res, next) {
  try {
    const requestBody = req.body;
    const bookId = req.param.bookId;
    const reviewId = req.param.reviewId;

    //Extracting values from requestBody obj
    let { reviewedBy, rating, review, reviewedAt } = requestBody;

    // validation for requestbody obj
    if (!validation.isValidObject(requestBody)) {
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
        !validation.isValidString(reviewedBy) ||
        !validation.isLetters(reviewedBy)
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
      if (!validation.isValidNumber(rating)) {
        res.status(400).send({ status: false, msg: "rating type is Number" });
        return;
      }
      if (!/^([1-5])$/.test(rating)) {
        res
          .status(400)
          .send({ status: false, msg: "rating must be in between 1 to 5" });
        return;
      }
    }

    // validation on review
    if (review) {
      if (!validate.isValidString(review) || !validation.isLetters(review)) {
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
    res.status(500).send({ status: false, msg: err.message });
  }
};



module.exports = {
  createReviewDocMid,
  updateReviewDocMid,
};
