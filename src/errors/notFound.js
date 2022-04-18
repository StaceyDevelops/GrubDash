function notFound(request, response, next) {
  next({ status: 404, message: `Path not found: ${request.originalUrl}` });
}
//Exports the 404 Not Found handler function for use by the Express application.
module.exports = notFound;
