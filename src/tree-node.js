import {Behavior} from 'aurelia-framework';
import {DataSource} from './data-source';
import {Node} from './node';
import {Utility} from './utility';
import 'jquery-autosize';

export class TreeNode extends Node {
  static inject() { return [Element, DataSource, Utility]; }
  constructor(element, dataSource, utility){
    super();
    this.selected = false;
    this.element = element;
    console.log(element)
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

  attached() {
    autosize(this.element.children[0].children[1]);
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

  onBlur(event) {
    this.treeVM.focusedVM = null;
  }

  onClick(event) {
    if (event.ctrlKey) {
      this.select(!this.selected);
      return true;
    }
  }

  onFocus(event) {
    this.treeVM.focusedVM = this;
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
      var that = this;
      setTimeout(function() {
        that.treeVM.focusNodeAt(positionArray);
      }, 0);

      return false;
      
      // if (child) {
      //   positionArray.push(0);
      //   this.addChild();
      // } else {
      //   this.parentVM.addChild(this.node.id, before);
      // }
      // return false;
    }
    return true;
  }

  select(selected) {
    this.selected = selected;
    for (var i = 0; i < this.childVMList.length; i++) {
      this.childVMList[i].select(selected);
    };
  }
}