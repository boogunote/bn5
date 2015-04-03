import {Behavior} from 'aurelia-framework';
import {Common} from './common'
import {DataSource} from './data-source';
import {Node} from './node';
import {Utility} from './utility';
import 'jquery-autosize';

export class TreeNode extends Node {
  static inject() { return [Common, Element, DataSource, Utility]; }
  constructor(common, element, dataSource, utility){
    super();
    this.common = common;
    this.selected = false;
    this.element = element;
    // console.log(element)
    this.dataSource = dataSource;
    this.utility = utility;
    this.ta = null;
  }

  activate(model){
    // console.log("TreeNode activate");
    // console.log(model)
    // this.node = model.node;
    this.parentVM = model.parentVM;
    this.treeVM = model.parentVM.treeVM;
    this.parentVM.addChildVM(this, model.node_id);
    this.loadNodeFromLocalCache(model.node_id);
    // this.loadNodeDataById(this.treeVM.file_id, model.node_id);
  }

  foldNode() {
    if (!this.node.fold)
      autosize(this.ta);
    else {
      var evt = document.createEvent('Event');
      evt.initEvent('autosize.destroy', true, false);
      this.ta.dispatchEvent(evt);
      this.ta.style.height = this.ta.scrollHeight;
    }
  }

  attached() {
    this.ta = this.element.getElementsByTagName("textarea")[0]
    this.foldNode();
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
      // var positionArray = this.getPositionArray();
      var updateNode = null;
      var updateNodeList = null;
      var currNodePosition = -1;
      for (var i = 0; i < this.parentVM.node.children.length; i++) {
        if (this.node.id == this.parentVM.node.children[i]) {
          currNodePosition = i;
          break;
        }
      };
      var insertParentNodeId = -1;
      var insertPosition = -1;
      if (event.altKey) {
        insertParentNodeId = this.parentVM.node.id;
        insertPosition = currNodePosition;
      } else if (event.ctrlKey) {
        insertParentNodeId = this.parentVM.node.id;
        insertPosition = currNodePosition + 1;
      } else if (event.shiftKey) {
        insertParentNodeId = this.node.id;
        insertPosition = 0;
      } else {
        return true;
      }

      var newNode = this.utility.createNewNode();
      var newNodeList = [newNode];
      console.log("insertPosition");
      console.log(insertPosition);
      this.treeVM.insertSubTree(insertParentNodeId, insertPosition,
          newNodeList, newNode.id);
      updateNode = this.treeVM.file.nodes[insertParentNodeId];
      updateNodeList = newNodeList;

      // Sync to server
      if (updateNode && updateNodeList) {
        var ref = new Firebase(this.common.firebase_url);
        var authData = ref.getAuth();
        if (!authData) {
          console.log("Please login!")
          return;
        }
        var childrenPath = '/notes/users/' + authData.uid + '/files/' + this.treeVM.file_id + 
            "/nodes/" + updateNode.id + "/children";
        var childrenRef = ref.child(childrenPath);
        // clean children;
        var children = []
        for (var i = 0; i < updateNode.children.length; i++) {
          children.push(updateNode.children[i]);
        };
        childrenRef.set(children);
        for (var i = 0; i < updateNodeList.length; i++) {
          var nodePath = '/notes/users/' + authData.uid + '/files/' + this.treeVM.file_id + 
              "/nodes/" + updateNodeList[i].id;
          var nodeRef = ref.child(nodePath);
          nodeRef.set(updateNodeList[i])
        };
      };
      // console.log(positionArray);
      
      // this.treeVM.insertNodeAt(positionArray, newNode);
      // var nodeRecord = {
      //   positionArray : positionArray,
      //   node : newNode
      // }
      // this.treeVM.record([nodeRecord], "insert");
      // var that = this;
      // setTimeout(function() {
      //   that.treeVM.focusNodeAt(positionArray);
      // }, 0);

      return false;
      
      // if (child) {
      //   positionArray.push(0);
      //   this.addChild();
      // } else {
      //   this.parentVM.addChild(this.node.id, before);
      // }
      // return false;
    } else if (83 == event.keyCode && event.altKey) {
      this.node.fold = !this.node.fold;
      this.foldNode(this.node.fold);
    }
    return true;
  }

  resize() {
    if (!this.ta) return;
    console.log("resize")
    var evt = document.createEvent('Event');
    evt.initEvent('autosize.update', true, false);
    this.ta.dispatchEvent(evt);
    this.ta.style.height = this.ta.scrollHeight;
  }

  select(selected) {
    this.selected = selected;
    for (var i = 0; i < this.childVMList.length; i++) {
      this.childVMList[i].select(selected);
    };
  }
}