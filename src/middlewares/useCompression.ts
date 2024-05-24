const compression = require('compression');

function shouldCompress(req: any, res: any) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

export default compression({ filter: shouldCompress });