import {Behavior} from 'aurelia-framework';
import {DataSource} from './data-source';
import {Utility} from './utility';

export class TreeNode{
  static inject() { return [DataSource, Utility]; }
  constructor(dataSource, utility){
    this.dataSource = dataSource;
    this.utility = utility;
  }

  activate(model){
    console.log("TreeNode activate");
    console.log(model)
    this.node = model.node;
    this.parentVM = model.parentVM;
    this.treeVM = model.parentVM.treeVM;
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