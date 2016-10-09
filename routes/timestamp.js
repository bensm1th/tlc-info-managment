var express     = require('express'),
    router      = express.Router( {mergeParams: true} ),
    mongoose    = require('mongoose'),
    Employee    = require('../models/employees'),
    Timestamp   = require('../models/timestamps');

//RESTful routes

//NEW route
router.get('/timestamp/new', function(req, res) {
    
    res.render('timestamps/new');
});

//CREATE route
router.post('/timestamp', function(req, res) {
    Employee.find({'employeeNumber': req.body.employeeNumber}, function(err, foundEmployee) {
        if (err) console.log(err);
        else {            
            Timestamp.create({ time: Date.now(), employee: foundEmployee[0]._id }, function(err, newlyCreatedTimestamp) {
                if (err) console.log(err);
                else {
                    var logState = "You just ";
                    if (!foundEmployee[0].currentlyWorking) {
                        newlyCreatedTimestamp.logIn = true;
                        foundEmployee[0].currentlyWorking = true;
                        logState += "logged in";
                    }
                    else {
                        newlyCreatedTimestamp.logIn = false;
                        foundEmployee[0].currentlyWorking = false;
                        logState += "logged out";
                    }
                    newlyCreatedTimestamp.save();
                    foundEmployee[0].save();
                    res.send('<h1>' + logState + '</h1>');
                }
            });
            
        }
    });
});


module.exports = router; 