import {Behavior} from 'aurelia-framework';
import {DataSource} from './data-source';
import {Node} from './node';
import {Utility} from './utility';

export class TreeNode extends Node {
  static inject() { return [DataSource, Utility]; }
  constructor(dataSource, utility){
    super();
    this.dataSource = dataSource;
    this.utility = utility;
  }

  activate(model){
    // console.log("TreeNode activate");
    // console.log(model)
    this.node = model.node;
    this.parentVM = model.parentVM;
    this.treeVM = model.parentVM.treeVM;
    this.parentVM.addChildVM(this)
  }

  deactivate() {
    console.log("deactivate")
    this.parentVM.removeChildVM(this);
  }

  toggle() {
    // console.log("toggle")
    this.node.collapsed = !this.node.collapsed;
  }

  getPositionArray() {
    var positionArray = [];
    var vm = this;
    while (vm.parentVM) {
      for (var i = 0; i < vm.parentVM.node.children.length; i++) {
        if (vm.parentVM.node.children[i].id == vm.node.id) {
          positionArray.unshift(i);
          break;
        }
      };
      vm = vm.parentVM;
    }
    return positionArray;
  }

  onKeyDown(event) {
    // console.log(event);
    if (13 == event.keyCode) {
      var before = null;
      var child = false;
      var positionArray = this.getPositionArray();
      if (event.altKey) {
      } else if (event.ctrlKey) {
        positionArray[positionArray.length-1]++;
      } else if (event.shiftKey) {
        positionArray.push(0);
      } else {
        return true;
      }
      console.log(positionArray);
      var newNode = this.utility.createNewNode();
      this.treeVM.insertNodeAt(positionArray, newNode);
      var nodeRecord = {
        positionArray : positionArray,
        node : newNode
      }
      this.treeVM.record([nodeRecord], "insert");

      return false;
      
      // if (child) {
      //   positionArray.push(0);
      //   this.addChild();
      // } else {
      //   this.parentVM.addChild(this.node.id, before);
      // }
      // return false;
    } else if (event.ctrlKey && 46 == event.keyCode) {
      var positionArray = this.getPositionArray();
      var nodeRecord = {
        positionArray : positionArray,
        node : this.node
      }
      this.treeVM.record([nodeRecord], "remove");
      this.treeVM.removeNodeAt(positionArray);

    } else if (83 == event.keyCode && event.ctrlKey) {
      this.treeVM.save();
    } else if (event.ctrlKey && event.shiftKey && 90 == event.keyCode) {
      this.treeVM.undo();
    } else if (event.ctrlKey && event.shiftKey && 89 == event.keyCode) {
      this.treeVM.redo();
    } 
    return true;
  }
}