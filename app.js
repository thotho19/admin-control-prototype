require('dotenv').config();
const app = require('express')(),
    flash = require('connect-flash'),
    session = require('express-session'),
    FileStore = require('session-file-store')(session),
    passport = require('./auth/passport'),
    bodyParser = require('body-parser'),
    middleware = require('connect-ensure-login');

//middleware
app.set('view engine' , 'ejs');
app.use(flash());

app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));
app.use(session({
    store: new FileStore({
        path: 'server/sessions'
    }),
    secret: process.env.SESSION_SERVER_SECRET,
    maxAge: Date().now + (60 * 1000 * 30),
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req , res , next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
//routes
app.get('/login' , middleware.ensureLoggedOut()  ,(req , res)=>{
    res.render('login' , {
        user: null,
        errors : {
            username : req.flash('username'),
            password : req.flash('password')
        }
    });
});
app.post('/login' , passport.authenticate('localLogin' , {
    successRedirect: '/secret',
    failureRedirect: '/login',
    failureFlash: true
})
);
app.get('/logout' , (req , res)=>{
    req.logOut();
    return res.redirect('/secret');
})
app.get('/secret' , middleware.ensureLoggedIn() , (req , res)=>{
    res.send('this is a secret page!');
});

app.listen(process.env.SERVER_PORT , ()=>{
    console.log(`server start working on port [${process.env.SERVER_PORT}]`);
})
