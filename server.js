const express=require('express')
const mongoose=require('mongoose')
const User=require('./models/User')
const bcrypt=require('bcryptjs')
require('dotenv').config()
const PORT=3000
const app=express()
app.use(express.json())
mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log("Database connected successfully")
    ).catch((err)=>console.log(err))
app.get('/',async(req,res)=>{
    try{
        res.send("<h1 align=center>Welcome to backend developing!</h1>")
    }
    catch(err)
    {
        console.log(err)
    }
})
app.post('/register',async(req,res)=>{
    const{username,email,password}=req.body
    try{
        const hashPassword=await bcrypt.hash(password,10)
        const newUser=new User({username,email,password:hashPassword})
        await newUser.save()
        console.log("New User created successfully")
        res.json({message:'User created successfully'})
    }
    catch(err)
    {
        console.log(err)
    }
})
app.post('/login',async(req,res)=>{
    const{email,password}=req.body
    try{
        const user=await User.findOne({email});
        if(!user || !(await bcrypt.compare(password,user.password)))
            {
            return res.status(400).json({message:"User not found"});
        }
        res.json({message:"User logged in successfully",username:user.username});
    }
    catch(err)
    {
        console.log(err)
    }
})
app.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }
    console.log("Server is running on port:"+PORT)
})