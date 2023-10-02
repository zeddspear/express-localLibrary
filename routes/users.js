const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.get('/cool',(req,res,next)=>{
  res.render('cool',{title:"You are cool fr"});
})


module.exports = router;
