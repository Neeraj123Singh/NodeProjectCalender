const jwt= require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
require('../db/conn'); 
const User = require('../model/userSchema');
const Calender = require('../model/calenderSchema');
const Event = require('../model/eventSchema');
const authenticate = require('../middleware');
router.get('/', (req,res)=>{
    res.send(`Hello World Router`);
});

router.post('/register',async (req,res)=>{
    /*
    //Using Promises
    const {name,email,password} = req.body;
    if(!name||!email||!password)
    {
        return res.status(422).json({
            "error":"Please Fill all the fileds"
        })
    }
    User.findOne({email:email})
    .then((userExist)=>{
        if(userExist){
            return res.status(422).json({error: "Email Already exists"});
        }
        const user = new User({name,email,password});
        user.save().then(()=>{
          res.status(201).json({mesaage: "user registered successfully"});  
        }).catch((err)=> res.status(500).json({error: "Failed to register"}));
    }).catch((err)=>{ console.log(err)});
    */
    const {name,email,password} = req.body;
    if(!name||!email||!password)
    {
        return res.status(422).json({
            "error":"Please Fill all the fileds"
        })
    }
    try{
        const userExist = await User.findOne({email:email});
        if(userExist){
            return res.status(422).json({error: "Email Already exists"});
        }
        const user = new User({name,email,password});
        
        await user.save();
        res.status(201).json({mesaage: "user registered successfully"});  
    }catch(err){
        console.log(err);
    }
    
})

router.post('/login', async (req,res)=>{
    let token;
    try{
        const {email,password} = req.body;
        if(!email || !password){
            res.status(422).json({mesaage: "Fill all fileds"});
        }
        const userLogin  = await User.findOne({email:email});
        if(userLogin)
        {
            const isMatch =await bcrypt.compare(password,userLogin.password);
            token = await  userLogin.generateAuthToken();
            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+258920000),
                httpOnly:true
            })
            if(!isMatch){
                res.status(201).json({mesaage: "Invalid Credentials"});
            }
            else
            {
                res.status(201).json({mesaage: "user SignIn successfully",token:token});
            }
        }else
        {
            res.status(400).json({mesaage: "user error"});
        }
    }catch(err){
        console.log(err);
    }
})
//calender route
router.post('/createCalender',authenticate ,async (req,res)=>{
    const {name} = req.body;
    userId = req.userId;
    try{
        const calenderExist = await Calender.findOne({userId:userId,name:name});
        if(calenderExist){
            return res.status(422).json({error: "Calender Already exists"});
        }
        const calender = new Calender({userId,name});
        
        await calender.save();
        res.status(201).json({message: "Calender Created successfully",calender:calender,"permlink":"localhost:3000/getCalender/"+calender._id});  
    }catch(err){
        console.log(err);
    }
 })

 router.get('/getCalender/:id',async (req,res)=>{
    const {name} = req.body;
    id= req.params.id;
    try{
        const calenderExist = await Calender.findOne({_id:id});
        if(calenderExist){
            return res.status(200).json({calender: calenderExist});
        }
        else{
            res.status(404).json({error: "Calender not found."});  
        }
    }catch(err){
        console.log(err);
    }
 })

 router.get('/calender/',authenticate,async (req,res)=>{
    userId = req.userId;
    try{
        const calenderExist = await Calender.find({userId:userId});
        if(calenderExist){
            return res.status(200).json({calender: calenderExist,user : req.rootUser});
        }
        else{
            res.status(404).json({error: "Calender not found."});  
        }
    }catch(err){
        console.log(err);
    }
 })

 router.delete('/calender/',authenticate,async (req,res)=>{
    const {id} = req.body;
    try{
        const calenderExist = await Calender.find({_id:id});
        if(calenderExist){
            await Calender.deleteOne({_id:id})
            return res.status(200).json({message: "Calender deleted Succesfully"});
        }
        else{
            res.status(404).json({error: "Calender not found."});  
        }
    }catch(err){
        console.log(err);
    }
 })

 router.put('/calender/',authenticate,async (req,res)=>{
    const {id,name} = req.body;
    try{
        const calender = await Calender.findOne({name:name});
        if(calender)
        {
            return res.status(501).json({message: "Calender with same details exists"});
        }
        const calenderExist = await Calender.findOne({_id:id});
        if(calenderExist){
            await calenderExist.update(name);
            return res.status(200).json({message: "Calender updated Succesfully",calender:calenderExist});
        }
        else{
            res.status(404).json({error: "Calender not found."});  
        }
    }catch(err){
        console.log(err);
    }
 })

//Event routes

router.post('/event', async (req,res)=>{
    const {calenderId,name,description,date,time} = req.body;
    try{
        const eventExist = await Event.findOne({calenderId:calenderId,name:name});
        if(eventExist){
            return res.status(422).json({error: "Event Already exists"});
        }
        const event = new Event({calenderId,name,description,date,time});
        
        await event.save();
        res.status(201).json({message: "Event Created successfully",event:event});  
    }catch(err){
        console.log(err);
    }
})

router.get('/getEvent/:id',async (req,res)=>{
    id= req.params.id;
    try{
        const eventExist = await Event.findOne({_id:id});
        if(eventExist){
            return res.status(200).json({event: eventExist});
        }
        else{
            res.status(404).json({error: "Event not found."});  
        }
    }catch(err){
        console.log(err);
    }
 })

 router.get('/event/',async (req,res)=>{
    calenderId = req.body.calenderId;
    try{
        const eventExist = await Event.find({calenderId:calenderId});
        if(eventExist){
            return res.status(200).json({event: eventExist});
        }
        else{
            res.status(404).json({error: " No Events found."});  
        }
    }catch(err){
        console.log(err);
    }
 })

 router.delete('/event/',async (req,res)=>{
    const {id} = req.body;
    try{
        const eventExist = await Event.find({_id:id});
        if(eventExist){
            await Event.deleteOne({_id:id})
            return res.status(200).json({message: "Event deleted Succesfully"});
        }
        else{
            res.status(404).json({error: "Event not found."});  
        }
    }catch(err){
        console.log(err);
    }
 })

 router.put('/event/',async (req,res)=>{
    const {id,calenderId,name,description,date,time} = req.body;
    try{
        const event = await Event.findOne({name:name,calenderId:calenderId});
        if(event)
        {
            return res.status(501).json({message: "Event with same details exists"});
        }
        const eventExist = await Event.findOne({_id:id});
        if(eventExist){
            await eventExist.update(req.body);
            return res.status(200).json({message: "Event updated Succesfully",event:eventExist});
        }
        else{
            res.status(404).json({error: "Event not found."});  
        }
    }catch(err){
        console.log(err);
    }
 })

router.get('/about',authenticate ,async (req,res)=>{
   res.status(200).json({mesaage: "about me"});
})

module.exports =router;
