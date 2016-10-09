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
                        //check to see if the person clicked 'log in'
                        if (req.body.clock == 'in') {
                            //go ahead an log them in
                            newlyCreatedTimestamp.logIn = true;
                            foundEmployee[0].currentlyWorking = true;
                            logState += "logged in";
                        } else {
                            //flag as inappropriate, because the person is trying to log out when they are already logged out
                            newlyCreatedTimestamp.logIn = false;
                            foundEmployee[0].currentlyWorking = false;
                            //do some error handling here, either directly, or fired off of when a timestamp is inappropriate
                            newlyCreatedTimestamp.inappropriate = true;
                            logState += "logged out, but something was wrong";
                        }
                    }
                    else {
                        //check to see if the employee clicked 'log out'
                        if (req.body.clock == 'out') {
                            //go ahead and log them out.  
                            newlyCreatedTimestamp.logIn = false;
                            foundEmployee[0].currentlyWorking = false;
                            logState += "logged out";
                        } else {
                            //flag as inappropriate because they are trying to log in when they are already logged in 
                            newlyCreatedTimestamp.logIn = true;
                            foundEmployee[0].currentlyWorking = true;
                            logState += "logged in, but something was wrong";
                        }
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