import {Common} from '../common';
import {Node} from './node';
import {Utility} from '../utility';

export class TreeNode extends Node{
  static inject() { return [Common, Element, Utility]; }
  constructor(common, element, utility){
    super();
    this.common = common;
    this.element = element;
    this.utility = utility;

    this.node =  null;
    this.node_id = null;
    this.url = "";
    this.title = null
    this.collapsed = null;
    this.children = null;
    this.metaRef = null;
    this.meta = null;
  }

  activate(model){
    // console.log("activate, model.node_id:"+model.node_id)
    this.node_id = model.node_id;
    this.parentVM = model.parentVM;
    this.treeVM = model.parentVM.treeVM;
    this.parentVM.addChildVM(this, this.node_id);

    var that = this;
    this.nodeRef = this.treeVM.dirNodesRef.child(this.node_id);
    this.nodeRef.on('value', function(dataSnapshot) {
      if (that.treeVM.editing) return;
      console.log("this.nodeRef.on('value', model.node_id:"+model.node_id)
      var data = dataSnapshot.val();
      console.log(data)
      if (!data) return;
      that.node = data;
      if (!that.node.children) that.node.children = [];
    });

    this.metaRef = this.treeVM.filesRef.child(this.node_id).child("meta");
    this.metaRef.on('value', function(dataSnapshot) {
      if (that.treeVM.editing) return;
      var data = dataSnapshot.val();
      if (!data) return;
      that.meta = data;
      console.log(that.meta)
      if ("directory" != that.meta.type) {
        that.url = "./#" + that.meta.type + "/online/" + that.meta.id + "/root";
      }
    });
  }
}