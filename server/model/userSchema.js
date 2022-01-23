const jwt = require('jsonwebtoken');
const mongo=require('mongoose');
const bcrypt= require('bcryptjs');
const secret= 'ASDFGHJKJHGFDFGHJKHDFGHKJLHTFYHGYGGCFYGHVGKHGHVGFTGHBVHGJVGYHGJY';

const userSchema = new mongo.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:false
        }
    }
);

//hasing the password
userSchema.pre('save',async function(next){
      if(this.isModified('password')){
          this.password = await bcrypt.hash(this.password,12);
          console.log(this.password);
      }
      next();
})

userSchema.methods.generateAuthToken = async function (){
    try{
        let token = jwt.sign({_id:this._id},secret);
        this.token = token;
        await this.save();
        console.log(token);
        return token;
    }catch(err){
        console.log("Error Occured");
    }
}

const User = mongo.model('User', userSchema);
module.exports = User;