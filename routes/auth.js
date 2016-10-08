var express     = require('express'),
    router      = express.Router( {mergeParams: true} ),
    passport    = require('passport');

router.get('/signup', function(req, res) {
    res.render('signup');
});

module.exports = router;