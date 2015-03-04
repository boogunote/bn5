import {DataSource} from './data-source';
import {Behavior} from 'aurelia-framework';

export class TreeNode{
  static inject() { return [DataSource]; }
  constructor(dataSource){
    this.dataSource = dataSource;
  }

  activate(model){
    console.log("TreeNode activate");
    console.log(model)
    this.child_id = model;

    var that = this;
    return this.dataSource.getData(this.child_id)
        .then(data => {
          that.node = JSON.parse(data);
        }).catch(err => {
          console.log(err);
        });
    // return this.http.get(url_base + this.item_id).then(response => {
    //   this.items = response.content.children;
    //   console.log(JSON.stringify(this.items));
    // });
  }
}
