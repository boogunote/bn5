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
    var that = this;
    var localObserver = function (changes) {
      if (!isReallyChange(changes)) return;
      var ref = new Firebase(that.common.firebase_url);
      var authData = ref.getAuth();
      if (!authData) {
        console.log("Please login!")
        return;
      }
      var nodePath = '/notes/users/' + authData.uid +
        '/files/' + file_id + '/nodes/' + node_id;
      console.log(nodePath);
      var nodeRef = ref.child(nodePath);
      var newNode = new Object();
      that.utility.copyAttributes(newNode, node);
      console.log(newNode);
      nodeRef.set(newNode)
    }

    Object.observe(node, localObserver);
  }

  loadNodeDataById(file_id, node_id) {
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
    nodeRef.on('value', function(dataSnapshot) {
      console.log("dataSnapshot.val()")
      console.log(dataSnapshot.val())
      var firstTime = false;
      if (!that.node) {
        that.node = new Object();
        firstTime = true;
      }
      var newNode = dataSnapshot.val();
      that.utility.copyAttributesWithoutChildren(that.node, newNode);
      if (!newNode.children) {newNode.children = []};

      var copyChildren = false;
      if (!that.node.children) {
        copyChildren = true;
      } else if (that.node.children.length != newNode.children.length) {
        copyChildren = true;
      } else {
        for (var i = 0; i < newNode.children.length; i++) {
          if (that.node.children[i] != newNode.children[i]) {
            copyChildren = true;
            break;
          }
        }
      }
      if (copyChildren) {
        that.node.children = newNode.children;
      };

      if (firstTime) {
        that.addObserver(that.node, file_id, node_id);
      }
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