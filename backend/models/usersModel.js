const { createHmac, randomBytes}=require("crypto");        //built in package
const mongoose=require('mongoose');
const { builtTheToken } = require("../services/auth");

const usersDataSchemma=new mongoose.Schema({
    fullName: 
    { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  monthlyIncome:{type:Number,default:60000},
  currency: { type: String, default: "INR" },
  lastUpdated: { type: Date, default: Date.now },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  bloodGroup: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
},{
    timestamps:true,
    strict:false
},)

usersDataSchemma.pre("save",function(next){   //run before the data going to save  , its a middlware and have access to the info which is going to store (use "this.")
    const user  =this;
    console.log("Pre save middleware triggered");

    if(!user.isModified("password")) return next();
    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac("sha256",salt).update(user.password).digest("hex");  //to store the password as encrypted 
    
    this.password=hashedPassword;
    this.salt=salt;

    console.log("Password encrypted and saved");
    next();
})

const usersDataModel=mongoose.model("users",usersDataSchemma,"usersData");
module.exports=usersDataModel;
