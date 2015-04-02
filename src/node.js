import {Common} from './common'
import {Utility} from './utility';

export class Node {
  static inject() { return [Common, Utility]; }
  constructor(common, utility){
    this.childVMList = [];

    this.common = common;
    this.utility = utility;
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
    // console.log("this.childVMList")
    // console.log(this.childVMList)
  }

  addObserver(node, file_id, node_id) {
    function isReallyChange (changes) {
      var  really = true;
      for (var i = 0; i < changes.length; i++) {
        var bypassList = ["__observer__", "__observers__", "__array_observer__"];
        for (var j = 0; j < bypassList.length; j++) {
          if (changes[i].name == bypassList[j]) {
            really = false;
            break;
          }
        };
      };
      return really;
    }

    var ref = new Firebase(this.common.firebase_url);
    var authData = ref.getAuth();
    if (!authData) {
      console.log("Please login!")
      return;
    }
    var nodePath = '/notes/users/' + authData.uid +
      '/files/' + file_id + '/nodes/' + node_id;
    console.log(nodePath);
    var nodeRef = ref.child(nodePath);

    var that = this;

    var timeSupressLocalObserver = 0;
    var timeSupressRemoteObserver = 0;
    this.localObserver = function (changes) {
      if (!isReallyChange(changes)) return;
      if (that.utility.now() < timeSupressLocalObserver) return;
      var newNode = new Object();
      that.utility.copyAttributesWithoutChildren(newNode, node);
      newNode.children = [];
      for (var i = 0; i < node.children.length; i++) {
        newNode.children.push(node.children[i]);
      };
      console.log(newNode);
      nodeRef.set(newNode)
      timeSupressRemoteObserver = that.utility.now() + 1000;
    }

    Object.observe(node, this.localObserver);

    this.remoteObserver = function(dataSnapshot) {
      var newNode = dataSnapshot.val();
      if (!newNode) return;
      if (that.utility.now() < timeSupressRemoteObserver) return;
      console.log("dataSnapshot");
      console.log(dataSnapshot.val());
      timeSupressLocalObserver = that.utility.now() + 1000;
      that.utility.copyAttributes(node, newNode);
    }
    nodeRef.on("value", this.remoteObserver);

    // nodeRef.child("children").on("value", function(dataSnapshot) {
    //   console.log("dataSnapshot");
    //   console.log(dataSnapshot.val());
    // });
  }

  loadNodeFromLocalCache(node_id) {
    if (!this.node) {
      this.node = this.treeVM.file.nodes[node_id];
      if (this.node) {
        this.addObserver(this.node, this.treeVM.file_id, node_id);
      } else {
        this.loadNodeFromServer(this.treeVM.file_id, node_id);
      }
    }
  }

  loadNodeFromServer(file_id, node_id) {
    var ref = new Firebase(this.common.firebase_url);
    var authData = ref.getAuth();
    if (!authData) {
      console.log("Please login!")
      return;
    }
    var nodePath = '/notes/users/' + authData.uid +
        '/files/' + file_id + '/nodes/' + node_id;
    console.log("nodePath")
    console.log(nodePath)
    var nodeRef = ref.child(nodePath);
    var that = this;
    nodeRef.once('value', function(dataSnapshot) {
      console.log("loadNodeFromServer dataSnapshot.val()")
      console.log(dataSnapshot.val())
      that.node = dataSnapshot.val();
      that.addObserver(that.node, file_id, node_id);
      that.treeVM.file.nodes[that.node.id] = that.node;
    }, function(error) {
      console.log(JSON.stringify(error))
    });
  }

  removeChildVM(vm) {
    var insertPoint = -1;
    for (var i = 0; i < this.node.children.length; i++) {
      if (this.node.children[i].id == vm.node.id) {
        insertPoint = i;
        break;
      }
    };
    if (insertPoint != -1) {
      this.childVMList.splice(insertPoint, 1);
    };
    // console.log("this.childVMList")
    // console.log(this.childVMList)
  }

  // addChild(nodeId, before) {
  //   var targetId = -1;
  //   if (arguments.length == 0) {
  //     this.node.children.splice(0, 0, this.utility.createNewNode());
  //   } else {
  //     for (var i = 0; i < this.node.children.length; i++) {
  //       if (this.node.children[i].id == nodeId) {
  //         this.node.children.splice(before?i:i+1, 0, this.utility.createNewNode());
  //         break;
  //       }
  //     };
  //   }
  // }
}