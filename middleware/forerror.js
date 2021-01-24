const winston = require("winston");

function ErrorHandle(err, req, res, next) {
  console.log(err.message);
  winston.error(err.message, err);
  // winston.log('error' , err.message,err);
  // Levels - > ( if set to info while adding the transports then only priority from error to info are logged else are ignored)
  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  res.status(500).send(err.message);
}

module.exports = ErrorHandle;
