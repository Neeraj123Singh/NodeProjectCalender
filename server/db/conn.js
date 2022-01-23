const mongo=require('mongoose');
const url= 'mongodb://localhost:27017/project';
mongo.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("DB connected");
}).catch((err) => console.log("no connection"));

mongo.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("DB connected");
}).catch((err) => console.log("no connection"));
