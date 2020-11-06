const router=require("express").Router()
const User=require ('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const auth=require("../middelware/authentification")



router.post('/register',async (req,res)=>{
    try {
 let  {email,password,validpassword,displayname}=req.body

// valid 
if(!email||!password ||!validpassword )
    return res
            .status(400)
            .json({msg:'all the field are required'})
if(password.length < 5)
    return res
             .status(400)
             .json({msg:'the password must contain at least 5 caractere'})
 if(password!=validpassword)
     return res
            .status(400)
            .json({msg:'You should enter the same password twice to valid the password'})
  if(!displayname)
  return displayname=email          
 const ExistUser=  await User.findOne({email:email})
    if(ExistUser)
    return res
              .status(400)
              .json({msg:"An account with this email already exist"})

 const salt= await bcrypt.genSalt() 
 const hashpassword=  await bcrypt.hash(password,salt)

 const Newuser= new User({
     email,
     password:hashpassword,
     displayname
 })
 const SaveUser = await Newuser.save() 
 return res.json(SaveUser)

        }  
    catch(err)
    {
     res.status(500).json({err:err.message})
    }                             
})


router.post("/login",async (req,res)=>{

   try {
   const {email,password}=req.body
    //valide
    if( !email || !password)
     res.status(400).json({msg:"All the field are required"})
    const user= await User.findOne({email:email})
    if(!user)
    res.status(400).json({msg:"this count does not exist"})
    const ismatch = await bcrypt.compare(password,user.password)
    if(!ismatch)
     res.status(400).json({msg:"You should verify your password"})
    const token =jwt.sign({id:user._id},process.env.JWT_KEY)
         res.status(400).json({
        token,
        user:{
        id:user._id,    
        email:user.email,
        displayname:user.displayname
        }

    })
    }
    catch(err){
        res.status(500).json({err:err.message})
    }
})

router.delete("/delete",auth,async(req,res)=>{
   
    try{
    const user= await User.findByIdAndDelete(req.user)
   return res.status(200).json({msg:"the user  is deleted"})
     }
    catch(err){
        res.status.json({err:err.message})
    }
})
 
router.post("/tokenIsValid", async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
  
      const verified = jwt.verify(token, process.env.JWT_KEY);
      if (!verified) return res.json(false);
  
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
  
      return res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    console.log('user',user)
    res.json({
      displayname: user.displayname,
      id: user._id,
      email:user.email,
    });
  });

module.exports=router