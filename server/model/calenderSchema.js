const mongo=require('mongoose');

const calenderSchema = new mongo.Schema(
    {
        userId:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        }
    }
);

calenderSchema.methods.update = async function (name){
    try{
        this.name = name;
        await this.save();
    }catch(err){
        console.log("Error Occured");
    }
}

const Calender = mongo.model('Calender', calenderSchema);
module.exports = Calender;