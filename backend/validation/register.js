const validateRegisterData = (data) => {
    const errors = []
    console.log(data)
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' })
    }
  
    if (!data.password || data.password.length < 6 || !/\d/.test(data.password)) {
      errors.push({ field: 'password', message: 'Password must be at least 6 characters long and contain a number' })
    }
    console.log(errors)
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  module.exports = validateRegisterData
  
  