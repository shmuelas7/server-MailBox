const express = require('express')
require('dotenv').config()
require('./DL/db').connect()
const app = express();
const { authJWT } = require("./middlewares/auth");


app.use(require('cors')())
app.use(express.json())


const { auth } = require('./middlewares/auth')
app.all('*', auth)

app.use('/chat', require('./routers/chat.router'))
app.use('/user', require('./routers/user.router'))


app.listen(3213, () => console.log("##### Server is running #####"))