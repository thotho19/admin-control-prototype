const passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

passport.serializeUser( (user, cb) => {
        cb(null, user);
    });
        
passport.deserializeUser( (obj, cb) => {
        cb(null, obj);
    });

passport.use('localLogin' , new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},
    (req , username , password , done)=>{
        if(username != process.env.USER_NAME){
            return done(null , false , req.flash('username' ,  'Username doesn\'t exists'));
        }
        if(password != process.env.PASSWORD){
            return done(null , false , req.flash('password' ,  'password wrong!'));
        }
        return done(null , {username: username , password: ''});
    }
    ));

module.exports = passport;