const mongoose=require("mongoose")
const ObjectId=mongoose.Schema.Types.ObjectId

// {
//     bookId: {ObjectId, mandatory, refs to book model},
//     reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
//     reviewedAt: {Date, mandatory},
//     rating: {number, min 1, max 5, mandatory},
//     review: {string, optional}
// }}

const reviewSchema = mongoose.Schema({
    bookId:{type:ObjectId, require:true, ref:"Book"},
    reviewedBy:{type:String, require:true, default:"Guest"},
    reviewedAt:{type:Date, require:true},
    rating:{
        type:Number,require:true,
        min:[1,"rating must be grater then 1"],
        max:[5,"rating must be less than 5"]
    },
    review:{type:String},
    isDeleted:{type:Boolean, default:false}

})

module.exports=mongoose.model("Review",reviewSchema)