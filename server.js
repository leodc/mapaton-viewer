
/**
 * 
 * Module Dependencies
 * 
 * */
 var express = require('express');
 var app = express();
 var http = require('http').Server(app);
 var path = require('path');
 var io = require('socket.io')(http);


/**
 * 
 * View engine
 * 
 * */
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'jade');
 
 
 /**
 * 
 * Service Configuration
 * 
 * */
 app.set('port', process.env.PORT || 16502);
 app.use(express.static(path.join(__dirname, 'public'))); //Make resources public


/**
 * 
 * Routers controllers
 * 
 * */
 var indexRouter = require("./routes/router.js");
 
 
 app.use("/", indexRouter);
 

/**
 * 
 * Start
 * 
 * */
http.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});