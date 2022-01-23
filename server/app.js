const express = require('express');
const app= express();
app.use(express.json());
//db
require('./db/conn');
//routing
app.use(require('./router/auth'));
//models

const User = require('./model/userSchema');



app.listen(3000, ()=>{
    console.log("Server listening at port 3000");
})