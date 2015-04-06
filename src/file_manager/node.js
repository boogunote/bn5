import 'firebase';
import {Common} from '../common'
import {Utility} from '../utility';

export class Node {
  static inject() { return [Common, Utility]; }
  constructor(common, utility){
    this.common = common;
    this.utility = utility;
    this.childVMList = [];
  }

  addChildVM(vm, id) {
    var insertPoint = -1;
    for (var i = 0; i < this.node.children.length; i++) {
      if (this.node.children[i] == id) {
        insertPoint = i;
        break;
      }
    };
    if (insertPoint != -1) {
      this.childVMList.splice(insertPoint, 0, vm);
    };
  }

  newItemInDirectory(newId) {

    this.treeVM.dirNodesRef.child(newId).set({
      id: newId
    });

    // this.node.children.push(newId);
    var children = [];
    for (var i = 0; this.node.children && i < this.node.children.length; i++) {
      children.push(this.node.children[i]);
    };
    children.push(newId);

    this.treeVM.dirNodesRef.child(this.node.id).child("children").set(children);
  }

  newDirectory() {
    var newId = this.utility.getUniqueId();
    this.newItemInDirectory(newId);

    var newDirectory = this.utility.clone(this.common.new_directory);
    newDirectory.meta.id = newId;
    newDirectory.meta.create_time = Firebase.ServerValue.TIMESTAMP;
    this.treeVM.filesRef.child(newId).set(newDirectory);
  }

  newTree() {
    var newId = this.utility.getUniqueId();
    this.newItemInDirectory(newId);

    var newTree = this.utility.clone(this.common.new_tree_note_skeleton);
    newTree.meta.id = newId;
    newTree.meta.create_time = Firebase.ServerValue.TIMESTAMP;
    this.treeVM.filesRef.child(newId).set(newTree);
  }

  newFlat() {
    var newId = this.utility.getUniqueId();
    this.newItemInDirectory(newId);

    var newFlat = this.utility.clone(this.common.new_flat_note_skeleton);
    newFlat.meta.id = newId;
    newFlat.meta.create_time = Firebase.ServerValue.TIMESTAMP;
    this.treeVM.filesRef.child(newId).set(newFlat);
  }

  delete() {
    if (!confirm("Delete?")) return;
    // remove sub-tree.
    var subTreeIdList = [];
    var that = this;
    function visit(vm) {
      if (!vm.node) return;
      for (var i = 0; i < vm.childVMList.length; i++) {
        visit(vm.childVMList[i]);
      };
      console.log(vm.node.id);
      that.treeVM.dirNodesRef.child(vm.node.id).remove();
      that.treeVM.filesRef.child(vm.node.id).remove();
    }
    visit(this);
    
    // remove from parent children list.
    var position = -1;
    for (var i = 0; i < this.parentVM.node.children.length; i++) {
      if(this.parentVM.node.children[i] == this.node.id) {
        position = i;
        break;
      }
    };
    if (-1 != position) {
      this.parentVM.node.children.splice(position, 1);
      var children = [];
      for (var i = 0; this.parentVM.node.children && i < this.parentVM.node.children.length; i++) {
        children.push(this.parentVM.node.children[i]);
      };
      this.treeVM.dirNodesRef.child(this.parentVM.node.id).child("children").set(children);
    };
  }

  rename() {
    var name = prompt("Please enter name name", this.meta.name);
    if (null == name)  return;
    this.meta.name = name;
    this.treeVM.filesRef.child(this.node.id).child('meta').child('name').set(name)
  }

  getPositionToParent() {
    var position = null;
    for (var i = 0; i < this.parentVM.node.children.length; i++) {
      if(this.parentVM.node.children[i] == this.node.id) {
        position = i;
        break;
      }
    };

    return position;
  }

  paste() {
    if (this.treeVM.clipping) {
      for (var i = 0; i < this.treeVM.clippedVMList.length; i++) {
        this.node.children.push(this.treeVM.clippedVMList[i].node.id);
        var oldParentPosition = this.treeVM.clippedVMList[i].getPositionToParent();
        this.treeVM.clippedVMList[i].parentVM.node.children.splice(oldParentPosition, 1);
      };

      var updateList = [this];
      for (var i = 0; i < this.treeVM.clippedVMList.length; i++) {
        var alreadyHere = false;
        for (var j = 0; j < updateList.length; j++) {
          if (updateList[j].node.id == this.treeVM.clippedVMList[i].parentVM.node.id) {
            alreadyHere = true;
            break;
          }
        };

        if (!alreadyHere) updateList.push(this.treeVM.clippedVMList[i].parentVM);
      };

      for (var i = 0; i < updateList.length; i++) {
        var children = [];
        for (var j = 0; j < updateList[i].node.children.length; j++) {
          children.push(updateList[i].node.children[j]);
        };
        this.treeVM.dirNodesRef.child(updateList[i].node.id).child("children").set(children);
      };

      this.treeVM.clipping = false;
      this.treeVM.clippedVMList = [];
    };
  }
}