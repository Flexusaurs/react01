const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const adminRouter = require('./routes/adminRoutes');

// middlewares 


//// express.json gives access to req.body
app.use(express.json());
//morgan logging
if (process.env.NODE_ENV === 'development') {
  console.log('RUNNING IN DEVELOPMENT MODE');
  app.use(morgan('dev'));
} else {
  // console.log('RUNNING IN PRODUCTION MODE');
}

// STATIC PAGES
app.use(express.static(`${__dirname}/public`));

// add params to req
app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

// //  CORS policy
app.use(cors());

// ROUTES 

app.use('/admin/', adminRouter);

//// 404 handling
app.all('*', (req, res, next) => {
  let err = new AppError(`the requested url ${req.originalUrl} not found`, 404);

  next(err);
});

//// ERROR
app.use(globalErrorHandler);

module.exports = app;
