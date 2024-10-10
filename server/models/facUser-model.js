//here creating the schema and generating the model
//this is to be done using mongoose

const mongoose = require("mongoose");
//getting the bcryptjs package for securing the password
const bcrypt = require("bcryptjs");
// getting jws token
const jwt = require("jsonwebtoken");

//this is the schema==>
const facUserSchema = new mongoose.Schema({
    name:{
        type: String,
        require : true,
    },
    email:{
        type: String,
        require:true,
    },
    password:{
        type: String,
        require: true,
    },
});
//schema ends

//creating pre method for pasword hashing
facUserSchema.pre("save",async function(next){
    const facUser = this;
    if(!facUser.isModified("password")){
        next();
    }
    try {
        const saltRound = await bcrypt.genSalt(10);
        const hashPswd = await bcrypt.hash(facUser.password, saltRound);
        facUser.password = hashPswd;
    } catch (error) {
        console.log(e);
    }
});

// creating the jwt token
facUserSchema.methods.generateToken = async function(){
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn : "30d"}
        );
    } catch (error) {
        console.error(error);
    }
}

//check password function while login
facUserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };



//now defining the model or connection name
const facUser = new mongoose.model("Facultie",facUserSchema);

module.exports = facUser;