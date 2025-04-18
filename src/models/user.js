const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt') // Changed from bcryptjs to bcrypt
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 255,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: (value) => validator.isStrongPassword(value),
        message:
          'Password must include uppercase, lowercase, number, and symbol',
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      validate: {
        validator: (value) =>
          ['male', 'female', 'other'].includes(value.toLowerCase()),
        message: "Gender must be 'male', 'female', or 'other'",
      },
    },
    about: {
      type: String,
      default: 'This is default about....',
    },
    photo: {
      type: String,
      default: '/public/User.jpeg', // More standard public path
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
)

// Method to generate JWT
userSchema.methods.getJWT = async function () {
  const user = this
  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET || 'techasiti', // Configurable secret
    {
      expiresIn: '7d',
    },
  )
  return token
}

// Method to validate password
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    this.password,
  )
  return isPasswordValid
}

const User = mongoose.model('User', userSchema)
module.exports = User
