System.register(["./utility", "./common", "./node", "jquery", "jquery-autosize"], function (_export) {
  var Utility, Common, Node, autosize, _prototypeProperties, _get, _inherits, _classCallCheck, Tree;

  return {
    setters: [function (_utility) {
      Utility = _utility.Utility;
    }, function (_common) {
      Common = _common.Common;
    }, function (_node) {
      Node = _node.Node;
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
        function Tree(common, utility) {
          _classCallCheck(this, Tree);

          _get(Object.getPrototypeOf(Tree.prototype), "constructor", this).call(this);
          this.common = common;
          this.utility = utility;

          this.operationRecordList = [];
          this.operationRecordList.cursor = -1;

          this.file_id = null;
          this.root_id = "root";
          this.rootVM = this;
          this.file = null;
          this.title = null;
          this.fileRef = null;
          this.nodesRef = null;

          this.filePath = null;

          this.editing = false;
          this.updating = false;
          this.localChangedTime = 0;
          this.setToRemoteTime = 0;
          this.receiveRemoteTime = 0;
          this.localChangeWaitTime = 200;
          this.localChangeWaitEpsilon = 10;
          this.remoteChangeWaitTime = 1000;
          this.remoteChangeWaitEpsilon = 50;
        }

        _inherits(Tree, Node);

        _prototypeProperties(Tree, {
          inject: {
            value: function inject() {
              return [Common, Utility];
            },
            writable: true,
            configurable: true
          }
        }, {
          activate: {
            value: function activate(params, queryString, routeConfig) {
              console.log("activate");
              this.file_id = params.file_id;
              // this.root_id = params.root_id;
              this.rootRef = new Firebase(this.common.firebase_url);
              var authData = this.rootRef.getAuth();
              if (!authData) {
                console.log("Please login!");
                return;
              }
              this.fileRef = this.rootRef.child("/notes/users/" + authData.uid + "/files/" + this.file_id);
              this.nodesRef = this.fileRef.child("nodes");

              // console.log("params")
              // console.log(params)
              if ("online" == params.type) {
                var ref = new Firebase(this.common.firebase_url);
                var authData = ref.getAuth();
                if (!authData) {
                  console.log("Please login!");
                  return;
                }
                var that = this;
                this.fileRef.once("value", function (dataSnapshot) {
                  console.log("1111111111111dataSnapshot.val()");
                  that.file = dataSnapshot.val();
                  console.log(that.file);
                  if (that.file) {
                    that.node = that.file.nodes.root;
                    that.file_id = that.file.meta.id;
                    // that.routeConfig.navModel.title = that.file.meta.name;
                    // that.routeConfig.title = that.file.meta.name;
                    // that.routeConfig.name = that.file.meta.name;
                    console.log(that.node);
                    console.log(that.file_id);
                    that.loadNode(that.root_id, true);
                    // that.loadTitle(that.root_id);
                    if (!that.node.children) that.node.children = [];
                    // setTimeout(function() {

                    //   for (var i = 0; i < that.node.children.length; i++) {
                    //     that.setPosition(that.node.children[i]);
                    //   };
                    // }, 10);
                  }
                });

                this.nodesRef.child("root/children").on("value", function (dataSnapshot) {
                  var children = dataSnapshot.val();
                  for (var i = 0; i < children.length; i++) {
                    if (that.file && !that.file.nodes[children[i]]) {
                      var placeHolder = that.utility.createNewFlatNode();
                      placeHolder.id = children[i];
                      that.file.nodes[children[i]] = placeHolder;
                    }
                  };
                });
              }
            },
            writable: true,
            configurable: true
          },
          canActivate: {
            value: function canActivate(params, queryString, routeConfig) {
              // this.routeConfig = routeConfig;
              // this.routeConfig.navModel.title = "wawaw";
              return true;
            },
            writable: true,
            configurable: true
          },
          "delete": {
            value: function _delete(node) {
              var nodeRecordList = [];
              var subTree = this.utility.listToTree(this.rootVM.file.nodes, node.id);
              var position = this.removeSubTree(this.file.nodes.root.id, node.id);
              var nodeRecord = {
                parent_id: this.root_id,
                position: position,
                subTree: subTree
              };
              nodeRecordList.push(nodeRecord);
              this.rootVM.record(nodeRecordList, "remove");
            },
            writable: true,
            configurable: true
          },
          newFlatNode: {

            // removeSubTree(parent_id, node_id) {
            //   var parent = this.file.nodes[parent_id];
            //   var position = -1;
            //   for (var i = 0; i < parent.children.length; i++) {
            //     if (parent.children[i] == node_id) {
            //       position = i;
            //       break;
            //     }
            //   };

            //   if (-1 == position) return;

            //   parent.children.splice(position, 1);

            //   var that = this;
            //   var remove_observer = function(vm) {
            //     Object.unobserve(vm.node, vm.localObserver);
            //     that.nodesRef.child(vm.node.id).off("value", vm.remoteObserver);
            //     for (var i = 0; i < vm.childVMList.length; i++) {
            //       remove_observer(vm.childVMList[i]);
            //     };
            //   }
            //   // remove_observer(this.childVMList[position]);
            //   remove_observer(this);
            //   var delete_sub_node = function(node_id) {
            //     that.nodesRef.child(node_id).remove();
            //     for (var i = 0; that.rootVM.file.nodes[node_id].children && i < that.rootVM.file.nodes[node_id].children.length; i++) {
            //       delete_sub_node(that.rootVM.file.nodes[node_id].children[i]);
            //     };
            //     that.file.nodes[node_id] = undefined;
            //   }

            //   delete_sub_node(node_id);
            //   // doEdit to prevent the modification, which send back from server.
            //   this.doEdit(function() {
            //     that.setNodeToServer(parent);
            //   })
            //   return position;
            // }

            value: function newFlatNode() {
              var flatNode = this.utility.createNewFlatNode();
              this.nodesRef.child(flatNode.id).set(flatNode);
              var children = this.utility.getCleanChildren(this.node);
              this.file.nodes[flatNode.id] = flatNode;
              this.node.children.push(flatNode.id);
              // var that = this;
              // setTimeout(function() {
              //   that.utility.initInteract(flatNode.id);
              // }, 0);

              children.push(flatNode.id);
              this.nodesRef.child("root/children").set(children);

              // this.doEdit(function() {
              //   // if (!this.root.children) this.root.children = [];
              //   children.push(flatNode.id);
              //   that.nodesRef.child("root/children").set(children);
              // });

              // record
              var nodeRecordList = [];
              var nodeRecord = {
                parent_id: this.root_id,
                position: children.length - 1,
                node_id: flatNode.id,
                subTree: flatNode
              };
              nodeRecordList.push(nodeRecord);
              this.record(nodeRecordList, "insert");
            },
            writable: true,
            configurable: true
          },
          newTemporaryMosaic: {
            value: function newTemporaryMosaic() {
              window.open(window.location.origin + "#mosaic");
            },
            writable: true,
            configurable: true
          },
          onClick: {
            value: function onClick(event) {
              // console.log(event);
              // event.bubbles = false;
              var delta = 100;
              if (!event.ctrlKey) {
                var y = event.pageY;
                var expand = null;
                if (!event.shiftKey) {
                  expand = true;
                } else {
                  expand = false;
                }

                for (var i = 0; i < this.node.children.length; i++) {
                  var node = this.file.nodes[this.node.children[i]];
                  if (node.y > y) {
                    if (expand) {
                      node.y += delta;
                    } else {
                      node.y -= delta;
                    }

                    if (node.y < 0) node.y = 0;

                    this.nodesRef.child(node.id + "/y").set(node.y);
                  }
                };

                if (expand) {
                  this.node.height += delta;
                } else {
                  this.node.height -= delta;
                }
                this.nodesRef.child(this.node.id + "/height").set(this.node.height);
              } else {
                var x = event.pageX;
                var expand = null;
                if (!event.shiftKey) {
                  expand = true;
                } else {
                  expand = false;
                }

                for (var i = 0; i < this.node.children.length; i++) {
                  var node = this.file.nodes[this.node.children[i]];
                  if (node.x > x) {
                    if (expand) {
                      node.x += delta;
                    } else {
                      node.x -= delta;
                    }
                  }
                  if (node.x < 0) node.x = 0;
                  this.nodesRef.child(node.id + "/x").set(node.x);
                }

                if (expand) {
                  this.node.width += delta;
                } else {
                  this.node.width -= delta;
                }
                this.nodesRef.child(this.node.id + "/width").set(this.node.width);
              }

              return false;
            },
            writable: true,
            configurable: true
          },
          onWindowClick: {
            value: function onWindowClick(event) {
              event.stopPropagation();
              return false;
            },
            writable: true,
            configurable: true
          },
          setPositionToRemoteServer: {
            value: function setPositionToRemoteServer(id) {
              // var element = $("#"+id);
              // console.log(element.left())
              // console.log(element.top())
              // console.log(element.width())
              // console.log(element.height())
              // var newNode = new Object();
              // this.utility.copyAttributes(newNode, this.file.nodes[id]);
              // console.log("2- "+element.position().left+" "+element.position().top+" "+element.width()+" "+element.height())

              var that = this;
              this.doEdit(function () {
                // console.log("3- "+element.position().left+" "+element.position().top+" "+element.width()+" "+element.height())
                // // console.log("setNodeToServer")
                var newNode = new Object();
                that.utility.copyAttributes(newNode, that.rootVM.file.nodes[id]);
                that.nodesRef.child(id).set(newNode);
              });
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
// this.loadNodeDataById(this.file_id, this.root_id);
//# sourceMappingURL=data:application/json;base64,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QyxDQUFDLENBQUM7QUFDbEQsc0JBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDZCx3QkFBSSxNQUFNLEVBQUU7QUFDViwwQkFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUM7cUJBQ2pCLE1BQU07QUFDTCwwQkFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUM7cUJBQ2pCO21CQUNGO0FBQ0Qsc0JBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0Isc0JBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0M7O0FBRUQsb0JBQUksTUFBTSxFQUFFO0FBQ1Ysc0JBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQztpQkFDMUIsTUFBTTtBQUNMLHNCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7aUJBQzFCO0FBQ0Qsb0JBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2VBQ2pFOztBQUVELHFCQUFPLEtBQUssQ0FBQzthQUNkOzs7O0FBRUQsdUJBQWE7bUJBQUEsdUJBQUMsS0FBSyxFQUFFO0FBQ25CLG1CQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDeEIscUJBQU8sS0FBSyxDQUFDO2FBQ2Q7Ozs7QUFFRCxtQ0FBeUI7bUJBQUEsbUNBQUMsRUFBRSxFQUFFOzs7Ozs7Ozs7O0FBVTVCLGtCQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsa0JBQUksQ0FBQyxNQUFNLENBQUMsWUFBVzs7O0FBR3JCLG9CQUFJLE9BQU8sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQzNCLG9CQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDaEUsb0JBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztlQUN0QyxDQUFDLENBQUM7YUFDSjs7Ozs7O2VBdlJVLElBQUk7U0FBUyxJQUFJIiwiZmlsZSI6ImZsYXQuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==