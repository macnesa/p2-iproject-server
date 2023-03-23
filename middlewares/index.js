const { Controller } = require('../controllers');
const { User } = require('../models')

function errorHandler(error, req, res, next) {
  let { code, name, errors, response } = error

  let number = 500
  let message = 'Internal server error'

  if (response) {
    if (response?.data?.error?.status) {
      number = response?.data?.error?.status
    }
    message = response?.data?.error?.message
  }

  switch (code) {
    case 401:
      message = name || 'Unrecognized identity'
      break;
    case 403:
      message = name || 'Forbidden access'
      break;
    case 404:
      message = name || 'Data not found'
      break;
  }
  res.status(number).json({ message })
}

async function auth(req, res, next) {
  try {
    const { access_token } = req.headers
    if (!access_token) throw { code: 401 }

    const { id, country } = await Controller.getProfile(access_token)
    
    const findUser = await User.findOne({
      where: {
        userId: id
      }
    })
    if (!findUser) throw { code: 401 }
    req.token = access_token
    req.userCountry = country
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  errorHandler,
  auth
}