const mongoose=require("mongoose")
const  ObjectId  = mongoose.Schema.Types.ObjectId

// { 
//     title: {string, mandatory, unique},
//     excerpt: {string, mandatory}, 
//     userId: {ObjectId, mandatory, refs to user model},
//     ISBN: {string, mandatory, unique},
//     category: {string, mandatory},
//     subcategory: {string, mandatory },
//     reviews: {number, default: 0, comment: Holds number of reviews of this book},
//     deletedAt: {Date, when the document is deleted}, 
//     isDeleted: {boolean, default: false},
//     releasedAt: {Date, mandatory},
//     createdAt: {timestamp},
//     updatedAt: {timestamp},
//   }

const bookSchema = mongoose.Schema({
    title:{type:String, require:true, unique:true, trim:true, lowercase:true},

    excerpt:{type:String, require:true, trim:true, lowercase:true},

    userId:{type:ObjectId, require:true, ref:"User"},

    ISBN:{type:String, require:true, unique:true, trim:true, lowercase:true},

    category:{type:String, require:true, trim:true, lowercase:true},

    subcategory:{type:String, require:true, trim:true, lowercase:true},

    reviews:{type:Number, default:0},

    deletedAt:{type:Date},

    isDeleted:{type:Boolean, default:false},

    releasedAt:{type:Date, require:true},

},{timeStamps:true})

module.exports=mongoose.model("Book",bookSchema)