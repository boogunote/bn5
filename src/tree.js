import {DataSource} from './data-source';
import {TreeParams} from './tree-params';
import {Utility} from './utility';

export class Tree{
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

  addChild(nodeId, before) {
    var targetId = -1;
    if (arguments.length == 0) {
      this.node.children.splice(0, 0, this.utility.createNewNode());
    } else {
      for (var i = 0; i < this.node.children.length; i++) {
        if (this.node.children[i].id == nodeId) {
          this.node.children.splice(before?i:i+1, 0, this.utility.createNewNode());
          break;
        }
      };
    }
  }

  save() {
    this.dataSource.save(this.path, JSON.stringify(this.node))
        .catch(err => {
          console.log(err);
        });
  }
}
