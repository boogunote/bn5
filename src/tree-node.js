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
    this.node = model;
  }

  onKeyDown(event) {
    console.log(event);
    return true;
  }
}