var cors = require('cors')
const { ALLOWLIST } = require('../config')

var corsOptions = {
  origin: ALLOWLIST,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

module.exports = { cors: cors(corsOptions) }
