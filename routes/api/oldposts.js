var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.get('/', function(req, res, next){
  User.find({_id: req.user.id}, function(err, posts) {
    if(posts.length > 0){
      res.json(posts[0].networking_events);
    } else {
      res.sendStatus(200);
    }
  })
});

module.exports = router;
