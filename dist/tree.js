System.register(["./data-source", "./node", "./tree-params", "./utility", "./common", "jquery", "jquery-autosize"], function (_export) {
  var DataSource, Node, TreeParams, Utility, Common, _createClass, _get, _inherits, _classCallCheck, Tree;

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
    }, function (_jquery) {}, function (_jqueryAutosize) {}],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Tree = _export("Tree", (function (_Node) {
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

        _inherits(Tree, _Node);

        _createClass(Tree, {
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
            }
          },
          attached: {
            value: function attached() {
              console.log("attached");
            }
          },
          detached: {
            value: function detached() {
              console.log("detached");
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
          },
          focusAt: {
            value: function focusAt(id) {
              $(this.element).find("#" + id + " textarea").focus();
            }
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
              } else if (event.ctrlKey && 192 == event.keyCode) {
                this.openSubTreeInNewWindow(this.node.id);
              }
              return true;
            }
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
            }
          },
          focusNodeAt: {
            value: function focusNodeAt(positionArray) {
              var vm = this.getVMByPositionArray(positionArray);
              if (vm) vm.element.children[0].children[1].focus(); // focus textarea
              // vm.element.getElementsByTagName("textarea")[0].focus();
            }
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
            }
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
            }
          },
          getVMByPositionArray: {
            value: function getVMByPositionArray(positionArray) {
              var vm = this;
              for (var i = 0; i < positionArray.length; i++) {
                vm = vm.childVMList[positionArray[i]];
              };

              return vm;
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
          },
          save: {
            value: function save() {
              console.log(this.focusedVM.element);
              // console.log(this.operationRecordList)
              // this.dataSource.save(this.path, JSON.stringify(this.node))
              //     .catch(err => {
              //       console.log(err);
              //     });
            }
          },
          select: {
            value: function select(positionArray) {
              var vm = getVMByPositionArray(positionArray);
              vm.select();
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [DataSource, Element, TreeParams, Common, Utility];
            }
          }
        });

        return Tree;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QkFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsb0JBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2VBQ3ZDLENBQUM7YUFDSDs7QUFFRCxjQUFJO21CQUFBLGdCQUFHO0FBQ0wscUJBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7Ozs7O2FBTXJDOztBQUVELGdCQUFNO21CQUFBLGdCQUFDLGFBQWEsRUFBRTtBQUNwQixrQkFBSSxFQUFFLEdBQUcsb0JBQW9CLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDN0MsZ0JBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNiOzs7QUEzdUJNLGdCQUFNO21CQUFBLGtCQUFHO0FBQUUscUJBQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFBRTs7OztlQURuRSxJQUFJO1NBQVMsSUFBSSIsImZpbGUiOiJ0cmVlLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIn0=