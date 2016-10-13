var express     = require('express'),
    router      = express.Router( {mergeParams: true} ),
    mongoose    = require('mongoose'),
    Employee    = require('../models/employees'),
    Timestamp   = require('../models/timestamps');

//RESTful routes

//NEW route
router.get('/timestamp/new', function(req, res) {
    
    res.render('timestamps/new', {employee: undefined, timestamp: undefined, logState: undefined});
});

//CREATE route
router.post('/timestamp', function(req, res) {
    Employee.find({'employeeNumber': req.body.employeeNumber}, function(err, foundEmployee) {
        if (err) console.log(err);
        else {            
            Timestamp.create({ time: req.body.time, employee: foundEmployee[0]._id }, function(err, newlyCreatedTimestamp) {
            //Timestamp.create({ time: Date.now(), employee: foundEmployee[0]._id }, function(err, newlyCreatedTimestamp) {
                if (err) console.log(err);
                else {
                    var logState = "";
                    if (!foundEmployee[0].currentlyWorking) {
                        //check to see if the person clicked 'log in'
                        if (req.body.clock == 'in') {
                            //go ahead an log them in
                            newlyCreatedTimestamp.logIn = true;
                            foundEmployee[0].currentlyWorking = true;
                        } else {
                            //flag as inappropriate, because the person is trying to log out when they are already logged out
                            newlyCreatedTimestamp.logIn = false;
                            foundEmployee[0].currentlyWorking = false;
                            //do some error handling here, either directly, or fired off of when a timestamp is inappropriate
                            newlyCreatedTimestamp.inappropriate = true;
                            logState += "you were already clocked out.";
                        }
                    }
                    else {
                        //check to see if the employee clicked 'log out'
                        if (req.body.clock == 'out') {
                            //go ahead and log them out.  
                            newlyCreatedTimestamp.logIn = false;
                            foundEmployee[0].currentlyWorking = false;
                        } else {
                            //flag as inappropriate because they are trying to log in when they are already logged in 
                            newlyCreatedTimestamp.logIn = true;
                            foundEmployee[0].currentlyWorking = true;
                            newlyCreatedTimestamp.inappropriate = true;
                            logState += "you were already clocked in";
                        }
                    }
                    newlyCreatedTimestamp.save();
                    foundEmployee[0].save();
                    console.log(newlyCreatedTimestamp);
                    res.render('timestamps/new', {employee: foundEmployee[0], timestamp: newlyCreatedTimestamp, logState: logState});
                }
            });
        }
    });
});

//SHOW timestamps
router.get('/timestamp/:id', function(req, res) {
    Employee.findById(req.params.id, function(err, employee) {
        console.log(req.params.id);
        if (err) {
            console.log(err);
        } else {
            Timestamp.find({'employee': req.params.id}, function(err, timestamps) {
                if (err) {
                    console.log(err);
                } else {
                    var one = timestamps[0].time;
                    var two = timestamps[1].time;
                    var diff = ((two - one)/1000)/60;
                    console.log(two, one);
                    console.log(diff);
                }
                res.send('you hit the timestamps show route');
            });
        }
    });
});

//this route will return all the timestamps between two given dates for an employee
router.post('/timestamp2/:id', function(req, res) {
    var period = getNumberOfDays(req.body.beginning, req.body.end);
    var hoursInfo = makeHoursInfo(period, req.body.beginning);
    console.log(hoursInfo);
    Employee.findById(req.params.id, function(err, employee) {
        if (err) {
            console.log(err);
        } else {
            Timestamp.find({'employee': req.params.id}, function(err, timestamps) {
                if (err) {
                    console.log(err);
                } else {
                    hoursInfo.forEach((day, index)=> {
                        var filtered = timestamps.filter(timestamp=> {
                            return timestamp.time > day.day && timestamp.time < addDays(day.day, 1);
                        });
                        //console.log(filtered);
                    });
                    
                    /*
                    var filtered = timestamps.filter(timestamp=>{
                        var beginning = new Date(req.body.beginning);
                        var end = new Date(req.body.end);
                        //var newDate = new Date('October, 12, 2016, 11:15 am');
                        return timestamp.time > beginning && timestamp.time < end;
                    });
                    
                    //console.log(filtered);
                    var timesWorked=[];
                    var clockedInCount = 0;
                    var clockedInTime;
                    var timeWorked;
                    filtered.forEach(timestamp=> {
                        var clock = timestamp.logIn === true ? "in":"out";
                        if (timestamp.logIn) {
                            if (clockedInCount === 0) {
                                clockedInTime = timestamp.time;
                                clockedInCount++;
                            }
                        } if (!timestamp.logIn) {
                            if (clockedInCount === 1) {
                                timeWorked = timestamp.time - clockedInTime;
                                timesWorked.push(timeWorked);
                                clockedInCount--;
                            }
                        }
                    });
                    timesWorked.forEach(time=> {
                        var converted = (time/1000)/60;
                        console.log(converted)
                    });
                    */
                }
                res.send('you hit the timestamps show route');
            });
        }
    });
});
function getNumberOfDays(beginning, end) {
    var beginning = new Date(beginning);
    var end = new Date(end);
    return (end - beginning)/(86400*1000);
}
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function makeHoursInfo(period, beginning) {
    var arr = [];
    for (var i = 0; i < period; i++) {
        arr.push({day: addDays(beginning, i), timestamps: [], workedPeriod: []});
    }
    return arr;
}


module.exports = router; 