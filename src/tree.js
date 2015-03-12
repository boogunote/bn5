import {DataSource} from './data-source';
import {Node} from './node';
import {TreeParams} from './tree-params';
import {Utility} from './utility';

export class Tree extends Node {
  static inject() { return [DataSource, TreeParams, Utility]; }
  constructor(dataSource, treeParams, utility){
    this.dataSource = dataSource;
    this.treeParams = treeParams;
    this.utility = utility;
  }

  activate(params, queryString, routeConfig) {
    console.log("activate");
    console.log(this.treeParams.path);
    this.path = this.treeParams.path;
    var that = this;
    return this.dataSource.load(this.path)
        .then(jsonData => {
          this.jsonData = jsonData;
          this.treeVM = this;
          this.node = JSON.parse(jsonData);
        }).catch(err => {
          console.log(err);
        });
  }

  attached(){
    console.log("attached")
  }

  save() {
    this.dataSource.save(this.path, JSON.stringify(this.node))
        .catch(err => {
          console.log(err);
        });
  }
}
