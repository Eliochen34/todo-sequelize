const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, passpord, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if(!user){
          return done(null, false, { message:'That email is not registered!' })
        }
        return bcrypt.compare(passpord, user.passpord).then(isMatch => {
          if(!isMatch){
            return done(null, false, { message:'Email or password incorrect.' })
          }
          return done(null, user)
        })
      })
      .catch(err => console.log(err))
  }))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON() // 將資料轉為plain
        done(null, user)
      })
      .catch(err => console.log(err))
  })
}