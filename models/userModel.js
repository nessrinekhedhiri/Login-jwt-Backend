const mongoose=require("mongoose")

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    DisplayName:{
        type:String
    }

})


module.exports= user=mongoose.model("User",UserSchema)
