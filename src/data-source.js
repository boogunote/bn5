
function fsReadFilePromise(filePath, options) {
  var resolve;
  var reject;

  var fs = require("fs");
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

function fsWriteFilePromise(filePath, data, position, encoding) {
  var resolve;
  var reject;

  var fs = require("fs");
  fs.writeFile(filePath, data, position, encoding, function(err, written) {
    if (err) {
      reject(err);
      return;
    }
    resolve(written);
  });

  return new Promise(function(_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });
};

export class DataSource {
  constructor(){
  }

  load(path) {
  	console.log(path)
    return fsReadFilePromise(path);
  }

  save(path, jsonData) {
    return fsWriteFilePromise(path, jsonData);
  }
}