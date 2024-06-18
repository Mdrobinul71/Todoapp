const express = require("express");
const router = express.Router();
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const authentice = require("../middleware/authentice");
const Todomodel=require("../model/Todomodel")

router.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

// router.post("/about",(req,res)=>{
//     const recdata=req.body
//     console.log(recdata)
//     res.json({ message: 'Data received successfully' });
// })

router.post("/signup", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  //console.log(req.body.name)
  //console.log(name)
  try {
    if (!name || !email || !phone || !work || !password || !cpassword) {
      return res.status(422).json({ message: "pls fill the property" });
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ text: "user is exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ text: "password is not match" });
    } else {
      const userMake = new User({
        name,
        email,
        phone,
        work,
        password,
        cpassword,
      });
      await userMake.save();
      res.status(201).json({ message: "user make is succes" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(422)
        .json({ message: "Please fill in all the required fields." });
    }

    const userLogin = await User.findOne({ email: email });

    if (!userLogin) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, userLogin.password);

    let token = await userLogin.generateAuthToken();
    console.log(token);
    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
    });

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    } else {
      return res.status(200).json({ message: "User logged in successfully." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/notepad", authentice, (req, res) => {
  console.log("hello user");
  res.send(req.rootUser);
});

router.get("/getdata",authentice,(req,res)=>{
  res.send(req.rootUser)
});
/*
router.post("/contact",async(req,res)=>{
  try{
    const {name,email,phone,message}=req.body;
    if(!name || !email || !phone || !message){
      return res.status(400).json({message:"pls fill the item"})
    }
    const userContact=User.findOne({_id:req.Userid})
    if(userContact){
      //send value in schema
      const userMessage=await userContact.addMessage(name,email,phone,message);
      await userContact.save();
      res.status(201).json({message:"text send"})
    }

  }catch(err){
    console.log(err)
  
  }
  })
  */

  router.post("/contact",authentice,async(req,res)=>{
    try{
      const {name,email,phone,message}=req.body
      if (!name || !email || !phone || !message){
        return res.send({error:"pls fill the contact"});
      }
      const userContact=await User.findOne({_id:req.userID})
      if(userContact){
        //send value with argument in schema
        const userMessage=await userContact.addMessage(name,email,phone,message);
        await userContact.save();
        res.status(201).json({message:"user contact sucessfully"});
      }
    }catch(err){
      console.log(err)
  
    }
  });

  router.get("/logout", (req, res) => {
    res.clearCookie("jwtoken", { path: "/" });
    res.status(200).json({ message: "Logout successful" });
  });

 // Create a new to-do item
router.post("/todos", async (req, res) => {
  try {
    const { task } = req.body;
    const newTask = new Todomodel({ task });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Failed to add task." });
  }
});

// Read all to-do items
router.get("/todos", async (req, res) => {
  try {
    const todos = await Todomodel.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
});

// Update a to-do item
router.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { task, completed } = req.body;
    const updatedTask = await Todomodel.findByIdAndUpdate(id, { task, completed }, { new: true });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task." });
  }
});

// Delete a to-do item
router.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Todomodel.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task." });
  }
});




  


module.exports = router;
