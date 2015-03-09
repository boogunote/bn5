import {DataSource} from './data-source';
import {TreeParams} from './tree-params';

export class Tree{
  static inject() { return [DataSource, TreeParams]; }
  constructor(dataSource, treeParams){
    this.dataSource = dataSource;
    this.treeParams = treeParams;
  }

  activate(params, queryString, routeConfig) {
    console.log("activate");
    console.log(this.treeParams.path);
    var that = this;
    return this.dataSource.getData(this.treeParams.path)
        .then(jsonData => {
          this.jsonData = jsonData;
          this.tree = JSON.parse(jsonData);
          var addParent = function (node, treeVM) {
            for (var i = 0; node.children && i < node.children.length; i++) {
              node.children[i].parent = node;
              node.children[i].treeVM = treeVM;
              addParent(node.children[i]);
            };
          }
          addParent(this.tree, this);
        }).catch(err => {
          console.log(err);
        });
  }

  attached(){
    console.log("attached")
  }
}
