const mongo=require('mongoose');

const eventSchema = new mongo.Schema(
    {
        calenderId:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        date:{
            type:String,
            required:true
        },
        time:{
            type:String,
            required:true
        } 
    }
);

eventSchema.methods.update = async function (data){
    const {name,description,date,time} = data;
    try{
        this.name = name;
        this.description = description;
        this.date = date;
        this.time = time;
        await this.save();
    }catch(err){
        console.log("Error Occured");
    }
}

const Event = mongo.model('Event', eventSchema);
module.exports = Event;