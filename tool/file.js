
const xlsx = require('node-xlsx');
const nodeExcel = require('excel-export');

const fileModel = {
  analysisdata(path) {
    return new Promise((resolve, reject) => {
      const obj = xlsx.parse(path);
      resolve(obj);
    })
  },
  filterdata(data) {
    let arr = [];
    data.map((item, index) => {
      if(index !== 0) {
        arr.push({
          tel: String(item[0]),
          nickname: item[1],
          password: item[2],
          age: item[3]
        })
      }
    })
    return arr;
  },
  productData(data) {
    let arr = [];
    data.map((item, index) => {
      if(index !== 0) {
        arr.push({
          brand: String(item[0]),
          image: item[1],
          proname: item[2],
          color: item[3],
          price: item[4]
        })
      }
    })
    return arr;
  },
  exportdata(_headers, rows) {
    var conf = {};
    conf.name = "mysheet";
    conf.cols = [];
    for(var i = 0; i < _headers.length; i++) {
      var col = {};
      col.caption = _headers[i].caption;
      col.type = _headers[i].type;
      conf.cols.push(col);
    }
    conf.rows = rows;
    var result = nodeExcel.execute(conf);
    return result;
  }
}

module.exports = fileModel;