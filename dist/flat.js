System.register(["./utility", "./common", "./node", "jquery", "jquery-autosize", "bootstrap", "bootstrap/css/bootstrap.css!"], function (_export) {
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
    }, function (_bootstrap) {}, function (_bootstrapCssBootstrapCss) {}],
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

              this.user_id = params.user_id;
              this.fileRef = this.rootRef.child("/notes/users/" + this.utility.getRealUserId(this.user_id) + "/files/" + this.file_id);
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

                this.getShareList();

                // this.nodesRef.child("root/children").on("value", function(dataSnapshot) {
                //   var children = dataSnapshot.val();
                //   for (var i = 0; i < children.length; i++) {
                //     if(that.file && !that.file.nodes[children[i]]) {
                //       var placeHolder = that.utility.createNewFlatNode();
                //       placeHolder.id = children[i];
                //       that.file.nodes[children[i]] = placeHolder;
                //     }
                //   };
                // })

                // this.loadNodeDataById(this.file_id, this.root_id);
              }
            },
            writable: true,
            configurable: true
          },
          addShareId: {
            value: function addShareId() {
              var shareIdElement = $("#share_dialog #share_id");
              var idString = shareIdElement.val();
              shareIdElement.val("");
              var id = parseInt(idString);
              if (isNaN(id) || id < 1) {
                alert("Please input friend id in numerica.");
                return;
              }

              var simpleloginIdString = this.utility.getRealUserId(id);
              var infoRef = this.rootRef.child("/info/users");
              var that = this;
              infoRef.child(simpleloginIdString + "/name").on("value", function (dataSnapshot) {
                var name = dataSnapshot.val();
                if (!name) {
                  alert("Don't have this ID.");
                  return;
                };
                that.fileRef.child("meta/share/" + simpleloginIdString).set({
                  read: true,
                  write: false
                });
              });
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
          copy: {
            value: function copy(node) {
              var copiedSubTreeList = [];
              var newSubTree = {
                file_id: this.file_id,
                subTree: this.utility.listToTree(this.rootVM.file.nodes, node.id),
                type: "tree_nodes"
              };
              copiedSubTreeList.push(newSubTree);

              delete localStorage.clipboardData;
              localStorage.clipboardData = undefined;
              localStorage.clipboardData = JSON.stringify(copiedSubTreeList);
              console.log(localStorage.clipboardData);
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
          getShareList: {
            value: function getShareList() {
              var infoRef = this.rootRef.child("/info/users");
              var that = this;
              this.fileRef.child("meta/share").on("value", function (dataSnapshot) {
                console.log(dataSnapshot.val());
                var simpleloginIdStringList = dataSnapshot.val();
                that.share_list = [];
                for (var simpleloginIdString in simpleloginIdStringList) {
                  // simpleloginIdString = simpleloginIdString.trim();
                  if (simpleloginIdStringList.hasOwnProperty(simpleloginIdString)) {
                    var tokens = simpleloginIdString.split(":");
                    var idString = tokens[tokens.length - 1];
                    that.share_list.push({
                      id: idString,
                      read: simpleloginIdStringList[simpleloginIdString].read,
                      write: simpleloginIdStringList[simpleloginIdString].write });

                    infoRef.child(simpleloginIdString + "/name").on("value", function (dataSnapshot) {
                      var name = dataSnapshot.val();

                      var tokens = dataSnapshot.ref().parent().path.slice();
                      var simpleloginIdString = tokens[tokens.length - 1];
                      simpleloginIdString = simpleloginIdString.trim();
                      for (var i = 0; i < that.share_list.length; i++) {
                        var tokens = simpleloginIdString.split(":");
                        var idString = tokens[tokens.length - 1];
                        if (that.share_list[i].id == idString) {
                          that.share_list[i].name = name;
                        };
                      };
                    });
                  }
                }

                console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
                console.log(that.share_list);
              });
            },
            writable: true,
            configurable: true
          },
          infect: {
            value: function infect(node) {
              if (node.content != "") {
                return;
              }if (node.children.length != 0) {
                return;
              }var clipboardData = localStorage.getItem("clipboardData");
              if (!clipboardData) {
                return;
              }var copiedSubTreeList = JSON.parse(clipboardData);

              if (copiedSubTreeList.length > 1) {
                alert("Only accepte one item!");
                return;
              };

              var ret = this.utility.treeToList(copiedSubTreeList[0].subTree);
              var new_node = null;
              for (var i = 0; i < ret.nodes.length; i++) {
                if (ret.nodes[i].id == ret.root_id) {
                  new_node = ret.nodes[i];
                  break;
                }
              };

              new_node.x = node.x;
              new_node.y = node.y;
              new_node.width = node.width;
              new_node.height = node.height;
              new_node.zindex = node.zindex;

              this.rootVM.insertSubTree(this.root_id, 0, ret.nodes, ret.root_id);
              this.removeSubTree(this.file.nodes.root.id, node.id);
              // // node.children = source_node.children

              // console.log(node.content)
              // console.log(source_node)
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
              flatNode.zindex = 9999;
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
              console.log(event);
              // event.bubbles = false;
              var that = this;
              var delta = 100;
              if (event.ctrlKey && !event.altKey) {
                var y = event.pageY - $(event.target).closest(".flat-mainwindow").position().top;
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
                    this.doEdit(function () {
                      that.nodesRef.child(node.id + "/y").set(node.y);
                    });
                  }
                };

                if (expand) {
                  this.node.height += delta;
                } else {
                  this.node.height -= delta;
                }
                this.doEdit(function () {
                  that.nodesRef.child(that.node.id + "/height").set(that.node.height);
                });
              } else if (event.ctrlKey && event.altKey) {
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
                  this.doEdit(function () {
                    that.nodesRef.child(node.id + "/x").set(node.x);
                  });
                }

                if (expand) {
                  this.node.width += delta;
                } else {
                  this.node.width -= delta;
                }
                this.doEdit(function () {
                  that.nodesRef.child(that.node.id + "/width").set(that.node.width);
                });
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
          onWindowMouseDown: {
            value: function onWindowMouseDown(event) {
              // var windows = $("#"+this.file_id+" .flat-window")
              // for (var i = 0; i < windows.length; i++) {
              //   if ($(windows[i]).css('z-index') == 'auto' ||
              //       $(windows[i]).css('z-index') == '') {
              //     $(windows[i]).css('z-index', 0)
              //   }
              // };
              // windows.sort(function(a, b){
              //   return parseInt($(a).css("z-index")) - parseInt($(b).css('z-index'))
              // });
              // for (var i = 0; i < windows.length; i++) {
              //   $(windows[i]).css('z-index', i);
              // };
              // var maxZ = parseInt($(windows[windows.length-1]).css('z-index'));
              // var targetWindow = $(event.target).closest('.flat-window');
              // targetWindow.css('z-index', maxZ+1)
              // return true;

              var rootChildrenList = [];
              for (var i = 0; i < this.file.nodes.root.children.length; i++) {
                if (typeof this.file.nodes[this.file.nodes.root.children[i]].zindex != "number") {
                  this.file.nodes[this.file.nodes.root.children[i]].zindex = 0;
                }
                rootChildrenList.push(this.file.nodes[this.file.nodes.root.children[i]]);
              }

              rootChildrenList.sort(function (a, b) {
                return a.zindex - b.zindex;
              });

              for (var i = 0; i < rootChildrenList.length; i++) {
                rootChildrenList[i].zindex = i;
              };

              var maxZ = rootChildrenList[rootChildrenList.length - 1].zindex;
              var target = $(event.target).closest(".flat-window");
              // console.log(target.id)
              this.file.nodes[$(target).attr("id")].zindex = maxZ + 1;
              var that = this;
              this.doEdit(function () {
                for (var i = 0; i < rootChildrenList.length; i++) {
                  that.nodesRef.child(rootChildrenList[i].id).child("zindex").set(rootChildrenList[i].zindex);
                };
              });

              return true;
            },
            writable: true,
            configurable: true
          },
          popup: {
            value: function popup() {
              window.open("#flat/online/" + this.user_id + "/" + this.file_id + "/root");
            },
            writable: true,
            configurable: true
          },
          removeShareId: {
            value: function removeShareId(index) {
              var id = this.share_list[index].id;
              this.fileRef.child("meta/share").child(this.utility.getRealUserId(id)).remove();
              return true;
            },
            writable: true,
            configurable: true
          },
          removeAllShareId: {
            value: function removeAllShareId() {
              if (!confirm("Remove all?")) {
                return;
              }for (var i = 0; i < this.share_list.length; i++) {
                this.removeShareId(i);
              };
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
          },
          showShareDialog: {
            value: function showShareDialog() {
              $("#share_dialog").modal("show");
            },
            writable: true,
            configurable: true
          },
          togglePomission: {
            value: function togglePomission(index, permission) {
              var item = this.share_list[index];
              if (!item.read && !item.write) {
                if (confirm("Do you want to remove \"" + item.name + "\"")) {
                  this.removeShareId(index);
                } else {
                  item[permission] = true;
                }
                return;
              }

              var realId = this.utility.getRealUserId(item.id);

              this.fileRef.child("meta/share/" + realId + "/" + permission).set(item[permission]);
            },
            writable: true,
            configurable: true
          },
          toggleReadPomission: {
            value: function toggleReadPomission(index) {
              this.togglePomission(index, "read");
              return true;
            },
            writable: true,
            configurable: true
          },
          toggleWritePomission: {
            value: function toggleWritePomission(index) {
              this.togglePomission(index, "write");
              return true;
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
//# sourceMappingURL=data:application/json;base64,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QUcsSUFBSSxDQUFDO0FBQ2hCLGtCQUFJLENBQUMsTUFBTSxDQUFDLFlBQVc7OztBQUdyQixvQkFBSSxPQUFPLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUMzQixvQkFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ2hFLG9CQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7ZUFDdEMsQ0FBQyxDQUFDO2FBQ0o7Ozs7QUFFRCx5QkFBZTttQkFBQSwyQkFBRztBQUNoQixlQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2xDOzs7O0FBRUQseUJBQWU7bUJBQUEseUJBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtBQUNqQyxrQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxrQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQzdCLG9CQUFJLE9BQU8sQ0FBQywwQkFBeUIsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUcsQ0FBQyxFQUFFO0FBQ3hELHNCQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMzQixNQUFNO0FBQ0wsc0JBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ3pCO0FBQ0QsdUJBQU07ZUFDUDs7QUFFRCxrQkFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVqRCxrQkFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFDLE1BQU0sR0FBQyxHQUFHLEdBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO2FBQzlFOzs7O0FBRUQsNkJBQW1CO21CQUFBLDZCQUFDLEtBQUssRUFBRTtBQUN6QixrQkFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDbkMscUJBQU8sSUFBSSxDQUFDO2FBQ2I7Ozs7QUFFRCw4QkFBb0I7bUJBQUEsOEJBQUMsS0FBSyxFQUFFO0FBQzFCLGtCQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUNwQyxxQkFBTyxJQUFJLENBQUM7YUFDYjs7Ozs7O2VBMWZVLElBQUk7U0FBUyxJQUFJIiwiZmlsZSI6ImZsYXQuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==