const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true
      },
      phone: {
        type: Number,
        required: true,
      },
      message: {
        type: String,
        required: true,
      }

    }
  ],
 

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
    this.cpassword = await bcrypt.hash(this.cpassword, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

userSchema.methods.addMessage = async function (nameval, emailval, phoneval, messageval) {
  try {
    this.messages = this.messages.concat({
      name: nameval,
      email: emailval,
      phone: phoneval,
      message: messageval,
    });
    await this.save();
    return this.messages;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;


/*
const mongosse = require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")

const userSchema = new mongosse.Schema({

    name: {
        type: "String",
        required: "true"
    },
    email: {
        type: "String",
        required: "true"
    },
    phone: {
        type: "number",
        required: "true"
    },
    work: {
        type: "String",
        required: "true"
    },
    password: {
        type: String,
        required: true,
    },
    cpassword: {
        type: String,
        required: true,
    },
    date:{
        type:Date,
        default:Date.now
    },
    messages:[{

        name: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true
          },
          phone: {
            type: Number,
            required: true,
          },
          message: {
            type: String,
            required: true,
          }

    }],
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
        this.cpassword = await bcrypt.hash(this.cpassword, 8);
    }
    next()
});

userSchema.methods.generateAuthToken= async function(){
    try{
        let token=jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    }catch(err){
        console.log(wee)
    }
};

userSchema.methods.addMessage=async function(nameval,emailval,phoneval,messageval){
    try{
        this.messages=this.messages.concat({
            name: nameval,
            email: emailval,
            phone: phoneval,
            message: messageval
        })
        await this.save()
        return this.messages;

    }catch(err){
        console.log(err)
        throw err
    }

}

  


const User = mongosse.model("user", userSchema)
module.exports = User

*/