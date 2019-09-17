var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var fileModel = require('./../tool/file');

/* GET sh1811s listing. */
router.get('/', function(req, res, next) {
	
//	session方式
	if(req.session.isLogin != 1) {
		res.redirect('/login');
		return;
	}

	let { pageCode, pageNumber } = req.query;
  pageCode = pageCode * 1 || 1;
  pageNumber = pageNumber * 1 || 6;
	sql.find('sh1811', 'product', {}).then(data => {
		const totalNumber = Math.ceil(data.length / pageNumber);
    data = data.splice((pageCode - 1) * pageNumber, pageNumber)
    sql.distinct('sh1811', 'product', 'brand').then(brandArr => {
	    res.render('product', { 
	      activeIndex: 3 ,
	      pageCode,
	      pageNumber,
	      totalNumber,
	      data,			//	< == > data: data
      	brandArr
	    })
    }).catch(err => {
      console.log(err)
    })
	})
});

//添加产品页面
router.get('/add', function(req, res, next) {
  res.render('product_add', { activeIndex: 3 });
});

//添加产品
router.post('/addProduct', function(req, res, next) {
  let { brand, image, proname, price, color } = req.body;
  sql.find('sh1811', 'product', { image }).then(data => {
    if(data.length == 0 && brand !== '' && image !== '' && proname !== '' && color !== '' && price !== '') {
      sql.insert('sh1811', 'product', { brand, image, proname, color, price }).then(() => {
        res.redirect('/product');
      }).catch((err) => {
        res.redirect('/product/add');
      })
    } else {
      res.redirect('/product/add');
    }
  })
});

//更新价格
router.post('/updateAction', function(req, res, next) {
  let { proname, price, pageCode } = req.body;
  if( price !== '' ){
  	price = price * 1;
  	sql.update('sh1811', 'product', 'updateOne', { proname }, {$set: { price }}).then(() => {
  	  res.redirect('/product?pageCode=' + pageCode);
    }).catch(() => {
  	  res.redirect('/product?pageCode=' + pageCode);
    })
  } else {
    res.redirect('/product?pageCode=' + pageCode);
  }
});

//	删除用户
router.get('/remove', function(req, res, next) {
  let { proname, pageCode } = req.query;
  sql.remove('sh1811', 'product', { proname }).then(() => {
    res.redirect('/product?pageCode=' + pageCode);
  }).catch(() => {
    res.redirect('/product?pageCode=' + pageCode);
  })
});

//	全部删除
router.get('/removeAll', function(req, res, next) {
  sql.remove('sh1811', 'product', {}).then(() => {
    res.redirect('/product');
  }).catch(() => {
    res.redirect('/product');
  })
});

// 导入用户
// const sh1811sxlsx = 'C:/Users/Administrator/Desktop/myapp/product.xlsx';
const sh1811sxlsx = '/usr/local/node-pro/myapp/product.xlsx';
router.get('/import', function(req, res, next) {
  fileModel.analysisdata(sh1811sxlsx).then(obj => {
    const data = obj[0].data;
    const result = fileModel.productData(data);
    // res.send(data)
    sql.insert('sh1811', 'product', result).then(() => {
      res.redirect('/product')
    })
  })
});

// 导出用户
router.get('/export', function(req, res, next) {
  const _headers = [
    { caption: 'brand', type: 'string'},
    { caption: 'image', type: 'string'},
    { caption: 'proname', type: 'string'},
    { caption: 'color', type: 'string'},
  	{ caption: 'price', type: 'string'}];
  sql.find('sh1811', 'product', {}).then(data => {
    let alldata = new Array();
    data.map((item, index) => {
      let arr = [];
      arr.push(item.brand);
      arr.push(item.image);
      arr.push(item.proname);
      arr.push(item.color);
      arr.push(item.price);
      alldata.push(arr);
    })
    const result = fileModel.exportdata(_headers, alldata);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		res.setHeader("Content-Disposition", "attachment; filename=" + "test.xlsx");
		res.end(result, 'binary');
  })
})

//型号搜索产品
router.get('/search', function(req, res, next) {
	const { proname } = req.query;
	sql.find('sh1811', 'product', { proname: eval('/'+proname+'/')}).then(data => {
		sql.distinct('sh1811', 'product', 'brand').then(brandArr => {
			res.render('product', {
				activeIndex: 3,
				pageCode: 1,
				totalNumber: 1,
				data,
				pageNumber: data.length,
				brandArr
			})
		})
	})
})

//品牌搜索
router.get('/brandsearch', function(req, res,next) {
	let { brand } = req.query;
	sql.find('sh1811', 'product', { brand }).then(data => {
		sql.distinct('sh1811', 'product', 'brand').then(brandArr => {
			res.render('product', {
				activeIndex: 3,
				pageCode: 1,
				totalNumber: 1,
				data,
				pageNumber: data.length,
				brandArr
			})
		})
	})
})

//价格排序
router.get('/sort', (req, res, next) => {
	let { type, num } = req.query;
	let sortData = {};
	sortData[type] = num * 1;
	sql.sort('sh1811', 'product', sortData).then(data => {
		sql.distinct('sh1811', 'product', 'brand').then(brandArr => {
			res.render('product', {
				activeIndex: 3,
				totalNumber: 1,
				pageCode: 1,
				data,
				pageNumber: data.length,
				brandArr
			})
		})
	})
})

module.exports = router;
