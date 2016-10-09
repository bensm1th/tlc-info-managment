var express     = require('express'),
    router      = express.Router( {mergeParams: true} ),
    mongoose    = require('mongoose'),
    Employee    = require('../models/employees');

router.get('/signup', function(req, res) {
    res.render('signup');
});

router.post('/signup', function(req, res) {

    var newEmployee = ({
        firstName: req.body.firstName,
        lastName: 'lastName',
        employeeNumber: req.body.employeeNumber,
        address: 'address',
        phone: 1234,
        DOB: Date.now(),
        sickDaysLeft: 1234,
        vacationDaysLeft: 1234,
        hourlyPay: { applies: false, rate: 0},
        salary: { applies: true, rate: 1234},
        timeStamps: [],
        currentlyWorking: false
    });
    Employee.create(newEmployee, function(err, employee) {
        if (err) {
            console.log(err);
        } else {
            console.log(employee);
            res.send('YOU\'VE HIT THE CREATE USER ROUTE');
        }
    });
});


module.exports = router;
