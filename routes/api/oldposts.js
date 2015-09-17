var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.get('/', function(req, res, next){
  User.find({_id: req.user._id}, function(err, posts) {
    res.json(posts[0].networking_events);
  })
});

module.exports = router;
