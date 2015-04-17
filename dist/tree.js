System.register(["./data-source", "./node", "./tree-params", "./utility", "./common"], function (_export) {
  var DataSource, Node, TreeParams, Utility, Common, _prototypeProperties, _get, _inherits, _classCallCheck, Tree;

  return {
    setters: [function (_dataSource) {
      DataSource = _dataSource.DataSource;
    }, function (_node) {
      Node = _node.Node;
    }, function (_treeParams) {
      TreeParams = _treeParams.TreeParams;
    }, function (_utility) {
      Utility = _utility.Utility;
    }, function (_common) {
      Common = _common.Common;
    }],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Tree = _export("Tree", (function (Node) {
        function Tree(dataSource, element, treeParams, common, utility) {
          _classCallCheck(this, Tree);

          _get(Object.getPrototypeOf(Tree.prototype), "constructor", this).call(this);
          this.dataSource = dataSource;
          this.element = element;
          this.operationRecordList = [];
          this.operationRecordList.cursor = -1;
          this.focusedVM = null;
          this.treeParams = treeParams;
          this.common = common;
          this.utility = utility;

          this.rootVM = this;
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
          this.localChangeWaitTime = 1000;
          this.localChangeWaitEpsilon = 10;
          this.remoteChangeWaitTime = 1000;
          this.remoteChangeWaitEpsilon = 50;

          this.filePath = null;
        }

        _inherits(Tree, Node);

        _prototypeProperties(Tree, {
          inject: {
            value: function inject() {
              return [DataSource, Element, TreeParams, Common, Utility];
            },
            writable: true,
            configurable: true
          }
        }, {
          activate: {
            value: function activate(params, queryString, routeConfig) {
              var _this = this;

              console.log("activate");
              console.log(params);
              this.file_id = params.file_id;
              this.root_id = params.root_id;
              this.flatVM = params.flatVM;

              // console.log("params")
              // console.log(params)
              if ("online" == params.type) {
                this.rootRef = new Firebase(this.common.firebase_url);
                var authData = this.rootRef.getAuth();
                if (!authData) {
                  console.log("Please login!");
                  return;
                }
                this.fileRef = this.rootRef.child("/notes/users/" + authData.uid + "/files/" + this.file_id);
                this.nodesRef = this.fileRef.child("nodes");
                if (this.flatVM && this.flatVM.file) {
                  // this.rootVM = this.flatVM;
                  this.file = this.flatVM.file;
                  this.loadNode(this.root_id, false);
                  this.loadTitle(this.root_id);
                  this.flatVM.addChildVM(this, this.root_id);
                  this.utility.initInteract(this.root_id, this.flatVM);
                } else {
                  var that = this;
                  this.fileRef.once("value", function (dataSnapshot) {
                    // console.log("dataSnapshot.val()")
                    that.file = dataSnapshot.val();
                    // console.log(that.file);
                    if (that.file) {
                      that.loadNode(that.root_id, false);
                      // that.addObserver(that.node, that.file_id, that.node.id);
                      that.loadTitle(that.root_id);
                    }
                  });
                }
                // this.loadNodeDataById(this.file_id, this.root_id);
              } else if (window.is_nodewebkit) {
                // console.log(this.treeParams.path);
                this.path = this.treeParams.path;
                var that = this;
                return this.dataSource.load(this.path).then(function (jsonData) {
                  _this.jsonData = jsonData;
                  _this.node = JSON.parse(jsonData);
                })["catch"](function (err) {
                  console.log(err);
                });
              }
            },
            writable: true,
            configurable: true
          },
          attached: {
            value: function attached() {
              console.log("attached");
            },
            writable: true,
            configurable: true
          },
          detached: {
            value: function detached() {
              console.log("detached");
            },
            writable: true,
            configurable: true
          },
          clearNodeState: {

            // addMonitor(node) {
            //   console.log("this.common.firebase_url")
            //   console.log(this.common.firebase_url)
            //   var ref = new Firebase(this.common.firebase_url);
            //   console.log(ref)
            //   var that = this;
            //   function visite(node) {
            //     var fileRef = ref.child(that.filePath);
            //     var nodeRef = fileRef.child("nodes").child(node.id);
            //     // TODO: hard to remove it when removeNodeAt();
            //     nodeRef.on("value", function(dataSnapshot) {
            //       // console.log("dataSnapshot");
            //       // console.log(dataSnapshot.val());
            //       that.copyAttributesWithoutChildren(node, dataSnapshot.val());
            //     });

            //     // Monit children
            //     nodeRef.child("children").on("value", function(dataSnapshot) {
            //       console.log("children dataSnapshot1111111111111111111");
            //       var newChildrenIdList = dataSnapshot.val();
            //       console.log(newChildrenIdList)
            //       if (!newChildrenIdList || newChildrenIdList.length <= 0) return;
            //       var ref = new Firebase(that.common.firebase_url);
            //       that.filePath = '/notes/users/' + ref.getAuth().uid + '/files/' + that.file_id;
            //       var fileRef = ref.child(that.filePath);
            //       fileRef.once('value', function(dataSnapshotFile) {
            //         var fileNodes = dataSnapshotFile.val().nodes;
            //         var newChildren = [];
            //         for (var i = 0; i < newChildrenIdList.length; i++) {
            //           var has = false
            //           for (var j = 0; node.children && j < node.children.length; j++) {
            //             if (newChildrenIdList[i] == node.children[j]) {
            //               has = true;
            //               newChildren.push(node.children[j]);
            //               break;
            //             }
            //           };

            //           if (!has) {
            //             var newNode = that.createTreeFromOnlineData(newChildrenIdList[i], fileNodes);
            //             that.addObserver(newNode);
            //             that.addMonitor(newNode);
            //             newChildren.push(newNode);
            //           };

            //         };

            //         node.children = newChildren;

            //       }, function(error) {
            //         console.log(JSON.stringify(error))
            //       });

            //     }); // Monite children

            //     for (var i = 0; node.children && i < node.children.length; i++) {
            //       visite(node.children[i]);
            //     };
            //   }

            //   visite(node);
            // }

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

            value: function clearNodeState() {
              var visite = (function (_visite) {
                var _visiteWrapper = function visite(_x) {
                  return _visite.apply(this, arguments);
                };

                _visiteWrapper.toString = function () {
                  return _visite.toString();
                };

                return _visiteWrapper;
              })(function (vm) {
                vm.selected = false;
                for (var i = 0; i < vm.childVMList.length; i++) {
                  visite(vm.childVMList[i]);
                }
              });
              visite(this);
            },
            writable: true,
            configurable: true
          },
          cloneNode: {
            value: function cloneNode(node) {
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
            },
            writable: true,
            configurable: true
          },
          copyAttributesWithoutChildren: {
            value: function copyAttributesWithoutChildren(newNode, node) {
              function copyAttributes(newNode, node, attrName) {
                if (typeof node[attrName] != "undefined") newNode[attrName] = node[attrName];
              }
              var attrList = ["collapsed", "content", "fold", "icon", "id"];
              for (var i = 0; i < attrList.length; i++) {
                copyAttributes(newNode, node, attrList[i]);
              };
            },
            writable: true,
            configurable: true
          },
          copy: {
            value: function copy() {
              var selectedVMList = this.getSelectedVMList();
              if (0 >= selectedVMList.length && !!this.focusedVM) selectedVMList.push(this.focusedVM);
              var copiedSubTreeList = [];
              for (var i = 0; i < selectedVMList.length; i++) {
                var newSubTree = {
                  file_id: this.file_id,
                  subTree: this.utility.listToTree(this.rootVM.file.nodes, selectedVMList[i].node.id),
                  type: "tree_nodes"
                };
                copiedSubTreeList.push(newSubTree);
              };
              delete localStorage.clipboardData;
              localStorage.clipboardData = undefined;
              localStorage.clipboardData = JSON.stringify(copiedSubTreeList);
              console.log(localStorage.clipboardData);
            },
            writable: true,
            configurable: true
          },
          cloneSubTree: {
            value: function cloneSubTree(root_id) {
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
                } else newNode.id = that.utility.getUniqueId();
                newNode.children = children;
                subTreeNodeList.push(newNode);
                return newNode;
              }

              visit(root_id);

              return {
                root_id: newRootId,
                nodes: subTreeNodeList
              };
            },
            writable: true,
            configurable: true
          },
          createTreeFromOnlineData: {
            value: function createTreeFromOnlineData(nodeId, onlineNotesList) {
              var that = this;
              function visite(nodeId, onlineNotesList) {
                var node = onlineNotesList[nodeId];
                if (!node) {
                  return null;
                }var newNode = new Object();
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
            },
            writable: true,
            configurable: true
          },
          createNewNode: {
            value: function createNewNode(parent_id, insertPosition) {
              var newNode = this.utility.createNewNode();
              var newNodeList = [newNode];
              console.log("insertPosition");
              console.log(insertPosition);
              this.insertSubTree(parent_id, insertPosition, newNodeList, newNode.id);
              // record
              var nodeRecordList = [];
              var nodeRecord = {
                parent_id: parent_id,
                position: insertPosition,
                node_id: newNode.id,
                subTree: newNode
              };
              nodeRecordList.push(nodeRecord);
              this.record(nodeRecordList, "insert");

              // var parent = this.file.nodes[parent_id];
              // this.setNodeToServer(parent.id);
              // this.setNodeToServer(newNode.id);

              // var that = this;
              // this.doEdit(function() {
              //   var updateNode = that.file.nodes[insertParentNodeId];
              //   var updateNodeList = newNodeList;

              //   // Sync to server
              //   if (updateNode && updateNodeList) {
              //     var ref = new Firebase(that.common.firebase_url);
              //     var authData = ref.getAuth();
              //     if (!authData) {
              //       console.log("Please login!")
              //       return;
              //     }
              //     var childrenPath = '/notes/users/' + authData.uid + '/files/' + that.rootVM.file_id +
              //         "/nodes/" + updateNode.id + "/children";
              //     var childrenRef = ref.child(childrenPath);
              //     // clean children;
              //     var children = []
              //     for (var i = 0; i < updateNode.children.length; i++) {
              //       children.push(updateNode.children[i]);
              //     };
              //     childrenRef.set(children);
              //     for (var i = 0; i < updateNodeList.length; i++) {
              //       var nodePath = '/notes/users/' + authData.uid + '/files/' + that.rootVM.file_id +
              //           "/nodes/" + updateNodeList[i].id;
              //       var nodeRef = ref.child(nodePath);
              //       nodeRef.set(updateNodeList[i])
              //     };
              //   }
              // });
              return newNode;
            },
            writable: true,
            configurable: true
          },
          "delete": {
            value: function _delete() {
              console.log("delete");
              var selectedVMList = this.getSelectedVMList();
              console.log(selectedVMList);
              if (0 >= selectedVMList.length && !!this.focusedVM) selectedVMList.push(this.focusedVM);
              console.log(selectedVMList);
              var nodeRecordList = [];
              for (var i = selectedVMList.length - 1; i >= 0; i--) {
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
                var subTree = this.utility.listToTree(this.rootVM.file.nodes, nodeId);
                var position = this.removeSubTree(parentId, nodeId);
                var nodeRecord = {
                  parent_id: parentId,
                  position: position,
                  subTree: subTree
                };
                nodeRecordList.push(nodeRecord);
              };

              // record
              this.rootVM.record(nodeRecordList, "remove");
            },
            writable: true,
            configurable: true
          },
          focusAt: {
            value: function focusAt(id) {
              $(this.element).find("#" + id + " textarea").focus();
            },
            writable: true,
            configurable: true
          },
          onTitleKeyDown: {
            value: function onTitleKeyDown(event) {
              if (13 == event.keyCode && event.shiftKey) {
                var node = this.createNewNode(this.root_id, 0);
                var that = this;
                setTimeout(function () {
                  that.focusAt(node.id);
                }, 10);
                return false;
              } else if (event.ctrlKey && 46 == event.keyCode && this.flatVM) {
                this.flatVM["delete"](this.file.nodes[this.root_id]);
                return false;
              }
              return true;
            },
            writable: true,
            configurable: true
          },
          onTitleKeyUp: {
            value: function onTitleKeyUp(event) {
              var that = this;
              this.doEdit(function () {
                if ("root" == that.root_id) {
                  that.fileRef.child("meta/name").set(that.title);
                } else {
                  that.nodesRef.child(that.root_id).child("content").set(that.title);
                  that.file.nodes[that.root_id].content = that.title;
                }
              });
              return true;
            },
            writable: true,
            configurable: true
          },
          focusNodeAt: {
            value: function focusNodeAt(positionArray) {
              var vm = this.getVMByPositionArray(positionArray);
              if (vm) vm.element.children[0].children[1].focus(); // focus textarea
              // vm.element.getElementsByTagName("textarea")[0].focus();
            },
            writable: true,
            configurable: true
          },
          paste: {
            value: function paste() {
              if (!this.focusedVM) {
                return;
              }var clipboardData = localStorage.getItem("clipboardData");
              if (!clipboardData) {
                return;
              }var copiedSubTreeList = JSON.parse(clipboardData);

              this.clearNodeState();
              var parent = this.focusedVM.parentVM.node;
              var position = -1;
              for (var i = 0; i < parent.children.length; i++) {
                console.log("test id: " + parent.children[i].id + " " + this.focusedVM.node.id);
                if (parent.children[i] == this.focusedVM.node.id) {
                  position = i;
                  break;
                }
              };
              var nodeRecordList = [];
              for (var i = 0; i < copiedSubTreeList.length; i++) {
                // var ret = this.cloneSubTree(copiedSubTreeList[i].node_id)
                var ret = this.utility.treeToList(copiedSubTreeList[i].subTree);
                var insertPosition = position + i + 1;
                this.rootVM.insertSubTree(parent.id, insertPosition, ret.nodes, ret.root_id);
                // for (var j = 0; j < ret.nodes.length; j++) {
                //   var nodeRef = this.nodesRef.child(ret.nodes[j].id)
                //   nodeRef.set(ret.nodes[j]);
                // };
                var nodeRecord = {
                  parent_id: parent.id,
                  position: insertPosition,
                  node_id: ret.root_id,
                  subTree: copiedSubTreeList[i].subTree
                };
                nodeRecordList.push(nodeRecord);
              };
              this.record(nodeRecordList, "insert");

              // // clean children.
              // var children = []
              // for (var i = 0; i < parent.children.length; i++) {
              //   children.push(parent.children[i]);
              // };
              // this.nodesRef.child(parent.id).child("children").set(children)

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
            },
            writable: true,
            configurable: true
          },
          getNodeDataById: {
            value: function getNodeDataById(tree, id) {
              function visite(node) {
                if (id == node.id) {
                  return node;
                }var ret = null;
                for (var i = 0; node.children && i < node.children.length; i++) {
                  ret = visite(node.children[i]);
                  if (!ret) break;
                };
                return ret;
              }

              return visite(tree);
            },
            writable: true,
            configurable: true
          },
          getVMByPositionArray: {
            value: function getVMByPositionArray(positionArray) {
              var vm = this;
              for (var i = 0; i < positionArray.length; i++) {
                vm = vm.childVMList[positionArray[i]];
              };

              return vm;
            },
            writable: true,
            configurable: true
          },
          getSelectedVMList: {
            value: function getSelectedVMList() {
              // console.log(this)
              var selectedVMList = [];
              var visite = (function (_visite) {
                var _visiteWrapper = function visite(_x) {
                  return _visite.apply(this, arguments);
                };

                _visiteWrapper.toString = function () {
                  return _visite.toString();
                };

                return _visiteWrapper;
              })(function (vm) {
                if (vm.selected) {
                  selectedVMList.push(vm);
                } else {
                  for (var i = 0; i < vm.childVMList.length; i++) {
                    visite(vm.childVMList[i]);
                  };
                }
              });
              visite(this);
              return selectedVMList;
            },
            writable: true,
            configurable: true
          },
          insertNodeAt: {
            value: function insertNodeAt(positionArray, node) {
              console.log("insertNodeAt");
              var positionArray = JSON.parse(JSON.stringify(positionArray)); //clone object
              var insertPosition = positionArray.pop();
              var vm = this.getVMByPositionArray(positionArray);
              var newNode = this.utility.clone(node); // To monitor the new node.
              this.addObserver(newNode);
              vm.node.children.splice(insertPosition, 0, newNode);
              // Save to server
              var that = this;
              var visite = (function (_visite) {
                var _visiteWrapper = function visite(_x) {
                  return _visite.apply(this, arguments);
                };

                _visiteWrapper.toString = function () {
                  return _visite.toString();
                };

                return _visiteWrapper;
              })(function (node) {
                console.log("save");
                console.log("node");
                var newNode = new Object();
                that.copyAttributesWithoutChildren(newNode, node);
                newNode.children = [];
                for (var i = 0; node.children && i < node.children.length; i++) {
                  newNode.children.push(node.children[i].id);
                };
                var ref = new Firebase(that.common.firebase_url);
                var authData = ref.getAuth();
                var nodeRef = ref.child("notes").child("users").child(authData.uid).child("files").child(that.file_id).child("nodes").child(node.id);
                nodeRef.set(newNode);
                for (var i = 0; i < node.children.length; i++) {
                  visite(node.children[i]);
                };
              });
              visite(newNode);
            },
            writable: true,
            configurable: true
          },
          loadTitle: {
            value: function loadTitle(root_id) {
              // console.log("root_id:"+root_id)
              // console.log(this.file.meta)
              var that = this;
              this.titleUpdate = function (dataSnapshot) {
                that.title = dataSnapshot.val();
              };
              setTimeout(function () {
                var title = $(that.element).find("#title");
                autosize(title);
              }, 10);
              if ("root" == root_id) {
                this.title = this.file.meta.name;
                this.fileRef.child("meta/name").on("value", this.titleUpdate);
              } else {
                // this.title = this.file.nodes[root_id].content;
                this.nodesRef.child(root_id).child("content").on("value", this.titleUpdate);
              }
            },
            writable: true,
            configurable: true
          },
          onKeyDown: {
            value: function onKeyDown(event) {
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
                setTimeout(function () {
                  that.focusAt(node.id);
                }, 10);
                return false;
              } else if (event.ctrlKey && 46 == event.keyCode) {
                this["delete"]();
                return false;
              } else if (27 == event.keyCode) {
                this.clearNodeState();
                return false;
              } else if (67 == event.keyCode && event.ctrlKey && event.shiftKey) {
                this.copy();
                return false;
              } else if (88 == event.keyCode && event.ctrlKey && event.shiftKey) {
                this.copy();
                this["delete"]();
                return false;
              } else if (86 == event.keyCode && event.ctrlKey && event.shiftKey) {
                this.paste();
                return false;
              } else if (83 == event.keyCode && event.ctrlKey) {
                this.save();
                return false;
              } else if (83 == event.keyCode && event.altKey) {
                if (this.focusedVM) this.focusedVM.fold();
              } else if (90 == event.keyCode && event.ctrlKey && event.shiftKey) {
                this.undo();
                return false;
              } else if (89 == event.keyCode && event.ctrlKey && event.shiftKey) {
                this.redo();
                return false;
              } else if (187 == event.keyCode && event.altKey) {
                if (this.focusedVM) this.focusedVM.stepIcon(true);
                return false;
              } else if (189 == event.keyCode && event.altKey) {
                if (this.focusedVM) this.focusedVM.stepIcon(false);
                return false;
              }
              return true;
            },
            writable: true,
            configurable: true
          },
          removeNodeAt: {
            value: function removeNodeAt(positionArray) {
              console.log("removeNodeAt:" + positionArray.toString());
              var parentPositionArray = JSON.parse(JSON.stringify(positionArray)); //clone object
              var removePosition = parentPositionArray.pop();
              var vm = this.getVMByPositionArray(positionArray);
              var parentVM = this.getVMByPositionArray(parentPositionArray);
              var that = this;
              setTimeout(function () {
                parentVM.removeChildVM(vm);
                var removedNodes = parentVM.node.children.splice(removePosition, 1);
                console.log("removedNodes");
                console.log(removedNodes);
                for (var i = 0; removedNodes && i < removedNodes.length; i++) {
                  that.removeObserver(removedNodes[i]);
                  // Remove from server
                  var visite = (function (_visite) {
                    var _visiteWrapper = function visite(_x) {
                      return _visite.apply(this, arguments);
                    };

                    _visiteWrapper.toString = function () {
                      return _visite.toString();
                    };

                    return _visiteWrapper;
                  })(function (node) {
                    var ref = new Firebase(that.common.firebase_url);
                    var authData = ref.getAuth();
                    var nodeRef = ref.child("notes").child("users").child(authData.uid).child("files").child(that.file_id).child("nodes").child(node.id);
                    nodeRef.remove();
                    for (var i = 0; i < node.children.length; i++) {
                      visite(node.children[i]);
                    };
                  });
                  visite(removedNodes[i]);
                };
              }, 0);
            },
            writable: true,
            configurable: true
          },
          uncollapsed: {

            // removeObserver(node) {
            //   Object.unobserve(node, node.observer);
            //   Object.unobserve(node.children, node.children_observer);
            // }

            value: function uncollapsed(positionArray) {
              var node = this.node;
              for (var i = 0; i < positionArray.length; i++) {
                node.collapsed = false;
                node = node.children[positionArray[i]];
              };
            },
            writable: true,
            configurable: true
          },
          save: {
            value: function save() {
              console.log(this.focusedVM.element);
              // console.log(this.operationRecordList)
              // this.dataSource.save(this.path, JSON.stringify(this.node))
              //     .catch(err => {
              //       console.log(err);
              //     });
            },
            writable: true,
            configurable: true
          },
          select: {
            value: function select(positionArray) {
              var vm = getVMByPositionArray(positionArray);
              vm.select();
            },
            writable: true,
            configurable: true
          }
        });

        return Tree;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNqRCx3QkFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLHdCQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUM5RCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0RSwyQkFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2pCLHlCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0MsNEJBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzFCLENBQUM7bUJBQ0gsQ0FBQSxDQUFBO0FBQ0Qsd0JBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDekIsQ0FBQztlQUdILEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDUDs7OztBQU9ELHFCQUFXOzs7Ozs7O21CQUFBLHFCQUFDLGFBQWEsRUFBRTtBQUN6QixrQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNyQixtQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0Msb0JBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLG9CQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtlQUN2QyxDQUFDO2FBQ0g7Ozs7QUFFRCxjQUFJO21CQUFBLGdCQUFHO0FBQ0wscUJBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7Ozs7O2FBTXJDOzs7O0FBRUQsZ0JBQU07bUJBQUEsZ0JBQUMsYUFBYSxFQUFFO0FBQ3BCLGtCQUFJLEVBQUUsR0FBRyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM3QyxnQkFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ2I7Ozs7OztlQXZ1QlUsSUFBSTtTQUFTLElBQUkiLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9