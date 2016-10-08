var express         = require('express'),       
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    methodOverride  = require('method-override'),
    flash           = require('connect-flash'),
    config          = require('./config/config'),
    port            = process.env.PORT || '3000',
    passport        = require('passport'),
    localStrategy   = require('passport-local'),

    //add models
    Employee        = require('./models/employees'),

    //add routes
    authRoutes      = require('./routes/auth');

mongoose.connect(config.dbLocation);

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: config.passportSecret,
    resave: false,
    saveUninitialized: false
}));

//enable routes
app.use(authRoutes);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Employee.authenticate()));
passport.serializeUser(Employee.serializeUser());
passport.deserializeUser(Employee.deserializeUser());



app.listen(port, function() {
    console.log('tlc listening on port ' + port);
});