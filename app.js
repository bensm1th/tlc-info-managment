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
    Employee        = require('./models/employees');

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


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Employee.authenticate()));
passport.serializeUser(Employee.serializeUser());
passport.deserializeUser(Employee.deserializeUser());

app.get('/', function(req, res) {
    res.send('APP IS WORKING');
})

app.listen(port, function() {
    console.log('tlc listening on port ' + port);
});