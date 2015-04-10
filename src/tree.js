import {DataSource} from './data-source';
import {Node} from './node';
import {TreeParams} from './tree-params';
import {Utility} from './utility';
import {Common} from './common'

export class Tree extends Node {
  static inject() { return [DataSource, Element, TreeParams, Common, Utility]; }
  constructor(dataSource, element, treeParams, common, utility){
    super();
    this.dataSource = dataSource;
    this.element = element;
    this.operationRecordList = [];
    this.operationRecordList.cursor = -1;
    this.focusedVM = null;
    this.treeParams = treeParams;
    this.common = common;
    this.utility = utility;

    this.treeVM = this;
    this.parentVM = null;
    this.file_id = null;
    this.root_id = null;
    this.file = null;
    this.title = null;
    this.fileRef = null;
    this.nodesRef = null;

    this.editing = false;
    this.updating = false;
    this.localChangedTime = 0;
    this.setToRemoteTime = 0;
    this.receiveRemoteTime = 0;
    this.localChangeWaitTime = 200;
    this.localChangeWaitEpsilon = 10;
    this.remoteChangeWaitTime = 1000;
    this.remoteChangeWaitEpsilon = 50;



    this.filePath = null;
  }

  activate(params, queryString, routeConfig) {
    console.log('activate');
    console.log(params)
    this.file_id = params.file_id;
    this.root_id = params.root_id;
    this.flatVM = params.flatVM;
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
      var filePath = '/notes/users/' + authData.uid +
          '/files/' + this.file_id;
      var fileRef = ref.child(filePath);
      var that = this;
      fileRef.once('value', function(dataSnapshot) {
        // console.log("dataSnapshot.val()")
        that.file = dataSnapshot.val()
        // console.log(that.file);
        if (that.file) {
          that.loadNodeFromLocalCache(that.root_id);
          that.loadTitle(that.root_id);
        }
      });
      // this.loadNodeDataById(this.file_id, this.root_id);
    }
    else if (window.is_nodewebkit) {
      // console.log(this.treeParams.path);
      this.path = this.treeParams.path;
      var that = this;
      return this.dataSource.load(this.path)
          .then(jsonData => {
            this.jsonData = jsonData;
            this.node = JSON.parse(jsonData);
          }).catch(err => {
            console.log(err);
          });
    }
  }

  attached() {
    console.log("attached")
  }

  addMonitor(node) {
    console.log("this.common.firebase_url")
    console.log(this.common.firebase_url)
    var ref = new Firebase(this.common.firebase_url);
    console.log(ref)
    var that = this;
    function visite(node) {
      var fileRef = ref.child(that.filePath);
      var nodeRef = fileRef.child("nodes").child(node.id);
      // TODO: hard to remove it when removeNodeAt();
      nodeRef.on("value", function(dataSnapshot) {
        // console.log("dataSnapshot");
        // console.log(dataSnapshot.val());
        that.copyAttributesWithoutChildren(node, dataSnapshot.val());
      });

      // Monit children
      nodeRef.child("children").on("value", function(dataSnapshot) {
        console.log("children dataSnapshot1111111111111111111");
        var newChildrenIdList = dataSnapshot.val();
        console.log(newChildrenIdList)
        if (!newChildrenIdList || newChildrenIdList.length <= 0) return;
        var ref = new Firebase(that.common.firebase_url);
        that.filePath = '/notes/users/' + ref.getAuth().uid + '/files/' + that.file_id;
        var fileRef = ref.child(that.filePath);
        fileRef.once('value', function(dataSnapshotFile) {
          var fileNodes = dataSnapshotFile.val().nodes;
          var newChildren = [];
          for (var i = 0; i < newChildrenIdList.length; i++) {
            var has = false
            for (var j = 0; node.children && j < node.children.length; j++) {
              if (newChildrenIdList[i] == node.children[j]) {
                has = true;
                newChildren.push(node.children[j]);
                break;
              }
            };

            if (!has) {
              var newNode = that.createTreeFromOnlineData(newChildrenIdList[i], fileNodes);
              that.addObserver(newNode);
              that.addMonitor(newNode);
              newChildren.push(newNode);
            };
            
          };

          node.children = newChildren;


        }, function(error) {
          console.log(JSON.stringify(error))
        });
        
      }); // Monite children


      for (var i = 0; node.children && i < node.children.length; i++) {
        visite(node.children[i]);
      };
    }

    visite(node);
  }


  // addObserver(node) {
  //   var that = this;
  //   function visite(node) {
  //     // var monitoring = false;
  //     // var createTime = that.utility.now();
  //     var observer =  function(changes) {
  //       var pass = true;
  //       for (var i = 0; i < changes.length; i++) {
  //         // console.log("changes[i].name")
  //         // console.log(changes[i].name)
  //         var bypassList = ["observer", "children_observer", "__observer__",
  //             "__observers__", "__array_observer__"];
  //         for (var j = 0; j < bypassList.length; j++) {
  //           if (changes[i].name == bypassList[j]) {
  //             pass = false;
  //             break;
  //           }
  //         };
  //       };
  //       if (!pass) return;
  //       // console.log(changes)
  //       // if (!monitoring)
  //       //   if (that.utility.now() - createTime > waitingTime) {
  //       //     monitoring = true;
  //       //   }
  //       //   else
  //       //     return;
  //       // console.log(changes)
  //       var newNode = new Object();
  //       that.copyAttributesWithoutChildren(newNode, node);
  //       newNode.children = [];
  //       for (var i = 0; node.children && i < node.children.length; i++) {
  //         newNode.children.push(node.children[i].id)
  //       };
  //       var ref = new Firebase(that.common.firebase_url);
  //       var authData = ref.getAuth();
  //       var nodeRef = ref.child("notes").child("users").child(authData.uid)
  //           .child("files").child(that.file_id).child("nodes").child(node.id);
  //       nodeRef.set(newNode)
  //     }
  //     node.observer = observer;
  //     node.children_observer = observer;
  //     Object.observe(node, observer);
  //     Object.observe(node.children, observer);

  //     for (var i = 0; node.children && i < node.children.length; i++) {
  //       visite(node.children[i]);
  //     };
  //   }

  //   visite(node);
  // }

  clearNodeState() {
    var visite = function(vm) {
      vm.selected = false;
      for (var i = 0; i < vm.childVMList.length; i++) {
        visite(vm.childVMList[i])
      }
    }
    visite(this);
  }

  cloneNode(node) {
    var that = this;
    function visite(node) {
      var newNode = new Object();
      that.copyAttributesWithoutChildren(newNode, node);
      newNode.children = [];
      for (var i = 0; node.children && i < node.children.length; i++) {
        newNode.children.push(visite(node.children[i]));
      };
      return newNode;
    }
    return visite(node);
  }

  copyAttributesWithoutChildren(newNode, node) {
    function copyAttributes(newNode, node, attrName) {
      if (typeof node[attrName] != "undefined") newNode[attrName] = node[attrName];
    }
    var attrList = ["collapsed", "content", "fold", "icon", "id"];
    for (var i = 0; i < attrList.length; i++) {
      copyAttributes(newNode, node, attrList[i]);
    };
  }

  copy() {
    var selectedVMList = this.getSelectedVMList();
    if (0 >= selectedVMList.length && !!this.focusedVM)
      selectedVMList.push(this.focusedVM);
    var copiedSubTreeList = [];
    for (var i = 0; i < selectedVMList.length; i++) {
      var newSubTree = {
        file_id: this.file_id,
        node_id: selectedVMList[i].node.id
      };
      copiedSubTreeList.push(newSubTree);
    };
    delete localStorage.clipboardData;
    localStorage.clipboardData = undefined;
    localStorage.clipboardData = JSON.stringify(copiedSubTreeList);
    console.log(localStorage.clipboardData);
  }

  cloneSubTree(root_id) {
    var subTreeNodeList = [];
    var newRootId = null;
    var that = this;
    function visit(node_id) {
      var node = that.file.nodes[node_id];
      var children = [];
      for (var i = 0; node.children && i < node.children.length; i++) {
        var newChildNode = visit(node.children[i]);
        children.push(newChildNode.id);
      };
      var newNode = new Object();
      that.utility.copyAttributesWithoutChildren(newNode, node);
      if (node.id == root_id) {
        newRootId = that.utility.getUniqueId();
        newNode.id = newRootId;
      }
      else
        newNode.id = that.utility.getUniqueId();
      newNode.children = children;
      subTreeNodeList.push(newNode);
      return newNode;
    }

    visit(root_id);

    return {
      root_id: newRootId,
      nodes: subTreeNodeList
    }
  }

  createTreeFromOnlineData(nodeId, onlineNotesList) {
    var that = this;
    function visite(nodeId, onlineNotesList) {
      var node = onlineNotesList[nodeId];
      if (!node) return null;
      var newNode = new Object();
      that.copyAttributesWithoutChildren(newNode, node);
      newNode.children = [];
      // console.log("newNode")
      // console.log(newNode)
      for (var i = 0; node.children && i < node.children.length; i++) {
        var child = visite(node.children[i], onlineNotesList);
        if (!child) continue;
        child.parent = newNode;
        newNode.children.push(child);
      };
      return newNode;
    }
    var tree = visite(nodeId, onlineNotesList);
    return tree;
  }

  createNewNode(insertParentNodeId, insertPosition) {
    var newNode = this.utility.createNewNode();
    var newNodeList = [newNode];
    console.log("insertPosition");
    console.log(insertPosition);
    this.insertSubTree(insertParentNodeId, insertPosition,
        newNodeList, newNode.id);
    // record
    var nodeRecordList = [];
    var nodeRecord = {
      parent_id: insertParentNodeId,
      position: insertPosition,
      node_id: newNode.id
    };
    nodeRecordList.push(nodeRecord);
    this.record(nodeRecordList, "insert");


    var updateNode = this.file.nodes[insertParentNodeId];
    var updateNodeList = newNodeList;

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
    return newNode;
  }

  delete() {
    console.log("delete")
    var selectedVMList = this.getSelectedVMList();
    console.log(selectedVMList)
    if (0 >= selectedVMList.length && !!this.focusedVM)
      selectedVMList.push(this.focusedVM);
    console.log(selectedVMList)
    var nodeRecordList = [];
    for (var i = selectedVMList.length - 1; i >= 0 ; i--) {
      // var positionArray = selectedVMList[i].getPositionArray();
      // var nodeRecord = {
      //   positionArray : positionArray,
      //   node : this.cloneNode(selectedVMList[i].node)
      // }
      // // console.log("testssssssssssssssssssss")
      // // console.log(nodeRecord)
      // recordNodeList.push(nodeRecord)
      // // this.removeNodeAt(positionArray);
      // console.log(selectedVMList[i])
      var parentId = selectedVMList[i].parentVM.node.id;
      var nodeId = selectedVMList[i].node.id;
      var position = this.removeSubTree(parentId, nodeId);
      var nodeRecord = {
        parent_id: parentId,
        position: position,
        node_id: nodeId
      };
      nodeRecordList.push(nodeRecord);
    };

    // record
    this.treeVM.record(nodeRecordList, "remove");
  }

  focusAt(id) {
    $(this.element).find("#"+id+" textarea").focus();
  }

  onTitleKeyDown(event) {
    if (13 == event.keyCode && event.shiftKey) {
      var node = this.createNewNode(this.root_id, 0);
      var that = this;
      setTimeout(function() {
        that.focusAt(node.id);
      }, 10);
      return false;
    } else if (event.ctrlKey && 46 == event.keyCode && this.flatVM) {
      this.flatVM.delete(this.root_id);
      return false
    }
    return true;
  }

  onTitleKeyUp(event) {
    var that = this;
    this.asyncEdit(function(){
      if ("root" == that.root_id) {
        that.fileRef.child("meta/name").set(that.title);
      } else {
        that.nodesRef.child(that.root_id).child("content").set(that.title);
      }
    });
    return true;
  }

  focusNodeAt(positionArray) {
    var vm = this.getVMByPositionArray(positionArray);
    if (vm)
      vm.element.children[0].children[1].focus(); // focus textarea
      // vm.element.getElementsByTagName("textarea")[0].focus();
  }

  paste() {
    if (!this.focusedVM) return;
    var clipboardData = localStorage.getItem("clipboardData");
    if (!clipboardData) return;
    var copiedSubTreeList = JSON.parse(clipboardData);

    this.clearNodeState();
    var parent = this.focusedVM.parentVM.node;
    var position = -1;
    for (var i = 0; i < parent.children.length; i++) {
      console.log("test id: "+parent.children[i].id+" "+this.focusedVM.node.id)
      if(parent.children[i] == this.focusedVM.node.id) {
        position = i;
        break;
      }
    };
    var nodeRecordList = [];
    for (var i = 0; i < copiedSubTreeList.length; i++) {
      var ret = this.cloneSubTree(copiedSubTreeList[i].node_id)
      var insertPosition = position+i+1;
      this.treeVM.insertSubTree(parent.id, insertPosition, ret.nodes, ret.root_id);
      for (var j = 0; j < ret.nodes.length; j++) {
        var nodeRef = this.nodesRef.child(ret.nodes[j].id)
        nodeRef.set(ret.nodes[j]);
      };
      var nodeRecord = {
        parent_id: parent.id,
        position: insertPosition,
        node_id: ret.root_id
      };
      nodeRecordList.push(nodeRecord);
    };
    this.record(nodeRecordList, "insert");

    // clean children.
    var children = []
    for (var i = 0; i < parent.children.length; i++) {
      children.push(parent.children[i]);
    };
    this.nodesRef.child(parent.id).child("children").set(children)
    // var positionArray = this.focusedVM.getPositionArray();
    // positionArray[positionArray.length-1]++;
    // var nodeRecordList = [];
    // for (var i = 0; i < copiedNodeList.length; i++) {
    //   // console.log(positionArray)
    //   var that = this
    //   var visite = function(node) {
    //     node.id = that.utility.getUniqueId();
    //     for (var i = 0; i < node.children.length; i++) {
    //       visite(node.children[i]);
    //     };
    //   }
    //   visite(copiedNodeList[i].node)
    //   this.insertNodeAt(positionArray, copiedNodeList[i].node);
    //   var nodeRecord = {
    //     positionArray : JSON.parse(JSON.stringify(positionArray)),
    //     node : this.cloneNode(copiedNodeList[i].node)
    //   }
    //   nodeRecordList.push(nodeRecord);
    //   positionArray[positionArray.length-1]++;
    // };

    // this.record(nodeRecordList, "insert");
  }

  getNodeDataById(tree, id) {
    function visite(node) {
      if (id == node.id) return node;
      var ret = null;
      for (var i = 0; node.children && i < node.children.length; i++) {
        ret = visite(node.children[i]);
        if (!ret) break;
      };
      return ret;
    }

    return visite(tree);
  }

  getVMByPositionArray(positionArray) {
    var vm = this;
    for (var i = 0; i < positionArray.length; i++) {
      vm = vm.childVMList[positionArray[i]]
    };

    return vm;
  }

  getSelectedVMList() {
    // console.log(this)
    var selectedVMList = [];
    var visite = function(vm) {
      if (vm.selected) {
        selectedVMList.push(vm);
      } else {
        for (var i = 0; i < vm.childVMList.length; i++) {
          visite(vm.childVMList[i])
        };
      }
    }
    visite(this);
    return selectedVMList;
  }

  insertSubTree(parent_id, insertPosition, sub_tree, root_id) {
    var parent = this.treeVM.file.nodes[parent_id];
    for (var i = 0; i < sub_tree.length; i++) {
      this.treeVM.file.nodes[sub_tree[i].id] = sub_tree[i];
    };

    if (!parent.children) {parent.children = []};
    parent.children.splice(insertPosition, 0, root_id);
    // this.doEdit(parent, this.treeVM.file_id, parent.id);
  }

  insertNodeAt(positionArray, node) {
    console.log("insertNodeAt")
    var positionArray = JSON.parse(JSON.stringify(positionArray)); //clone object
    var insertPosition = positionArray.pop();
    var vm = this.getVMByPositionArray(positionArray);
    var newNode = this.utility.clone(node); // To monitor the new node.
    this.addObserver(newNode);
    vm.node.children.splice(insertPosition, 0, newNode);
    // Save to server
    var that = this;
    var visite = function(node) {
      console.log("save")
      console.log("node")
      var newNode = new Object();
      that.copyAttributesWithoutChildren(newNode, node);
      newNode.children = [];
      for (var i = 0; node.children && i < node.children.length; i++) {
        newNode.children.push(node.children[i].id)
      };
      var ref = new Firebase(that.common.firebase_url);
      var authData = ref.getAuth();
      var nodeRef = ref.child("notes").child("users").child(authData.uid)
          .child("files").child(that.file_id).child("nodes").child(node.id);
      nodeRef.set(newNode)
      for (var i = 0; i < node.children.length; i++) {
        visite(node.children[i]);
      };
    }
    visite(newNode);
  }

  loadTitle(root_id) {
    // console.log("root_id:"+root_id)
    // console.log(this.file.meta)
    var that = this;
    var update = function(dataSnapshot) {
      that.title = dataSnapshot.val();
    }
    setTimeout(function() {
      var title = $(that.element).find("#title");
      autosize(title);
    }, 10);
    if ("root" == root_id) {
      this.title = this.file.meta.name;
      this.fileRef.child("meta/name").on("value", update);
    } else {
      this.title = this.file.nodes[root_id].content;
      this.nodesRef.child(root_id).child("content").on("value", update);
    }
  }

  onKeyDown(event) {
    // console.log(event);
    if (13 == event.keyCode) {
      var currNodePosition = -1;
      for (var i = 0; i < this.focusedVM.parentVM.node.children.length; i++) {
        if (this.focusedVM.node.id == this.focusedVM.parentVM.node.children[i]) {
          currNodePosition = i;
          break;
        }
      };
      var insertParentNodeId = -1;
      var insertPosition = -1;
      if (event.altKey) {
        insertParentNodeId = this.focusedVM.parentVM.node.id;
        insertPosition = currNodePosition;
      } else if (event.ctrlKey) {
        insertParentNodeId = this.focusedVM.parentVM.node.id;
        insertPosition = currNodePosition + 1;
      } else if (event.shiftKey) {
        insertParentNodeId = this.focusedVM.node.id;
        insertPosition = 0;
      } else {
        return true;
      }

      var node = this.createNewNode(insertParentNodeId, insertPosition);
      var that = this;
      setTimeout(function() {
        that.focusAt(node.id);
      }, 10);
      return false;
    } else if (event.ctrlKey && 46 == event.keyCode) {
      this.delete();
      return false
    } else if (27 == event.keyCode) {
      this.clearNodeState();
      return false;
    } else if (67 == event.keyCode && event.ctrlKey && event.shiftKey) {
      this.copy();
      return false;
    } else if (88 == event.keyCode && event.ctrlKey && event.shiftKey) {
      this.copy();
      this.delete();
      return false;
    } else if (86 == event.keyCode && event.ctrlKey && event.shiftKey) {
      this.paste();
      return false;
    } else if (83 == event.keyCode && event.ctrlKey) {
      this.save();
      return false;
    } else if (90 == event.keyCode && event.ctrlKey && event.shiftKey) {
      this.undo();
      return false;
    } else if (89 == event.keyCode && event.ctrlKey && event.shiftKey) {
      this.redo();
      return false;
    } else if (187 == event.keyCode && event.altKey) {
      this.stepIcon(true);
      return false;
    } else if (189 == event.keyCode && event.altKey) {
      this.stepIcon(false);
      return false;
    }
    return true;
  }

  removeNodeAt(positionArray) {
    console.log("removeNodeAt:"+positionArray.toString())
    var parentPositionArray = JSON.parse(JSON.stringify(positionArray)); //clone object
    var removePosition = parentPositionArray.pop();
    var vm = this.getVMByPositionArray(positionArray);
    var parentVM = this.getVMByPositionArray(parentPositionArray);
    var that = this;
    setTimeout(function() {
      parentVM.removeChildVM(vm);
      var removedNodes = parentVM.node.children.splice(removePosition, 1);
      console.log("removedNodes")
      console.log(removedNodes)
      for (var i = 0; removedNodes && i < removedNodes.length; i++) {
        that.removeObserver(removedNodes[i]);
        // Remove from server
        var visite = function(node) {
          var ref = new Firebase(that.common.firebase_url);
          var authData = ref.getAuth();
          var nodeRef = ref.child("notes").child("users").child(authData.uid)
              .child("files").child(that.file_id).child("nodes").child(node.id);
          nodeRef.remove();
          for (var i = 0; i < node.children.length; i++) {
            visite(node.children[i]);
          };
        }
        visite(removedNodes[i]);
      };

      
    }, 0);
  }

  removeSubTree(parent_id, node_id) {
    // console.log("removeSubTree(parent_id, node_id) {")
    // console.log(parent_id)
    // console.log(node_id)
    var parent = this.file.nodes[parent_id];
    var position = -1;
    for (var i = 0; i < parent.children.length; i++) {
      if (parent.children[i] == node_id) {
        position = i;
        break;
      }
    };

    if (-1 == position) return;

    parent.children.splice(position, 1);

    // var ref = new Firebase(this.common.firebase_url);
    // var authData = ref.getAuth();
    // if (!authData) {
    //   console.log("Please login!")
    //   return;
    // }
    // var nodesPath = '/notes/users/' + authData.uid +
    //   '/files/' + this.file_id + '/nodes';
    //   console.log(nodesPath)
    // var nodesRef = this.child(nodesPath);
    // var parentChildren = [];
    // for (var i = 0; parent.children && i < parent.children.length; i++) {
    //   parentChildren.push(parent.children[i])
    // };
    // this.nodesRef.child(parent_id).child("children").set(parentChildren);
    var that = this;
    var remove_observer = function(vm) {
      Object.unobserve(vm.node, vm.localObserver);
      that.nodesRef.child(vm.node.id).off("value", vm.remoteObserver);
      for (var i = 0; i < vm.childVMList.length; i++) {
        remove_observer(vm.childVMList[i]);
      };
    }
    remove_observer(this.childVMList[position]);
    var delete_sub_node = function(node_id) {
      that.nodesRef.child(node_id).remove();
      for (var i = 0; that.treeVM.file.nodes[node_id].children && i < that.treeVM.file.nodes[node_id].children.length; i++) {
        delete_sub_node(that.treeVM.file.nodes[node_id].children[i]);
      };
    }

    delete_sub_node(node_id);
    // doEdit to prevent the modification, which send back from server.
    this.doEdit(function() {
      that.setNodeToServer(parent);
    })
    return position;
  }

  removeObserver(node) {
    Object.unobserve(node, node.observer);
    Object.unobserve(node.children, node.children_observer);
  }

  stepIcon(direction) {
    if (!this.focusedVM) return;
    if (direction)
      this.focusedVM.node.icon++;
    else
      this.focusedVM.node.icon--;
    if (this.focusedVM.node.icon > 7) this.focusedVM.node.icon = 0;
    if (this.focusedVM.node.icon < 0) this.focusedVM.node.icon = 7;
  }

  uncollapsed(positionArray) {
    var node = this.node;
    for (var i = 0; i < positionArray.length; i++) {
      node.collapsed = false;
      node = node.children[positionArray[i]]
    };
  }

  record(nodeDataList, operation) {
    var record = {};
    record.operation = operation;
    record.nodeList = nodeDataList;
    
    this.operationRecordList.splice(this.operationRecordList.cursor+1);
    this.operationRecordList.push(record);
    this.operationRecordList.cursor++;
  }

  save() {
    console.log(this.focusedVM.element);
    // console.log(this.operationRecordList)
    // this.dataSource.save(this.path, JSON.stringify(this.node))
    //     .catch(err => {
    //       console.log(err);
    //     });
  }

  select(positionArray) {
    var vm = getVMByPositionArray(positionArray);
    vm.select();
  }

  redo() {
    console.log("redo")
    // console.log($scope.$operationRecordList)
    if (this.operationRecordList.cursor >= this.operationRecordList.length-1) return;

    this.operationRecordList.cursor++;
    var record = this.operationRecordList[this.operationRecordList.cursor];
    if ("insert" == record.operation) {
      for (var i = 0; i < record.nodeList.length; i++) {
        // this.uncollapsed(record.nodeList[i].positionArray);
        // this.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
        var r = record.nodeList[i];
        this.insertSubTree(r.parent_id, r.position, [], r.node_id);
        var nodeList = this.getNodeListByRootId(r.node_id);
        var that = this;
        this.doEdit(function() {
          that.setNodeListToServer(nodeList);
          that.setNodeChildrenToServer(that.file.nodes[r.parent_id]);
          console.log("setNodeChildrenToServer");
          console.log(that.file.nodes[r.parent_id])
          that.treeVM.setToRemoteTime = that.utility.now();
        });
        
        // this.doEdit(this.file.nodes[r.parent_id]);
      }
    } else if ("remove" == record.operation) {
      for (var i = 0; i < record.nodeList.length; i++) {
        // this.uncollapsed(record.nodeList[i].positionArray);
        // this.removeNodeAt(record.nodeList[i].positionArray);
        var r = record.nodeList[i];
        var nodeList = this.getNodeListByRootId(r.node_id);
        this.removeSubTree(r.parent_id, r.node_id);
        var that = this;
        this.doEdit(function() {
          that.setNodeChildrenToServer(that.file.nodes[r.parent_id]);
          console.log("setNodeChildrenToServer");
          console.log(that.file.nodes[r.parent_id])
          that.removeNodeListFromServer(nodeList)
          that.treeVM.setToRemoteTime = that.utility.now();

        });
        // this.doEdit(this.file.nodes[r.parent_id]);
      }
    }
  }

  undo() {
    if (this.operationRecordList.cursor < 0) return;
    var record = this.operationRecordList[this.operationRecordList.cursor];
    this.operationRecordList.cursor--;
    if ("insert" == record.operation) {
      for (var i = record.nodeList.length - 1; i >= 0; i--) {
        // this.uncollapsed(record.nodeList[i].positionArray);
        var r = record.nodeList[i];
        var nodeList = this.getNodeListByRootId(r.node_id);
        this.removeSubTree(r.parent_id, r.node_id);
        var that = this;
        this.doEdit(function() {
          that.setNodeChildrenToServer(that.file.nodes[r.parent_id]);
          console.log("setNodeChildrenToServer");
          console.log(that.file.nodes[r.parent_id])
          that.removeNodeListFromServer(nodeList)
          
          that.treeVM.setToRemoteTime = that.utility.now();
          
        });
        // this.doEdit(this.file.nodes[r.parent_id]);
        // this.removeNodeAt(record.nodeList[i].positionArray);
      }
    } else if ("remove" == record.operation) {
      for (var i = record.nodeList.length - 1; i >= 0 ; i--) {
        // this.uncollapsed(record.nodeList[i].positionArray);
        // this.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
        var r = record.nodeList[i];
        this.insertSubTree(r.parent_id, r.position, [], r.node_id);
        var nodeList = this.getNodeListByRootId(r.node_id);
        var that = this;
        this.doEdit(function() {
          that.setNodeListToServer(nodeList);
          that.setNodeChildrenToServer(that.file.nodes[r.parent_id]);
          console.log("setNodeChildrenToServer");
          console.log(that.file.nodes[r.parent_id])
          that.treeVM.setToRemoteTime = that.utility.now();
        });
        // this.doEdit(this.file.nodes[r.parent_id]);
      }
    }
  }

  getNodeListByRootId(rootId) {
    var nodeList = [];
    var that = this;
    function visit(node_id) {
      var node = that.file.nodes[node_id];
      nodeList.push(node);
      for (var i = 0; i < node.children.length; i++) {
        visit(node.children[i])
      };
    }
    visit(rootId);
    return nodeList;
  }

  setNodeChildrenToServer(node) {
    var children = [];
    for (var i = 0; i < node.children.length; i++) {
      children.push(node.children[i]);
    };
    this.nodesRef.child(node.id).child("children").set(children)
  }

  removeNodeListFromServer(nodeList) {
    for (var i = 0; i < nodeList.length; i++) {
      this.nodesRef.child(nodeList[i].id).remove();
    };
  }

  setNodeListToServer(nodeList) {
    for (var i = 0; i < nodeList.length; i++) {
      // this.doEdit(nodeList[i]);
      var newNode = new Object();
      this.utility.copyAttributesWithoutChildren(newNode, nodeList[i])
      var children = [];
      for (var j = 0; j < nodeList[i].children.length; j++) {
        children.push(nodeList[i].children[j]);
      };
      newNode.children = children;
      this.nodesRef.child(nodeList[i].id).set(newNode);
    };
  }
}
