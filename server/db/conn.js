const mongoose=require('mongoose');
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("connect")
})
.catch((err)=>{
    console.log(err)
})