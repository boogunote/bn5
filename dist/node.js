System.register(["./common", "./utility"], function (_export) {
  var Common, Utility, _createClass, _classCallCheck, Node;

  return {
    setters: [function (_common) {
      Common = _common.Common;
    }, function (_utility) {
      Utility = _utility.Utility;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Node = _export("Node", (function () {
        function Node(common, utility) {
          _classCallCheck(this, Node);

          this.common = common;
          this.utility = utility;

          this.childVMList = [];
        }

        _createClass(Node, {
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
            }
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
            }
          },
          removeObserver: {
            value: function removeObserver() {
              // console.log("removeObserver")
              if (!this.node) {
                return;
              }if (this.localObserver) Object.unobserve(this.node, this.localObserver);
              if (this.remoteObserver) this.rootVM.nodesRef.child(this.node.id).off("value", this.remoteObserver);
            }
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
            }
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
            }
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
                // if (that.resize) that.resize();
                if (that.foldNode) that.foldNode();
              }, 0);
            }
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
            }
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
            }
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
            }
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
            }
          },
          openSubTreeInNewWindow: {
            value: function openSubTreeInNewWindow(node_id) {
              var url = "#tree/online/" + this.rootVM.user_id + "/" + this.rootVM.file_id + "/" + this.node.id;
              window.open(url);
            }
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
            }
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
            }
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
            })
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
            }
          },
          setNodeChildrenToServer: {
            value: function setNodeChildrenToServer(node) {
              var children = [];
              for (var i = 0; i < node.children.length; i++) {
                children.push(node.children[i]);
              };
              this.nodesRef.child(node.id).child("children").set(children);
            }
          },
          removeNodeListFromServer: {
            value: function removeNodeListFromServer(nodeList) {
              for (var i = 0; i < nodeList.length; i++) {
                this.nodesRef.child(nodeList[i].id).remove();
              };
            }
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
            }
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

          }
        }, {
          inject: {
            value: function inject() {
              return [Common, Utility];
            }
          }
        });

        return Node;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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LENBQUMsQ0FBQztBQUN2RSxrQkFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xDLGtCQUFJLFFBQVEsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQ2hDLHFCQUFLLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFOztBQUVwRCxzQkFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixtQkFBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZFLHNCQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O2lCQWE1QztlQUNGLE1BQU0sSUFBSSxRQUFRLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtBQUN2QyxxQkFBSyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRyxDQUFDLEVBQUUsRUFBRTs7O0FBR3JELHNCQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLHNCQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0Msc0JBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BFLG1CQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7Ozs7Ozs7Ozs7O2lCQVd6QjtlQUNGO2FBQ0Y7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUE5Z0JNLGdCQUFNO21CQUFBLGtCQUFHO0FBQUUscUJBQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFBRTs7OztlQURsQyxJQUFJIiwiZmlsZSI6Im5vZGUuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==