const express = require('express');
const userRoute = require('./users/userRouter');
const server = express();


server.use(express.json())
server.use(logger)
server.use('/users', userRoute);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

server.use(function(req,res){
  res.status(404).send(`You Shall Not PASS! Like for real we can let you go where you want to go.`)
})

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'Origin'
      )}`
  );
  next();
};


module.exports = server;
