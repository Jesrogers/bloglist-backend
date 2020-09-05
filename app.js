const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const { DB_URL } = require('./utils/config');
const express = require('express');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware');
const app = express();
const cors = require('cors');

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(console.log('connected!'))
.catch(err => console.log(`connection failed ${err}`));

app.use(cors()); //allows requests from other origins
app.use(express.json()) //takes JSON data of request, converts to JS object, attaches to body property of request object
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;