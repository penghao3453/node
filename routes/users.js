var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var md5 = require('md5');
var fileModel = require('./../tool/file');

router.get('/', function(req, res, next) {
	
//	session方式
	if(req.session.isLogin != 1) {
		res.redirect('/login');
		return;
	}
	
  let { pageCode, pageNumber } = req.query;
  pageCode = pageCode * 1 || 1;
  pageNumber = pageNumber * 1 || 8;
  sql.find('sh1811', 'users', {}).then(data => {
    const totalNumber = Math.ceil(data.length / pageNumber);
    data = data.splice((pageCode - 1) * pageNumber, pageNumber)
    sql.distinct('sh1811', 'users', 'age').then(ageArr => {
	    res.render('users', { 
	      activeIndex: 2 ,
	      pageCode,
	      pageNumber,
	      totalNumber,
	      data,			//	< == > data: data
      	ageArr
	    })
    }).catch(err => {
      console.log(err)
    })
  })
});

//	添加用户页面
router.get('/add', function(req, res, next) {
  res.render('users_add', { 
    activeIndex: 2 
  });
});

//	添加用户
router.post('/addAction', function(req, res, next) {
  let { nickname, tel, password, age } = req.body;
  sql.find('sh1811', 'users', { tel }).then(data => {
    if(data.length == 0 && nickname !== '' && tel !== '' && password !== '' && age !== '') {
      password = md5(password);
      sql.insert('sh1811', 'users', { nickname, tel, password, age }).then(() => {
        res.redirect('/users');
      }).catch((err) => {
        res.redirect('/users/add');
      })
    } else {
      res.redirect('/users/add');
    }
  })
});

//	删除用户
router.get('/remove', function(req, res, next) {
  let { tel, pageCode } = req.query;
  sql.remove('sh1811', 'users', { tel }).then(() => {
    res.redirect('/users?pageCode=' + pageCode);
  }).catch(() => {
    res.redirect('/users?pageCode=' + pageCode);
  })
});

//	全部删除
router.get('/removeAll', function(req, res, next) {
  let { tel } = req.query;
  sql.remove('sh1811', 'users', {}).then(() => {
    res.redirect('/users');
  }).catch(() => {
    res.redirect('/users');
  })
});

//	更新昵称
router.post('/updateAction', function(req, res, next) {
  let { tel, nickname, age, pageCode } = req.body;
  if(nickname !== '' && age !== ''){
  	sql.update('sh1811', 'users', 'updateOne', { tel }, {$set: { nickname, age }}).then(() => {
  	  res.redirect('/users?pageCode=' + pageCode);
    }).catch(() => {
  	  res.redirect('/users?pageCode=' + pageCode);
    })
  } else {
    res.redirect('/users?pageCode=' + pageCode);
  }
});

// 导入用户
const usersxlsx = '/usr/local/node-pro/myapp/stu.xlsx';
router.get('/import', function(req, res, next) {
  fileModel.analysisdata(usersxlsx).then(obj => {
    const data = obj[0].data;
    const result = fileModel.filterdata(data);
    // res.send(data)
    sql.insert('sh1811', 'users', result).then(() => {
      res.redirect('/users')
    })
  })
});

// 导出用户
router.get('/export', function(req, res, next) {
  const _headers = [
    { caption: 'tel', type: 'string'},
    { caption: 'nickname', type: 'string'},
    { caption: 'password', type: 'string'}];
  sql.find('sh1811', 'users', {}).then(data => {
    let alldata = new Array();
    data.map((item, index) => {
      let arr = [];
      arr.push(item.tel);
      arr.push(item.nickname);
      arr.push(item.password);
      alldata.push(arr);
    })
    const result = fileModel.exportdata(_headers, alldata);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		res.setHeader("Content-Disposition", "attachment; filename=" + "test.xlsx");
		res.end(result, 'binary');
  })
})
 
//搜索用户
router.get('/search', function(req, res, next) {
	const { nickname } = req.query;
	sql.find('sh1811', 'users', { nickname: eval('/'+nickname+'/')}).then(data => {
//		res.send(data)
		sql.distinct('sh1811', 'users', 'age').then(ageArr => {
			res.render('users', {
				activeIndex: 2,
				pageCode: 1,
				totalNumber: 1,
				data,
				pageNumber: data.length,
				ageArr
			})
		})
	})
})

//年龄搜索
router.get('/agesearch', function(req, res,next) {
	let { age } = req.query;
	age = age * 1;
	sql.find('sh1811', 'users', { age }).then(data => {
//		res.send(data)
		sql.distinct('sh1811', 'users', 'age').then(ageArr => {
			res.render('users', {
				activeIndex: 2,
				pageCode: 1,
				totalNumber: 1,
				data,
				pageNumber: data.length,
				ageArr
			})
		})
	})
})

//年龄排序
router.get('/sort', (req, res, next) => {
	let { type, num } = req.query;
	let sortData = {};
	sortData[type] = num * 1;
	sql.sort('sh1811', 'users', sortData).then(data => {
		// res.send(data)
		sql.distinct('sh1811', 'users', 'age').then(ageArr => {
			res.render('users', {
				activeIndex: 2,
				totalNumber: 1,
				pageCode: 1,
				data,
				pageNumber: data.length,
				ageArr
			})
		})
	})
})

module.exports = router;
