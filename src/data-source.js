var fs = require("fs");

export class DataSource {
  constructor(){
  }

  getData(id) {
    var dataPath = "/home/xgao/KuaiPan/bndata/";
    if ('root' == id) {
      console.log(fs.readFileSync(dataPath+"root.json").toString());
    };
  }
}