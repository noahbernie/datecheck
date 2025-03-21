const validateRegisterData = (data) => {
    const errors = []
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!data.email || !emailPattern.test(data.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' })
    }
  
    if (!data.password || data.password.length < 6 || !/\d/.test(data.password)) {
      errors.push({ field: 'password', message: 'Password must be at least 6 characters long.' })
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  module.exports = validateRegisterData

  