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
//# sourceMappingURL=data:application/json;base64,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