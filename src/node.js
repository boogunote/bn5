import {Common} from './common'
import {Utility} from './utility';

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
    // console.log("this.childVMList")
    // console.log(this.childVMList)
  }

  addObserver(node) {
    // console.log("addObserver-----------------------------------------------")
    // function isReallyChange (changes) {
    //   var  really = true;
    //   for (var i = 0; i < changes.length; i++) {
    //     var bypassList = ["__observer__", "__observers__", "__array_observer__"];
    //     for (var j = 0; j < bypassList.length; j++) {
    //       if (changes[i].name == bypassList[j]) {
    //         really = false;
    //         break;
    //       }
    //     };
    //   };
    //   return really;
    // }

    // var that = this;


    // if (!this.localObserver) {
    //   this.localObserver = function (changes) {
    //     if (!isReallyChange(changes)) return;
    //     if (that.rootVM.updating) return;
    //     that.doEdit(function() {
    //       that.setNodeToServer(node);
    //     })
    //   }

    //   Object.observe(node, this.localObserver);
    // }




    var that = this;
    if (!this.remoteObserver) {
      this.remoteObserver = function(dataSnapshot) {
        // console.log("remoteObserver")
        // console.log(dataSnapshot.val())
        if (that.rootVM.editing) return;
        if (that.utility.now() - that.rootVM.setToRemoteTime < 2000) return;
        var newNode = dataSnapshot.val();
        if (!newNode) return;
        if (that.utility.isSameNode(that.node, newNode)) return;
        that.doUpdate(newNode);
      }
      this.rootVM.nodesRef.child(node.id).on("value", this.remoteObserver);  
    }
  }

  removeObserver() {
    // console.log("removeObserver")
    if (this.localObserver)
      Object.unobserve(this.node, this.localObserver);
    if (this.remoteObserver)
      this.rootVM.nodesRef.child(this.node.id).off("value", this.remoteObserver);
  }

  // asyncEdit(realEdit) {
  //   var that = this;
  //   var edit = function() {
  //     if (that.rootVM.editing &&
  //         that.utility.now() - that.rootVM.localChangedTime
  //         < that.rootVM.localChangeWaitTime - that.rootVM.localChangeWaitEpsilon) {
  //       setTimeout(edit, that.rootVM.localChangeWaitTime);
  //     } else {
  //       realEdit();
  //       that.rootVM.editing = false;
  //     }
  //   }
  //   this.rootVM.localChangedTime = this.utility.now();
  //   if (!this.rootVM.editing) {
  //     this.rootVM.editing = true;
  //     setTimeout(edit, that.rootVM.localChangeWaitTime);
  //   };
  // }

  setNodeToServer(node_id) {
    var nodeRef = this.rootVM.nodesRef.child(node_id)
    // var newNode = new Object();
    // this.utility.copyAttributesWithoutChildren(newNode, node);
    // newNode.children = [];
    // for (var i = 0; i < node.children.length; i++) {
    //   newNode.children.push(node.children[i]);
    // };
    var that = this;
    this.doEdit(function() {
      console.log("setNodeToServer")
      var newNode = new Object();
      that.utility.copyAttributes(newNode, that.rootVM.file.nodes[node_id])
      nodeRef.set(newNode);
    });
    // this.rootVM.editing = false;

    // this.rootVM.setToRemoteTime = this.utility.now();
    // console.log("setNodeToServer")
    // var t = new Date(that.rootVM.setToRemoteTime)
    // console.log("localObserver:"+t.toLocaleTimeString()+" "+t.getMilliseconds());
    // console.log(newNode);   
  }

  doEdit(realEdit) {
    // var ref = new Firebase(this.common.firebase_url);
    // var authData = ref.getAuth();
    // if (!authData) {
    //   console.log("Please login!")
    //   return;
    // }
    // var nodePath = '/notes/users/' + authData.uid +
    //   '/files/' + file_id + '/nodes/' + node_id;
    // // console.log(nodePath);
    // var nodeRef = ref.child(nodePath);

    
    
    var that = this;
    var edit = function() {
      if (that.rootVM.editing &&
          that.utility.now() - that.rootVM.localChangedTime
          < that.rootVM.localChangeWaitTime - that.rootVM.localChangeWaitEpsilon) {
        setTimeout(edit, that.rootVM.localChangeWaitTime);
        console.log("setTimeout2")
      } else {
        realEdit();
        that.rootVM.editing = false;
      }
    }
    this.rootVM.localChangedTime = this.utility.now();
    if (!this.rootVM.editing) {
      this.rootVM.editing = true;
      setTimeout(edit, that.rootVM.localChangeWaitTime);
      console.log("setTimeout1")
    };
  }

  doUpdate(newNode) {
    // var ref = new Firebase(this.common.firebase_url);
    // var authData = ref.getAuth();
    // if (!authData) {
    //   console.log("Please login!")
    //   return;
    // }
    // var nodePath = '/notes/users/' + authData.uid +
    //   '/files/' + file_id + '/nodes/' + node_id;
    // console.log(nodePath);
    // var nodeRef = ref.child(nodePath);
    // console.log("doUpdate---------------------------------------------------------------------")
    var that = this;
    var update = function() {
      // console.log("that.rootVM.receiveRemoteTime")
      // console.log(that.rootVM.receiveRemoteTime)
      if (that.utility.now() - that.rootVM.receiveRemoteTime
          < that.rootVM.remoteChangeWaitTime - that.rootVM.remoteChangeWaitEpsilon) {
        setTimeout(update, that.remoteChangeWaitTime);
      } else {
        that.rootVM.updating =false;
        // console.log("that.rootVM.updating =false;")
      }
    }
    if (!this.rootVM.updating) {
      this.rootVM.updating = true;
      setTimeout(update, that.rootVM.remoteChangeWaitTime);
    };
    // remove observer.
    for (var i = this.node.children.length - 1; i >= 0; i--) {
      var removed = true
      for (var j = 0; newNode.children && j < newNode.children.length; j++) {
        if (this.node.children[i] == newNode.children[j]) {
          removed = false;
          break;
        }
      }
      if (removed) {
        // var that = this;
        var remove_observer = function(vm) {
          // Object.unobserve(vm.node, vm.localObserver);
          // that.rootVM.nodesRef.child(vm.node.id).off("value", vm.remoteObserver);
          // vm.remoteObserver = undefined;
          vm.removeObserver();
          for (var i = 0; i < vm.childVMList.length; i++) {
            remove_observer(vm.childVMList[i]);
          };
        }
        remove_observer(this.childVMList[i]);
      };
    };
    this.utility.copyAttributes(this.node, newNode);
    // console.log(this.resize)
    // this.node = newNode;
    this.rootVM.receiveRemoteTime = this.utility.now();
    setTimeout(function() {
      if (that.resize) that.resize();
    }, 0)
  }

  loadNode(node_id) {
    if (!this.node) {
      this.node = this.rootVM.file.nodes[node_id];
      if (this.node) {
        if (!this.node.children) this.node.children = [];
        this.addObserver(this.node);
      } else {
        this.loadNodeFromServer(node_id);
      }
    }
  }

  loadNodeFromServer(node_id) {
    // var ref = new Firebase(this.common.firebase_url);
    // var authData = ref.getAuth();
    // if (!authData) {
    //   console.log("Please login!")
    //   return;
    // }
    // var nodePath = '/notes/users/' + authData.uid +
    //     '/files/' + file_id + '/nodes/' + node_id;
    // // console.log("nodePath")
    // // console.log(nodePath)
    // var nodeRef = ref.child(nodePath);
    var that = this;
    this.rootVM.nodesRef.child(node_id).once('value', function(dataSnapshot) {
      // console.log("loadNodeFromServer dataSnapshot.val()")
      // console.log(dataSnapshot.val())
      that.node = dataSnapshot.val();
      if (!that.node) {
        that.node = that.utility.createNewNode();
        that.node.id = node_id;
      }
      if (!that.node.children) {that.node.children = []};
      that.addObserver(that.node);
      that.rootVM.file.nodes[that.node.id] = that.node;
      if (that.node.id != that.rootVM.root_id) {
        if (that.element.children[0].children[1])
          that.ta = that.element.children[0].children[1];
        if (that.ta)
          that.foldNode();
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