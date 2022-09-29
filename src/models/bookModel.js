const mongoose=require("mongoose")
const  ObjectId  = mongoose.Schema.Types.ObjectId



const bookSchema = mongoose.Schema({
    title:{type:String, require:true, unique:true, trim:true, lowercase:true},

    excerpt:{type:String, require:true, trim:true, lowercase:true},

    userId:{type:ObjectId, require:true, ref:"User"},

    bookCover:{type:String, require:true},

    ISBN:{type:String, require:true, unique:true, trim:true, lowercase:true},

    category:{type:String, require:true, trim:true, lowercase:true},

    subcategory:{type:String, require:true, trim:true, lowercase:true},

    reviews:{type:Number, default:0},

    deletedAt:{type:Date},

    isDeleted:{type:Boolean, default:false},

    releasedAt:{type:Date, require:true},

},{timeStamps:true})

module.exports=mongoose.model("Book",bookSchema)