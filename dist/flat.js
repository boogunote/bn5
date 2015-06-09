System.register(["./utility", "./common", "./node", "jquery", "jquery-autosize", "bootstrap", "bootstrap/css/bootstrap.css!"], function (_export) {
  var Utility, Common, Node, autosize, _createClass, _get, _inherits, _classCallCheck, Tree;

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

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Tree = _export("Tree", (function (_Node) {
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

        _inherits(Tree, _Node);

        _createClass(Tree, {
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
            }
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
            }
          },
          canActivate: {
            value: function canActivate(params, queryString, routeConfig) {
              // this.routeConfig = routeConfig;
              // this.routeConfig.navModel.title = "wawaw";
              return true;
            }
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
            }
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
            }
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
            }
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
            }
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
            }
          },
          newTemporaryMosaic: {
            value: function newTemporaryMosaic() {
              window.open(window.location.origin + "#mosaic");
            }
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
            }
          },
          onWindowClick: {
            value: function onWindowClick(event) {
              event.stopPropagation();
              return false;
            }
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
            }
          },
          popup: {
            value: function popup() {
              window.open("#flat/online/" + this.user_id + "/" + this.file_id + "/root");
            }
          },
          removeShareId: {
            value: function removeShareId(index) {
              var id = this.share_list[index].id;
              this.fileRef.child("meta/share").child(this.utility.getRealUserId(id)).remove();
              return true;
            }
          },
          removeAllShareId: {
            value: function removeAllShareId() {
              if (!confirm("Remove all?")) {
                return;
              }for (var i = 0; i < this.share_list.length; i++) {
                this.removeShareId(i);
              };
            }
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
            }
          },
          showShareDialog: {
            value: function showShareDialog() {
              $("#share_dialog").modal("show");
            }
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
            }
          },
          toggleReadPomission: {
            value: function toggleReadPomission(index) {
              this.togglePomission(index, "read");
              return true;
            }
          },
          toggleWritePomission: {
            value: function toggleWritePomission(index) {
              this.togglePomission(index, "write");
              return true;
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [Common, Utility];
            }
          }
        });

        return Tree;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUNoRSxvQkFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2VBQ3RDLENBQUMsQ0FBQzthQUNKOztBQUVELHlCQUFlO21CQUFBLDJCQUFHO0FBQ2hCLGVBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDbEM7O0FBRUQseUJBQWU7bUJBQUEseUJBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtBQUNqQyxrQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxrQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQzdCLG9CQUFJLE9BQU8sQ0FBQywwQkFBeUIsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUcsQ0FBQyxFQUFFO0FBQ3hELHNCQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMzQixNQUFNO0FBQ0wsc0JBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ3pCO0FBQ0QsdUJBQU07ZUFDUDs7QUFFRCxrQkFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVqRCxrQkFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFDLE1BQU0sR0FBQyxHQUFHLEdBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO2FBQzlFOztBQUVELDZCQUFtQjttQkFBQSw2QkFBQyxLQUFLLEVBQUU7QUFDekIsa0JBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ25DLHFCQUFPLElBQUksQ0FBQzthQUNiOztBQUVELDhCQUFvQjttQkFBQSw4QkFBQyxLQUFLLEVBQUU7QUFDMUIsa0JBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLHFCQUFPLElBQUksQ0FBQzthQUNiOzs7QUF6Zk0sZ0JBQU07bUJBQUEsa0JBQUc7QUFBRSxxQkFBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzthQUFFOzs7O2VBRGxDLElBQUk7U0FBUyxJQUFJIiwiZmlsZSI6ImZsYXQuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==