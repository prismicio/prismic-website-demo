const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const prismicDOM = require('prismic-dom');
const prismicJS = require('prismic-javascript');

const prismicConfig = require('./prismic-configuration.js');
const linkResolver = require('./link-resolver');
const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add getCanonicalUrl function in locals
app.use(function (req, res, next) {
  res.locals.getCanonicalUrl = function (document) {
    return 'http://' + req.headers.host + linkResolver(document);
  };
  next();
});

// Prismic middleware
app.use(function (req, res, next) {
  res.locals.prismicEndpoint = prismicConfig.endpoint;
  res.locals.linkResolver = linkResolver;
  res.locals.linkAsUrl = function (field) {
    return prismicDOM.Link.url(field, linkResolver);
  };
  res.locals.richTextAsHtml = function (field) {
    return prismicDOM.RichText.asHtml(field, linkResolver);
  };
  res.locals.richTextAsPlain = function (field) {
    return prismicDOM.RichText.asText(field);
  };

  prismicJS.api(prismicConfig.endpoint, { req })
    .then((api) => {
      req.prismic = { api };
      next();
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
});

// retrieve Prismic layout content
app.use(function (req, res, next) {
  req.prismic.api.getSingle('layout')
    .then((document) => {
      res.locals.layoutContent = document.data;
      next();
    })
    .catch((error) => {
      next(`Error when retrieving "layout" document from Prismic. ${error.message}`);
    });
});

// routes
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
