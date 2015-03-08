import {DataSource} from './data-source';
import {TreeParams} from './tree-params';

export class Flat{
  static inject() { return [DataSource, TreeParams]; }
  constructor(dataSource, treeParams){
    this.dataSource = dataSource;
    this.treeParams = treeParams;
    console.log(this.treeParams.path)
  }

  activate(params, queryString, routeConfig) {
    this.id = params.id;
    console.log("activate")
    console.log(params.id);
    return this.dataSource.getData(this.id)
        .then(data => {
          this.node = JSON.parse(data);
          console.log(this.node)
        }).catch(err => {
          console.log(err);
        });
  }

  attached(){
    console.log("attached")
  }
}
