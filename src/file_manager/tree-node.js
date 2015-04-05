import {Common} from '../common';
import {Node} from '../node';
import {Utility} from '../utility';

export class TreeNode extends Node{
  static inject() { return [Common, Element, Utility]; }
  constructor(common, element, utility){
    this.common = common;
    this.element = element;
    this.utility = utility;

    this.treeNode =  null;
    this.fileNode = null;
    this.url = null;
  }

  activate(model){
    this.treeNode = model.node;
    this.parentVM = model.parentVM;
    this.treeVM = model.parentVM.treeVM;
    console.log(this.parentVM);
    this.parentVM.addChildVM(this, model.node.id);

    this.metaRef = this.treeVM.filesRef.child(this.treeNode.id).child("meta");
    var that = this;
    this.metaRef.on('value', function(dataSnapshot) {
      that.fileNode = dataSnapshot.val();
      console.log(that.fileNode)
      that.url = "./#" + that.fileNode.type + "/online/" + that.fileNode.id + "/root";
    });
  }
}