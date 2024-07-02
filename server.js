const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/API/users');
const profile = require('./routes/API/profile');
const posts = require('./routes/API/posts');
const app = express();
const connectToMongoDB = require('./config/keys');

require('dotenv').config();
connectToMongoDB();


//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());

//passport Cofig
require('./config/passport')(passport);


//user routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen( process.env.PORT, () => {console.log(`listening on port ${process.env.PORT}`)});

