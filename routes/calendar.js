var express     = require('express'),
    router      = express.Router( {mergeParams: true} ),
    mongoose    = require('mongoose'),
    Timestamp   = require('../models/timestamps'),
    Hours       = require('../models/hours'),
    calendar    = require('../models/calendars'),
    Employee    = require('../models/employees');

//RESTful routes
//INDEX - list all calendars
router.get('/calendar', function(req, res) {
    res.render('calendars/index');
});
//NEW - form to create a new calendar
router.get('/calendar/new', function(req, res) {
    res.render('calendars/new');
});
//CREATE - take form submission and enter it into DB
router.post('/calendar', function(req, res) {
    var calendar = {
        isOfficial: req.body.isOfficial,
        name: req.body.name,
        createdBy: req.body.createdBy,
        start: req.body.start,
        periodDuration: req.body.periodDuration,
        numberOfPeriods: req.body.periods,
        periods: []
    };
    var start = new Date(req.body.start);
    var end = new Date(+new Date + 12096e5)
    
    for (var i = 0; i < req.body.periods; i++) {
        calendar.periods.push({start: "adsfas", end: "alskjdf;lkj"});
    }
    
    console.log(end);
    res.send(calendar);
});
//SHOW- show one calendar
router.get('/calendar/:cal_id', function(req, res) {
    res.render('calendars/show');
});
//EDIT - edit form for one calendar
router.get('/calendar/:cal_id/edit', function(req, res) {
    res.render('calendars/edit');
});
//UPDATE - take form submission from edit and post to DB
router.put('/calendar/:cal_id', function(req, res) {
    res.send('you hit the CALENDAR update route');
});
//DESTROY - delete one calendar
router.delete('/calendar/:cal_id', function(req, res) {
    res.send('you hit the CALENDAR delete route');
});


module.exports = router;