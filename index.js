const express=require("express");
const mongoose  = require("mongoose")
const cors=require ("cors")
require  ("dotenv").config()
 const app=express()

 app.use(express.json())
 app.use(cors())


 //set up express
 const PORT=process.env.PORT || 5000
 app.listen(PORT,()=>console.log(`the server s runing in port ${PORT}`))

 //set up mongoose
 mongoose.connect(
    process.env.MONGOOSE_CONNECTION,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    (err) => {
      if (err) {console.log('can not connect')}
     else {console.log("MongoDB connection established")};
    }
  );

 // set up routes
 app.use('/user',require("./routes/UserRouter.js"))        