var express = require('express');
var router = express.Router();
var User = require('../../models/user');

/* GET home page. */

router.post('/', function(req, res, next) {
    User.Post(req.user._id, req.body, function(err, posts){
      res.json(posts.networking_events);
    })
});

module.exports = router;
