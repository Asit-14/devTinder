// utils/validation.js

const validator = require('validator')

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName?.trim() || !lastName?.trim()) {
    throw new Error('Name is not valid')
  }

  if (!validator.isEmail(email)) {
    throw new Error('Please enter a valid email address')
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      'Password must be strong (include uppercase, lowercase, number, and symbol)',
    )
  }
}

// ✅ Export it
module.exports = { validateSignUpData }
