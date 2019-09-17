
var { MongoClient } = require('mongodb');
var mongodbUrl = 'mongodb://localhost:27017';

var sql = {
  insert: (datebase, collectionName, insertDate) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(mongodbUrl, (err, client) => {
        if (err) throw err;
      	const db = client.db(datebase);
     	const collection = db.collection(collectionName);
      	collection.insert(insertDate, (err) => {
      	  if (err) {
      	  	reject(err);
      	  } else {
      	  	resolve();
      	  }
      	  client.close();
      	})
      })
    })
  },

  remove: (database, collectionName, removeDate) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(mongodbUrl, (err, client) => {
        if (err) throw err;
        const db = client.db(database);
        const collection = db.collection(collectionName);
        collection.remove(removeDate, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
          client.close();
        })
      })
    })
  },

  update: (datebase, collectionName, updateType, whereUpdate, updateDate) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(mongodbUrl, (err, client) => {
        if (err) throw err;
        const db = client.db(datebase);
        const collection = db.collection(collectionName);
        collection[updateType](whereUpdate, updateDate, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
          client.close();
        })
      })
    })
  },

  find: (datebase, collectionName, whereData) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(mongodbUrl, (err, client) => {
        if (err) throw err;
        const db = client.db(datebase);
        const collection = db.collection(collectionName);
        collection.find(whereData).toArray((err, date) => {
          if (err) {
          	reject(err);
          } else {
          	resolve(date);
          }
          client.close();
        })
      })
    })
  },
  
  distinct: (datebase, collectionName, type) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(mongodbUrl, (err, client) => {
        if (err) throw err;
        const db = client.db(datebase);
        const collection = db.collection(collectionName);
        collection.distinct(type, (err, data) => {
        	if(err) throw err;
        	resolve(data)
        })
      })
    })
  },
  
  sort (database, collectionName, sortData) {
		return new Promise((resolve, reject) => {
			MongoClient.connect(mongodbUrl, (err, client) => {
				if (err) throw err;
				const db = client.db(database);
				const collection = db.collection(collectionName)
				collection.find({}).sort(sortData).toArray((err, data) => {
					if (err) throw err;
					resolve(data)
				})
			})    
	  })
	}
  
}

module.exports = sql;
