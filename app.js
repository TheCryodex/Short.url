const express = require('express');
const logger =  require('morgan');
const bodyParser  = require('body-parser');


const router = require('./routes/route');



const app = express();

//Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use((req, res, next)=>{
  alias = null;
  next();
})

//Routes
app.use('/', router);

//Catch 404
app.use((req, res, next) =>{
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Error Handler
app.use((err, req, res, next)=>{
const error = app.get('env') === 'development' ? err : {};
const status = err.status || 500;
res.status(status).json({
  error : {
    message : error.message
  }
});
  console.error(err);
});



//Starting the server
const port = app.get('port')||1333;

app.listen(port, () => {console.log(`Server is listening on port ${port}`)});
