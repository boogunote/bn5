System.register(["./common", "./utility"], function (_export) {
  var Common, Utility, _prototypeProperties, _classCallCheck, Node;

  return {
    setters: [function (_common) {
      Common = _common.Common;
    }, function (_utility) {
      Utility = _utility.Utility;
    }],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Node = _export("Node", (function () {
        function Node(common, utility) {
          _classCallCheck(this, Node);

          this.common = common;
          this.utility = utility;

          this.childVMList = [];
        }

        _prototypeProperties(Node, {
          inject: {
            value: function inject() {
              return [Common, Utility];
            },
            writable: true,
            configurable: true
          }
        }, {
          addChildVM: {
            value: function addChildVM(vm, id) {
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
            },
            writable: true,
            configurable: true
          },
          addObserver: {
            value: function addObserver(node) {
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
                this.remoteObserver = function (dataSnapshot) {
                  // console.log("remoteObserver")
                  // console.log(dataSnapshot.val())
                  if (that.rootVM.editing) return;
                  if (that.utility.now() - that.rootVM.setToRemoteTime < 2000) return;
                  var newNode = dataSnapshot.val();
                  if (!newNode) return;
                  if (that.utility.isSameNode(that.node, newNode)) return;
                  that.doUpdate(newNode);
                };
                this.rootVM.nodesRef.child(node.id).on("value", this.remoteObserver);
              }
            },
            writable: true,
            configurable: true
          },
          removeObserver: {
            value: function removeObserver() {
              // console.log("removeObserver")
              if (!this.node) {
                return;
              }if (this.localObserver) Object.unobserve(this.node, this.localObserver);
              if (this.remoteObserver) this.rootVM.nodesRef.child(this.node.id).off("value", this.remoteObserver);
            },
            writable: true,
            configurable: true
          },
          setNodeToServer: {

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

            value: function setNodeToServer(node_id) {
              var nodeRef = this.rootVM.nodesRef.child(node_id);
              // var newNode = new Object();
              // this.utility.copyAttributesWithoutChildren(newNode, node);
              // newNode.children = [];
              // for (var i = 0; i < node.children.length; i++) {
              //   newNode.children.push(node.children[i]);
              // };
              var that = this;
              this.doEdit(function () {
                // console.log("setNodeToServer")
                var newNode = new Object();
                that.utility.copyAttributes(newNode, that.rootVM.file.nodes[node_id]);
                nodeRef.set(newNode);
              });
              // this.rootVM.editing = false;

              // this.rootVM.setToRemoteTime = this.utility.now();
              // console.log("setNodeToServer")
              // var t = new Date(that.rootVM.setToRemoteTime)
              // console.log("localObserver:"+t.toLocaleTimeString()+" "+t.getMilliseconds());
              // console.log(newNode); 
            },
            writable: true,
            configurable: true
          },
          doEdit: {
            value: function doEdit(realEdit) {
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
              var edit = (function (_edit) {
                var _editWrapper = function edit() {
                  return _edit.apply(this, arguments);
                };

                _editWrapper.toString = function () {
                  return _edit.toString();
                };

                return _editWrapper;
              })(function () {
                if (that.rootVM.editing && that.utility.now() - that.rootVM.localChangedTime < that.rootVM.localChangeWaitTime - that.rootVM.localChangeWaitEpsilon) {
                  setTimeout(edit, that.rootVM.localChangeWaitTime);
                  // console.log("setTimeout2")
                } else {
                  that.rootVM.editing = false;
                }
              });
              this.rootVM.localChangedTime = this.utility.now();
              if (!this.rootVM.editing) {
                this.rootVM.editing = true;
                setTimeout(edit, that.rootVM.localChangeWaitTime);
                // console.log("setTimeout1")
              };
              realEdit();
            },
            writable: true,
            configurable: true
          },
          doUpdate: {
            value: function doUpdate(newNode) {
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
              var update = (function (_update) {
                var _updateWrapper = function update() {
                  return _update.apply(this, arguments);
                };

                _updateWrapper.toString = function () {
                  return _update.toString();
                };

                return _updateWrapper;
              })(function () {
                // console.log("that.rootVM.receiveRemoteTime")
                // console.log(that.rootVM.receiveRemoteTime)
                if (that.utility.now() - that.rootVM.receiveRemoteTime < that.rootVM.remoteChangeWaitTime - that.rootVM.remoteChangeWaitEpsilon) {
                  setTimeout(update, that.remoteChangeWaitTime);
                } else {
                  that.rootVM.updating = false;
                  // console.log("that.rootVM.updating =false;")
                }
              });
              if (!this.rootVM.updating) {
                this.rootVM.updating = true;
                setTimeout(update, that.rootVM.remoteChangeWaitTime);
              };
              // remove observer.
              for (var i = this.node.children.length - 1; i >= 0; i--) {
                var removed = true;
                for (var j = 0; newNode.children && j < newNode.children.length; j++) {
                  if (this.node.children[i] == newNode.children[j]) {
                    removed = false;
                    break;
                  }
                }
                if (removed) {
                  // var that = this;
                  var remove_observer = (function (_remove_observer) {
                    var _remove_observerWrapper = function remove_observer(_x) {
                      return _remove_observer.apply(this, arguments);
                    };

                    _remove_observerWrapper.toString = function () {
                      return _remove_observer.toString();
                    };

                    return _remove_observerWrapper;
                  })(function (vm) {
                    // Object.unobserve(vm.node, vm.localObserver);
                    // that.rootVM.nodesRef.child(vm.node.id).off("value", vm.remoteObserver);
                    // vm.remoteObserver = undefined;
                    vm.removeObserver();
                    for (var i = 0; i < vm.childVMList.length; i++) {
                      remove_observer(vm.childVMList[i]);
                    };
                  });
                  remove_observer(this.childVMList[i]);
                };
              };

              // console.log("this.utility.copyAttributes(this.node, newNode);")
              // console.log(this.node);
              // console.log(newNode)

              // flat view needs children be loaded before being added.
              if (this.node.id == "root") {
                var newChildrenList = [];
                for (var i = 0; newNode.children && i < newNode.children.length; i++) {
                  var find = false;
                  for (var j = 0; this.node.children && j < this.node.children.length; j++) {
                    if (newNode.children[i] == this.node.children[j]) {
                      find = true;
                      break;
                    }
                  };
                  if (!find) {
                    newChildrenList.push(newNode.children[i]);
                  };
                };

                if (newChildrenList.length != 0) {
                  var count = 0;
                  for (var i = 0; i < newChildrenList.length; i++) {
                    this.nodesRef.child(newChildrenList[i]).once("value", function (dataSnapshot) {
                      var childNode = dataSnapshot.val();
                      that.file.nodes[childNode.id] = childNode;
                      count++;
                      if (count == newChildrenList.length) {
                        that.utility.copyAttributes(that.node, newNode);
                        that.rootVM.receiveRemoteTime = that.utility.now();
                        setTimeout(function () {
                          if (that.resize) that.resize();
                        }, 0);
                      };
                    });
                    newChildrenList[i];
                  };
                  this.rootVM.receiveRemoteTime = this.utility.now();
                  return;
                }
              }
              this.utility.copyAttributes(this.node, newNode);
              this.rootVM.receiveRemoteTime = this.utility.now();
              setTimeout(function () {
                if (that.resize) that.resize();
              }, 0);
            },
            writable: true,
            configurable: true
          },
          getNodeListByRootId: {
            value: function getNodeListByRootId(rootId) {
              var nodeList = [];
              var that = this;
              function visit(node_id) {
                var node = that.file.nodes[node_id];
                nodeList.push(node);
                for (var i = 0; i < node.children.length; i++) {
                  visit(node.children[i]);
                };
              }
              visit(rootId);
              return nodeList;
            },
            writable: true,
            configurable: true
          },
          insertSubTree: {
            value: function insertSubTree(parent_id, insertPosition, sub_tree, root_id) {
              var parent = this.rootVM.file.nodes[parent_id];
              for (var i = 0; i < sub_tree.length; i++) {
                this.rootVM.file.nodes[sub_tree[i].id] = sub_tree[i];
              };

              if (!parent.children) {
                parent.children = [];
              };
              parent.children.splice(insertPosition, 0, root_id);
              // this.doEdit(parent, this.rootVM.file_id, parent.id);

              // Do not use doEdit(). Set it directly. It's not text editing.
              this.setNodeListToServer(sub_tree);
              this.setNodeChildrenToServer(this.file.nodes[parent_id]);
              console.log("setNodeChildrenToServer");
              console.log(this.file.nodes[parent_id]);
              this.rootVM.setToRemoteTime = this.utility.now();
            },
            writable: true,
            configurable: true
          },
          loadNode: {
            value: function loadNode(node_id, force) {
              if (force || !this.node) {
                this.node = this.rootVM.file.nodes[node_id];
                if (this.node) {
                  if (!this.node.children) this.node.children = [];
                  this.addObserver(this.node);
                } else {
                  this.loadNodeFromServer(node_id);
                }
              }
            },
            writable: true,
            configurable: true
          },
          loadNodeFromServer: {
            value: function loadNodeFromServer(node_id) {
              console.log("loadNodeFromServer: " + node_id);
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
              this.rootVM.nodesRef.child(node_id).once("value", function (dataSnapshot) {
                // console.log("loadNodeFromServer dataSnapshot.val()")
                // console.log(dataSnapshot.val())
                that.node = dataSnapshot.val();
                console.log("loadNodeFromServer: ");
                console.log(that.node);
                if (!that.node) {
                  that.node = that.utility.createNewNode();
                  that.node.id = node_id;
                }
                if (!that.node.children) {
                  that.node.children = [];
                };
                that.addObserver(that.node);
                that.rootVM.file.nodes[that.node.id] = that.node;
                if (that.node.id != that.rootVM.root_id) {
                  if (that.element.children[0].children[1]) that.ta = that.element.children[0].children[1];
                  if (that.ta) that.foldNode();
                }
              }, function (error) {
                console.log(JSON.stringify(error));
              });
            },
            writable: true,
            configurable: true
          },
          openSubTreeInNewWindow: {
            value: function openSubTreeInNewWindow(node_id) {
              var url = "#tree/online/" + this.rootVM.user_id + "/" + this.rootVM.file_id + "/" + this.node.id;
              window.open(url);
            },
            writable: true,
            configurable: true
          },
          removeChildVM: {
            value: function removeChildVM(vm) {
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
            },
            writable: true,
            configurable: true
          },
          removeSubTree: {
            value: function removeSubTree(parent_id, node_id) {
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

              if (-1 == position) {
                return;
              }parent.children.splice(position, 1);
              var nodeList = this.getNodeListByRootId(node_id);
              for (var i = 0; i < nodeList.length; i++) {
                this.rootVM.file.nodes[nodeList[i].id] = undefined;
              };

              // doEdit to prevent the modification, which send back from server.
              // var that = this;
              // this.doEdit(function() {
              //   that.setNodeToServer(parent);
              // })

              // Do not use doEdit(). Set it directly. It's not text editing.

              console.log("setNodeChildrenToServer");
              console.log(this.file.nodes[parent_id]);
              this.removeNodeListFromServer(nodeList);
              this.setNodeChildrenToServer(this.file.nodes[parent_id]);
              this.rootVM.setToRemoteTime = this.utility.now();

              return position;
            },
            writable: true,
            configurable: true
          },
          record: {
            value: (function (_record) {
              var _recordWrapper = function record(_x, _x2) {
                return _record.apply(this, arguments);
              };

              _recordWrapper.toString = function () {
                return _record.toString();
              };

              return _recordWrapper;
            })(function (nodeDataList, operation) {
              var record = {};
              record.operation = operation;
              record.nodeList = nodeDataList;

              this.operationRecordList.splice(this.operationRecordList.cursor + 1);
              this.operationRecordList.push(record);
              this.operationRecordList.cursor++;
            }),
            writable: true,
            configurable: true
          },
          redo: {
            value: function redo() {
              console.log("redo");
              // console.log($scope.$operationRecordList)
              if (this.operationRecordList.cursor >= this.operationRecordList.length - 1) {
                return;
              }this.operationRecordList.cursor++;
              var record = this.operationRecordList[this.operationRecordList.cursor];
              if ("insert" == record.operation) {
                for (var i = 0; i < record.nodeList.length; i++) {
                  // this.uncollapsed(record.nodeList[i].positionArray);
                  // this.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
                  var r = record.nodeList[i];
                  var ret = this.utility.treeToList(r.subTree);
                  this.insertSubTree(r.parent_id, r.position, ret.nodes, ret.root_id);
                  r.node_id = ret.root_id;
                  // // var nodeList = this.getNodeListByRootId(ret.root_id);
                  // var that = this;
                  // this.doEdit(function() {
                  //   that.setNodeListToServer(ret.nodes);
                  //   that.setNodeChildrenToServer(that.file.nodes[r.parent_id]);
                  //   console.log("setNodeChildrenToServer");
                  //   console.log(that.file.nodes[r.parent_id])
                  //   that.rootVM.setToRemoteTime = that.utility.now();
                  // });

                  // // this.doEdit(this.file.nodes[r.parent_id]);
                }
              } else if ("remove" == record.operation) {
                for (var i = 0; i < record.nodeList.length; i++) {
                  // this.uncollapsed(record.nodeList[i].positionArray);
                  // this.removeNodeAt(record.nodeList[i].positionArray);
                  var r = record.nodeList[i];
                  var nodeList = this.getNodeListByRootId(r.node_id);
                  r.subTree = this.utility.listToTree(this.rootVM.file.nodes, r.node_id);
                  this.removeSubTree(r.parent_id, r.node_id);

                  // this.doEdit(this.file.nodes[r.parent_id]);
                }
              }
            },
            writable: true,
            configurable: true
          },
          setNodeChildrenToServer: {
            value: function setNodeChildrenToServer(node) {
              var children = [];
              for (var i = 0; i < node.children.length; i++) {
                children.push(node.children[i]);
              };
              this.nodesRef.child(node.id).child("children").set(children);
            },
            writable: true,
            configurable: true
          },
          removeNodeListFromServer: {
            value: function removeNodeListFromServer(nodeList) {
              for (var i = 0; i < nodeList.length; i++) {
                this.nodesRef.child(nodeList[i].id).remove();
              };
            },
            writable: true,
            configurable: true
          },
          setNodeListToServer: {
            value: function setNodeListToServer(nodeList) {
              for (var i = 0; i < nodeList.length; i++) {
                // this.doEdit(nodeList[i]);
                var newNode = new Object();
                this.utility.copyAttributesWithoutChildren(newNode, nodeList[i]);
                var children = [];
                for (var j = 0; j < nodeList[i].children.length; j++) {
                  children.push(nodeList[i].children[j]);
                };
                newNode.children = children;
                this.nodesRef.child(nodeList[i].id).set(newNode);
              };
            },
            writable: true,
            configurable: true
          },
          undo: {
            value: function undo() {
              if (this.operationRecordList.cursor < 0) {
                return;
              }var record = this.operationRecordList[this.operationRecordList.cursor];
              this.operationRecordList.cursor--;
              if ("insert" == record.operation) {
                for (var i = record.nodeList.length - 1; i >= 0; i--) {
                  // this.uncollapsed(record.nodeList[i].positionArray);
                  var r = record.nodeList[i];
                  r.subTree = this.utility.listToTree(this.rootVM.file.nodes, r.node_id);
                  this.removeSubTree(r.parent_id, r.node_id);
                  // var that = this;
                  // this.doEdit(function() {
                  //   that.setNodeChildrenToServer(that.file.nodes[r.parent_id]);
                  //   console.log("setNodeChildrenToServer");
                  //   console.log(that.file.nodes[r.parent_id])
                  //   that.removeNodeListFromServer(nodeList)

                  //   that.rootVM.setToRemoteTime = that.utility.now();

                  // });
                  // this.doEdit(this.file.nodes[r.parent_id]);
                  // this.removeNodeAt(record.nodeList[i].positionArray);
                }
              } else if ("remove" == record.operation) {
                for (var i = record.nodeList.length - 1; i >= 0; i--) {
                  // this.uncollapsed(record.nodeList[i].positionArray);
                  // this.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
                  var r = record.nodeList[i];
                  var ret = this.utility.treeToList(r.subTree);
                  this.insertSubTree(r.parent_id, r.position, ret.nodes, ret.root_id);
                  r.node_id = ret.root_id;
                  // // var nodeList = this.getNodeListByRootId(r.node_id);
                  // var that = this;
                  // this.doEdit(function() {
                  //   that.setNodeListToServer(ret.nodes);
                  //   that.setNodeChildrenToServer(that.file.nodes[r.parent_id]);
                  //   console.log("setNodeChildrenToServer");
                  //   console.log(that.file.nodes[r.parent_id])
                  //   that.rootVM.setToRemoteTime = that.utility.now();
                  // });
                  // // this.doEdit(this.file.nodes[r.parent_id]);
                }
              }
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
            ,
            writable: true,
            configurable: true
          }
        });

        return Node;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QUFDLE1BQU0sR0FBRyxDQUFDO0FBQUUsdUJBQU87ZUFBQSxBQUNoRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZFLGtCQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEMsa0JBQUksUUFBUSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7QUFDaEMscUJBQUssSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0FBRXBELHNCQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLG1CQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdkUsc0JBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7aUJBYTVDO2VBQ0YsTUFBTSxJQUFJLFFBQVEsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQ3ZDLHFCQUFLLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFHLENBQUMsRUFBRSxFQUFFOzs7QUFHckQsc0JBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0Isc0JBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QyxzQkFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDcEUsbUJBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQzs7Ozs7Ozs7Ozs7aUJBV3pCO2VBQ0Y7YUFDRjs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztlQTlnQlUsSUFBSSIsImZpbGUiOiJub2RlLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIn0=