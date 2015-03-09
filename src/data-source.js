var fs = require("fs");
var path = require("path");
var dataPath = "/home/xgao/KuaiPan/bndata/";

function fsReadFilePromise(filePath, options) {
  var resolve;
  var reject;

  fs.readFile(filePath, options, function(err, buf) {
    if (err) {
      reject(err);
      return;
    }
    resolve(buf.toString());
  });

  return new Promise(function(_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });
};

export class DataSource {
  constructor(){
  }

  getData(path) {
  	console.log(path)
    return fsReadFilePromise(path);
  }
}