import {Utility} from './utility';
import {Common} from './common';
import {Node} from './node';

export class Tree extends Node {
  static inject() { return [Common, Utility]; }
  constructor(common, utility){
    super();
    this.common = common;
    this.utility = utility;

    this.operationRecordList = [];
    this.operationRecordList.cursor = -1;

    this.file_id = null;
    this.root_id = "root";
    this.rootVM = this;
    this.file = null;
    this.title = null;
    this.fileRef = null;
    this.nodesRef = null;

    this.filePath = null;

    this.editing = false;
    this.updating = false;
    this.localChangedTime = 0;
    this.setToRemoteTime = 0;
    this.receiveRemoteTime = 0;
    this.localChangeWaitTime = 200;
    this.localChangeWaitEpsilon = 10;
    this.remoteChangeWaitTime = 1000;
    this.remoteChangeWaitEpsilon = 50;
  }

  activate(params, queryString, routeConfig) {
    console.log('activate');
    this.file_id = params.file_id;
    // this.root_id = params.root_id;
    this.rootRef = new Firebase(this.common.firebase_url);
    var authData = this.rootRef.getAuth();
    if (!authData) {
      console.log("Please login!")
      return;
    }
    this.fileRef = this.rootRef.child('/notes/users/' + authData.uid +
      '/files/' + this.file_id);
    this.nodesRef = this.fileRef.child("nodes");

    // console.log("params")
    // console.log(params)
    if ('online' == params.type) {
      var ref = new Firebase(this.common.firebase_url);
      var authData = ref.getAuth();
      if (!authData) {
        console.log("Please login!")
        return;
      }
      var that = this;
      this.fileRef.once('value', function(dataSnapshot) {
        console.log("1111111111111dataSnapshot.val()")
        that.file = dataSnapshot.val()
        console.log(that.file);
        if (that.file) {
          that.node = that.file.nodes.root;
          that.file_id = that.file.meta.id;
          console.log(that.node)
          console.log(that.file_id)
          that.loadNode(that.root_id, true);
          // that.loadTitle(that.root_id);
          setTimeout(function() {
            if (!that.node.children) that.node.children = [];
            for (var i = 0; i < that.node.children.length; i++) {
              that.setPosition(that.node.children[i]);
            };
          }, 10);
        }
      });

      // this.loadNodeDataById(this.file_id, this.root_id);
    }
  }

  delete(node) {
    var nodeRecordList = [];
    var subTree = this.utility.listToTree(this.rootVM.file.nodes, node.id);
    var position = this.removeSubTree(this.file.nodes.root.id, node.id);
    var nodeRecord = {
      parent_id: this.root_id,
      position: position,
      subTree: subTree
    };
    nodeRecordList.push(nodeRecord);
    this.rootVM.record(nodeRecordList, "remove");
  }

  // removeSubTree(parent_id, node_id) {
  //   var parent = this.file.nodes[parent_id];
  //   var position = -1;
  //   for (var i = 0; i < parent.children.length; i++) {
  //     if (parent.children[i] == node_id) {
  //       position = i;
  //       break;
  //     }
  //   };

  //   if (-1 == position) return;

  //   parent.children.splice(position, 1);

  //   var that = this;
  //   var remove_observer = function(vm) {
  //     Object.unobserve(vm.node, vm.localObserver);
  //     that.nodesRef.child(vm.node.id).off("value", vm.remoteObserver);
  //     for (var i = 0; i < vm.childVMList.length; i++) {
  //       remove_observer(vm.childVMList[i]);
  //     };
  //   }
  //   // remove_observer(this.childVMList[position]);
  //   remove_observer(this);
  //   var delete_sub_node = function(node_id) {
  //     that.nodesRef.child(node_id).remove();
  //     for (var i = 0; that.rootVM.file.nodes[node_id].children && i < that.rootVM.file.nodes[node_id].children.length; i++) {
  //       delete_sub_node(that.rootVM.file.nodes[node_id].children[i]);
  //     };
  //     that.file.nodes[node_id] = undefined;
  //   }

  //   delete_sub_node(node_id);
  //   // doEdit to prevent the modification, which send back from server.
  //   this.doEdit(function() {
  //     that.setNodeToServer(parent);
  //   })
  //   return position;
  // }

  newFlatNode() {
    var flatNode = this.utility.createNewFlatNode();
    this.nodesRef.child(flatNode.id).set(flatNode);
    var children = this.utility.getCleanChildren(this.node);
    this.file.nodes[flatNode.id] = flatNode
    this.node.children.push(flatNode.id);
    // var that = this;
    // setTimeout(function() {
    //   that.utility.initInteract(flatNode.id);
    // }, 0);

    children.push(flatNode.id);
    this.nodesRef.child("root/children").set(children);

    // this.doEdit(function() {
    //   // if (!this.root.children) this.root.children = [];
    //   children.push(flatNode.id);
    //   that.nodesRef.child("root/children").set(children);
    // });

    // record
    var nodeRecordList = [];
    var nodeRecord = {
      parent_id: this.root_id,
      position: children.length-1,
      node_id: flatNode.id,
      subTree: flatNode
    };
    nodeRecordList.push(nodeRecord);
    this.record(nodeRecordList, "insert");
  }

  setPosition(id) {
    // $("#"+id).css({left:this.file.nodes[id].x, top:this.file.nodes[id].y});//,
        // width:this.file.nodes[id].width, height:this.file.nodes[id].height})
  }
}