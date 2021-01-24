function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      handler(req, res);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = asyncMiddleware;

// async function asyncMiddleware(handler){
//   try{
//     handler(req,res);
//   }catch(err){
//     next(err);
//   }
// }

// in this case we do not have req,res,next defined anywhere in the function
// note that in route handlers we do not call the functions just a Reference
// to the functions withh suitable parameters . Express puts the parameters on runtime
// so we do not have the liberty to do so .Note the function is async as in
// the handler we are dealing with promises . So this will not work as we do not have
// req,res,next parameters so insted of being a route handler we return a route handler ,
// so the express will enter the parameters itself on runtime , now this function is
// not async as it doesnot deal with promises rather ut returns a async function .
