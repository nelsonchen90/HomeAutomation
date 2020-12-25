import bcrypt from 'bcrypt'

export const hashPassword = async (plainText) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainText, 10, (err, hash) => {
      if (err) {
        reject(err)
      } else {
        resolve(hash)
      }
    })
  })
}

export const validatePassword = async (plainText, hashedPasswordssword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainText, hashedPasswordssword, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
