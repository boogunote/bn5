import {Common} from './common'
import {Utility} from './utility';

export class Node {
  static inject() { return [Common, Utility]; }
  constructor(common, utility){
    this.common = common;
    this.utility = utility;

    this.childVMList = [];

    this.editing = false;
    this.updating = false;
    this.localChangedTime = 0;
    this.setToRemoteTime = 0;
    this.receiveRemoteTime = 0;
    this.localChangeWaitTime = 500;
    this.localChangeWaitEpsilon = 50;
    this.remoteChangeWaitTime = 1000;
    this.remoteChangeWaitEpsilon = 50;
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
    // console.log("addObserver-----------------------------------------------")
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


    if (!this.localObserver) {
      this.localObserver = function (changes) {
        // console.log("changes")
        // console.log(changes)
        // console.log("node")
        // console.log(node)
        // console.log(that.updating);
        if (!isReallyChange(changes)) return;
        if (that.updating) return;



        that.doEdit(node, file_id, node_id);
      }

      Object.observe(node, this.localObserver);
    }

    if (!this.remoteObserver) {
      this.remoteObserver = function(dataSnapshot) {
        if (that.editing) return;
        if (that.utility.now() - that.setToRemoteTime < 1000) return;
        // console.log("dataSnapshot");
        // console.log(dataSnapshot.val());
        var newNode = dataSnapshot.val();
        if (!newNode) return;

        that.doUpdate(node, newNode, file_id, node_id);
      }
      this.treeVM.nodesRef.child(node_id).on("value", this.remoteObserver);  
    }
    

    // nodeRef.child("children").on("value", function(dataSnapshot) {
    //   console.log("dataSnapshot");
    //   console.log(dataSnapshot.val());
    // });
  }

  doEdit(node, file_id, node_id) {
    var ref = new Firebase(this.common.firebase_url);
    var authData = ref.getAuth();
    if (!authData) {
      console.log("Please login!")
      return;
    }
    var nodePath = '/notes/users/' + authData.uid +
      '/files/' + file_id + '/nodes/' + node_id;
    // console.log(nodePath);
    var nodeRef = ref.child(nodePath);
    
    var that = this;
    var edit = function() {
      if (that.editing && that.utility.now() - that.localChangedTime < that.localChangeWaitTime - that.localChangeWaitEpsilon) {
        setTimeout(edit, that.localChangeWaitTime);
        // console.log("setTimeout2")
      } else {
        var newNode = new Object();
        that.utility.copyAttributesWithoutChildren(newNode, node);
        newNode.children = [];
        for (var i = 0; i < node.children.length; i++) {
          newNode.children.push(node.children[i]);
        };
        nodeRef.set(newNode);
        that.editing = false;

        that.setToRemoteTime = that.utility.now();
        var t = new Date(that.setToRemoteTime)
        // console.log("localObserver:"+t.toLocaleTimeString()+" "+t.getMilliseconds());
        // console.log(newNode);         
      }
    }
    this.localChangedTime = this.utility.now();
    if (!this.editing) {
      this.editing = true;
      setTimeout(edit, that.localChangeWaitTime);
      // console.log("setTimeout1")
    };
  }

  doUpdate(node, newNode, file_id, node_id) {
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
      // console.log("that.receiveRemoteTime")
      // console.log(that.receiveRemoteTime)
      if (that.utility.now() - that.receiveRemoteTime < that.remoteChangeWaitTime - that.remoteChangeWaitEpsilon) {
        setTimeout(update, that.remoteChangeWaitTime);
      } else {
        that.updating =false;
        // console.log("that.updating =false;")
      }
    }
    if (!this.updating) {
      this.updating = true;
      setTimeout(update, that.remoteChangeWaitTime);
    };
    this.utility.copyAttributes(node, newNode);
    // console.log(this.resize)
    this.receiveRemoteTime = this.utility.now();
    setTimeout(function() {
      if (that.resize) that.resize();
    }, 0)
  }

  loadNodeFromLocalCache(node_id) {
    if (!this.node) {
      this.node = this.treeVM.file.nodes[node_id];
      if (this.node) {
        if (!this.node.children) this.node.children = [];
        this.addObserver(this.node, this.treeVM.file_id, node_id);
        // if (this.node.id != this.treeVM.root_id) {
        //   console.log(this.treeVM.root_id)
        //   setTimeout(function() {
        //     this.ta = this.element.children[0].children[1];
        //     this.foldNode();
        //   }, 0);
        // }
        // console.log("loadData@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
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
    // console.log("nodePath")
    // console.log(nodePath)
    var nodeRef = ref.child(nodePath);
    var that = this;
    nodeRef.once('value', function(dataSnapshot) {
      // console.log("loadNodeFromServer dataSnapshot.val()")
      // console.log(dataSnapshot.val())
      that.node = dataSnapshot.val();
      if (!that.node.children) {that.node.children = []};
      that.addObserver(that.node, file_id, node_id);
      that.treeVM.file.nodes[that.node.id] = that.node;
      if (that.node.id != that.treeVM.root_id) {
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