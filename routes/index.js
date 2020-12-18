var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

    if (req.session.theUser) {
        res.render('index', {
            currentUser: req.session.theUser
        });
    } else {
        res.render('index', {
            currentUser: ""
        });
    }

});

module.exports = router;