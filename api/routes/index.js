var express = require('express');
var router = express.Router();

const key = "AIzaSyDcIChPg5D9yzbTfVUua6sCU22cEDYSMDM"


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log(key)
});

module.exports = router;
