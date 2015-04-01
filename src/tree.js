import {DataSource} from './data-source';
import {Node} from './node';
import {TreeParams} from './tree-params';
import {Utility} from './utility';
import {Common} from './common'

export class Tree extends Node {
  static inject() { return [DataSource, TreeParams, Common, Utility]; }
  constructor(dataSource, treeParams, common, utility){
    super();
    this.dataSource = dataSource;
    this.operationRecordList = [];
    this.operationRecordList.cursor = -1;
    this.focusedVM = null;
    this.treeParams = treeParams;
    this.common = common;
    this.utility = utility;

    this.treeVM = this;
    this.file_id = null;
    this.file = null;



    this.filePath = null;
  }

  activate(params, queryString, routeConfig) {
    console.log('activate');
    this.file_id = params.file_id;
    this.root_id = params.root_id;
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
      var nodeRef = ref.child(filePath);
      var that = this;
      nodeRef.once('value', function(dataSnapshot) {
        console.log("dataSnapshot.val()")
        that.file = dataSnapshot.val()
        console.log(that.file);
        that.loadNodeFromLocalCache(that.root_id);
      });
      // this.loadNodeDataById(this.file_id, this.root_id);
    }
    else if (window.is_nodewebkit) {
      console.log(this.treeParams.path);
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
    var copiedNodeList = [];
    for (var i = 0; i < selectedVMList.length; i++) {
      copiedNodeList.push({
        file : this.path,
        node : selectedVMList[i].node
      });
    };
    delete localStorage.clipboardData;
    localStorage.clipboardData = undefined;
    localStorage.clipboardData = JSON.stringify(copiedNodeList);
    console.log(localStorage.clipboardData);
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

  delete() {
    console.log("delete")
    var selectedVMList = this.getSelectedVMList();
    console.log(selectedVMList)
    if (0 >= selectedVMList.length && !!this.focusedVM)
      selectedVMList.push(this.focusedVM);
    console.log(selectedVMList)
    var recordNodeList = [];
    for (var i = selectedVMList.length - 1; i >= 0 ; i--) {
      var positionArray = selectedVMList[i].getPositionArray();
      var nodeRecord = {
        positionArray : positionArray,
        node : this.cloneNode(selectedVMList[i].node)
      }
      // console.log("testssssssssssssssssssss")
      // console.log(nodeRecord)
      recordNodeList.push(nodeRecord)
      this.removeNodeAt(positionArray);
    };
    this.record(recordNodeList, "remove");
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
    var copiedNodeList = JSON.parse(clipboardData);

    this.clearNodeState();
    var positionArray = this.focusedVM.getPositionArray();
    positionArray[positionArray.length-1]++;
    var nodeRecordList = [];
    for (var i = 0; i < copiedNodeList.length; i++) {
      // console.log(positionArray)
      var that = this
      var visite = function(node) {
        node.id = that.utility.getUniqueId();
        for (var i = 0; i < node.children.length; i++) {
          visite(node.children[i]);
        };
      }
      visite(copiedNodeList[i].node)
      this.insertNodeAt(positionArray, copiedNodeList[i].node);
      var nodeRecord = {
        positionArray : JSON.parse(JSON.stringify(positionArray)),
        node : this.cloneNode(copiedNodeList[i].node)
      }
      nodeRecordList.push(nodeRecord);
      positionArray[positionArray.length-1]++;
    };

    this.record(nodeRecordList, "insert");
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
    console.log(this)
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

  onKeyDown(event) {
    // console.log(event);
    if (event.ctrlKey && 46 == event.keyCode) {
      this.delete();
      // var positionArray = this.getPositionArray();
      // var nodeRecord = {
      //   positionArray : positionArray,
      //   node : this.node
      // }
      // this.treeVM.record([nodeRecord], "remove");
      // this.treeVM.removeNodeAt(positionArray);
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
        this.uncollapsed(record.nodeList[i].positionArray);
        this.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
      }
    } else if ("remove" == record.operation) {
      for (var i = 0; i < record.nodeList.length; i++) {
        this.uncollapsed(record.nodeList[i].positionArray);
        this.removeNodeAt(record.nodeList[i].positionArray);
      }
    }
  }

  undo() {
    if (this.operationRecordList.cursor < 0) return;
    var record = this.operationRecordList[this.operationRecordList.cursor];
    this.operationRecordList.cursor--;
    if ("insert" == record.operation) {
      for (var i = record.nodeList.length - 1; i >= 0; i--) {
        this.uncollapsed(record.nodeList[i].positionArray);
        this.removeNodeAt(record.nodeList[i].positionArray);
      }
    } else if ("remove" == record.operation) {
      for (var i = record.nodeList.length - 1; i >= 0 ; i--) {
        this.uncollapsed(record.nodeList[i].positionArray);
        this.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
      }
    }
  }
}
