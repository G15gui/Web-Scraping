const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: true,}));

const indexRouter = require('./routers/index');
app.use("/", indexRouter);
module.exports = app;
