var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {


//	session方式
	if(req.session.isLogin != 1) {
		res.redirect('/login');
		return;
	}
	
  res.render('cart', { activeIndex: 4 });
});

module.exports = router;
