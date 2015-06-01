System.register(["./data-source", "./node", "./tree-params", "./utility", "./common", "jquery", "jquery-autosize"], function (_export) {
  var DataSource, Node, TreeParams, Utility, Common, autosize, _prototypeProperties, _get, _inherits, _classCallCheck, Tree;

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
    }, function (_jquery) {}, function (_jqueryAutosize) {
      autosize = _jqueryAutosize["default"];
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
                this.user_id = params.user_id;
                this.fileRef = this.rootRef.child("/notes/users/" + this.utility.getRealUserId(this.user_id) + "/files/" + this.file_id);
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
              } else if (event.ctrlKey && event.shiftKey && 67 == event.keyCode && this.flatVM) {
                this.flatVM.copy(this.file.nodes[this.root_id]);
                return false;
              } else if (event.ctrlKey && event.shiftKey && 86 == event.keyCode && this.flatVM) {
                this.flatVM.infect(this.file.nodes[this.root_id]);
                return false;
              } else if (event.ctrlKey && event.shiftKey && 88 == event.keyCode && this.flatVM) {
                this.flatVM.copy(this.file.nodes[this.root_id]);
                this.flatVM["delete"](this.file.nodes[this.root_id]);
                return false;
              } else if (event.ctrlKey && 192 == event.keyCode) {
                this.openSubTreeInNewWindow(this.node.id);
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
                // var ref = new Firebase(that.common.firebase_url);
                // var authData = ref.getAuth();
                // var nodeRef = ref.child("notes").child("users").child(this.user_id)
                //     .child("files").child(that.file_id).child("nodes").child(node.id);
                // nodeRef.set(newNode)
                this.nodesRef.child(node.id).set(newNode);
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
              this.titleElement = $(this.element).find("#title")[0];
              autosize(this.titleElement);
              var that = this;
              this.titleUpdate = function (dataSnapshot) {
                that.title = dataSnapshot.val();
                setTimeout(function () {
                  var ta = $(that.element).find("#title")[0];
                  autosize(ta);
                }, 0);
              };

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
                    // var ref = new Firebase(that.common.firebase_url);
                    // var authData = ref.getAuth();
                    // var nodeRef = ref.child("notes").child("users").child(authData.uid)
                    //     .child("files").child(that.file_id).child("nodes").child(node.id);
                    // nodeRef.remove();
                    that.nodesRef.child(node.id).remove();
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
//# sourceMappingURL=data:application/json;base64,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