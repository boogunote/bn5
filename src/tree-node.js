import {Behavior} from 'aurelia-framework';
import {DataSource} from './data-source';
import {Node} from './node';
import {Utility} from './utility';

export class TreeNode extends Node {
  static inject() { return [DataSource, Utility]; }
  constructor(dataSource, utility){
    this.dataSource = dataSource;
    this.utility = utility;
  }

  activate(model){
    // console.log("TreeNode activate");
    // console.log(model)
    this.node = model.node;
    this.parentVM = model.parentVM;
    this.treeVM = model.parentVM.treeVM;
  }

  toggle() {
    // console.log("toggle")
    this.node.collapsed = !this.node.collapsed;
  }

  onKeyDown(event) {
    console.log(event);
    if (13 == event.keyCode) {
      var before = null;
      var child = false;
      if (event.altKey) {
        before = true;
      } else if (event.ctrlKey) {
        before = false;
      } else if (event.shiftKey) {
        child = true;
      }
      if (child) {
        this.addChild();
      } else {
        this.parentVM.addChild(this.node.id, before);
      }
      return false;
    } else if (83 == event.keyCode && event.ctrlKey) {
      this.treeVM.save();
    }
    return true;
  }
}