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
        function Tree(common, element, utility) {
          _classCallCheck(this, Tree);

          _get(Object.getPrototypeOf(Tree.prototype), "constructor", this).call(this);
          this.common = common;
          this.utility = utility;
          this.element = element;

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
              return [Common, Element, Utility];
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
              var shareIdElement = $(this.element).find("#share_dialog #share_id");
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
              $(this.element).find("#share_dialog").modal("show");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsYXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtNQUFRLE9BQU8sRUFDUCxNQUFNLEVBQ04sSUFBSSxFQUVMLFFBQVEsMERBSUYsSUFBSTs7OztBQVJULGFBQU8sWUFBUCxPQUFPOztBQUNQLFlBQU0sV0FBTixNQUFNOztBQUNOLFVBQUksU0FBSixJQUFJOztBQUVMLGNBQVE7Ozs7Ozs7Ozs7Ozs7QUFJRixVQUFJLDhCQUFTLElBQUk7QUFFakIsaUJBRkEsSUFBSSxDQUVILE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTztnQ0FGekIsSUFBSTs7QUFHYixxQ0FIUyxJQUFJLDZDQUdMO0FBQ1IsY0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsY0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsY0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRXZCLGNBQUksQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7QUFDOUIsY0FBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFckMsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsY0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsY0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsY0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsY0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsY0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7O0FBRXJCLGNBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVyQixjQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUNyQixjQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN0QixjQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLGNBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLGNBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7QUFDM0IsY0FBSSxDQUFDLG1CQUFtQixHQUFHLEdBQUcsQ0FBQztBQUMvQixjQUFJLENBQUMsc0JBQXNCLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLGNBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7QUFDakMsY0FBSSxDQUFDLHVCQUF1QixHQUFHLEVBQUUsQ0FBQztTQUNuQzs7a0JBOUJVLElBQUksRUFBUyxJQUFJOzs2QkFBakIsSUFBSTtBQUNSLGdCQUFNO21CQUFBLGtCQUFHO0FBQUUscUJBQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQUU7Ozs7O0FBK0J0RCxrQkFBUTttQkFBQSxrQkFBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRTtBQUN6QyxxQkFBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4QixrQkFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDOztBQUU5QixrQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RELGtCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3RDLGtCQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsdUJBQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUE7QUFDNUIsdUJBQU87ZUFDUjs7QUFFRCxrQkFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQzlCLGtCQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQzFGLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDNUIsa0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Ozs7QUFJNUMsa0JBQUksUUFBUSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDM0Isb0JBQUksR0FBRyxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDakQsb0JBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM3QixvQkFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLHlCQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQzVCLHlCQUFPO2lCQUNSO0FBQ0Qsb0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixvQkFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVMsWUFBWSxFQUFFO0FBQ2hELHlCQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7QUFDOUMsc0JBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQzlCLHlCQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QixzQkFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2Isd0JBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ2pDLHdCQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzs7OztBQUlqQywyQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdEIsMkJBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3pCLHdCQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRWxDLHdCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOzs7Ozs7O0FBQUEsbUJBT2xEO2lCQUNGLENBQUMsQ0FBQzs7QUFFSCxvQkFBSSxDQUFDLFlBQVksRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7OztlQWNyQjthQUNGOzs7O0FBRUQsb0JBQVU7bUJBQUEsc0JBQUc7QUFDWCxrQkFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNyRSxrQkFBSSxRQUFRLEdBQUcsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3BDLDRCQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3RCLGtCQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0Isa0JBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDdkIscUJBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO0FBQzVDLHVCQUFPO2VBQ1I7O0FBRUQsa0JBQUksbUJBQW1CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekQsa0JBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2hELGtCQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIscUJBQU8sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEdBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFTLFlBQVksRUFBRTtBQUM1RSxvQkFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzlCLG9CQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1QsdUJBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBQzVCLHlCQUFPO2lCQUNSLENBQUM7QUFDRixvQkFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFDLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ3hELHNCQUFJLEVBQUUsSUFBSTtBQUNWLHVCQUFLLEVBQUUsS0FBSztpQkFDYixDQUFDLENBQUE7ZUFDSCxDQUFDLENBQUM7YUFDSjs7OztBQUVELHFCQUFXO21CQUFBLHFCQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFOzs7QUFHNUMscUJBQU8sSUFBSSxDQUFDO2FBQ2I7Ozs7QUFFRCxjQUFJO21CQUFBLGNBQUMsSUFBSSxFQUFFO0FBQ1Qsa0JBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzNCLGtCQUFJLFVBQVUsR0FBRztBQUNmLHVCQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDckIsdUJBQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNqRSxvQkFBSSxFQUFFLFlBQVk7ZUFDbkIsQ0FBQztBQUNGLCtCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFbkMscUJBQU8sWUFBWSxDQUFDLGFBQWEsQ0FBQztBQUNsQywwQkFBWSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUM7QUFDdkMsMEJBQVksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQy9ELHFCQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUN6Qzs7Ozs7bUJBRUssaUJBQUMsSUFBSSxFQUFFO0FBQ1gsa0JBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztBQUN4QixrQkFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RSxrQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNwRSxrQkFBSSxVQUFVLEdBQUc7QUFDZix5QkFBUyxFQUFFLElBQUksQ0FBQyxPQUFPO0FBQ3ZCLHdCQUFRLEVBQUUsUUFBUTtBQUNsQix1QkFBTyxFQUFFLE9BQU87ZUFDakIsQ0FBQztBQUNGLDRCQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hDLGtCQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDOUM7Ozs7QUFFRCxzQkFBWTttQkFBQSx3QkFBRztBQUNiLGtCQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNoRCxrQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGtCQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVMsWUFBWSxFQUFFO0FBQ2xFLHVCQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLG9CQUFJLHVCQUF1QixHQUFHLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNqRCxvQkFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDckIscUJBQUssSUFBSSxtQkFBbUIsSUFBSSx1QkFBdUIsRUFBRTs7QUFFdkQsc0JBQUksdUJBQXVCLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLEVBQUU7QUFDL0Qsd0JBQUksTUFBTSxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUMzQyx3QkFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkMsd0JBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQ25CLHdCQUFFLEVBQUUsUUFBUTtBQUNaLDBCQUFJLEVBQUUsdUJBQXVCLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJO0FBQ3ZELDJCQUFLLEVBQUUsdUJBQXVCLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxLQUFLLEVBQzFELENBQUMsQ0FBQzs7QUFFSCwyQkFBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsR0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVMsWUFBWSxFQUFFO0FBQzVFLDBCQUFJLElBQUksR0FBRyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRTlCLDBCQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3RELDBCQUFJLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xELHlDQUFtQixHQUFHLG1CQUFtQixDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pELDJCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDL0MsNEJBQUksTUFBTSxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUMzQyw0QkFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkMsNEJBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksUUFBUSxFQUFFO0FBQ3JDLDhCQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7eUJBQ2hDLENBQUM7dUJBQ0gsQ0FBQztxQkFDSCxDQUFDLENBQUE7bUJBQ0g7aUJBQ0Y7O0FBRUQsdUJBQU8sQ0FBQyxHQUFHLENBQUMsMERBQTBELENBQUMsQ0FBQTtBQUN2RSx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7ZUFDN0IsQ0FBQyxDQUFBO2FBQ0g7Ozs7QUFFRCxnQkFBTTttQkFBQSxnQkFBQyxJQUFJLEVBQUU7QUFDWCxrQkFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUU7QUFBRSx1QkFBTztlQUFBLEFBQy9CLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQztBQUFFLHVCQUFPO2VBQUEsQUFFdEMsSUFBSSxhQUFhLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMxRCxrQkFBSSxDQUFDLGFBQWE7QUFBRSx1QkFBTztlQUFBLEFBQzNCLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFbEQsa0JBQUksaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNoQyxxQkFBSyxDQUFDLHdCQUF3QixDQUFDLENBQUE7QUFDL0IsdUJBQU87ZUFDUixDQUFDOztBQUVGLGtCQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNoRSxrQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLG1CQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekMsb0JBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtBQUNsQywwQkFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdkIsd0JBQU07aUJBQ1A7ZUFDRixDQUFDOztBQUVGLHNCQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDcEIsc0JBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNwQixzQkFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzVCLHNCQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDOUIsc0JBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFOUIsa0JBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ25FLGtCQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzs7OzthQUt0RDs7OztBQTBDRCxxQkFBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O21CQUFBLHVCQUFHO0FBQ1osa0JBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUNoRCxzQkFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDdkIsa0JBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0Msa0JBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hELGtCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQ3hDLGtCQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7QUFNckMsc0JBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLGtCQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7Ozs7OztBQVNuRCxrQkFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLGtCQUFJLFVBQVUsR0FBRztBQUNmLHlCQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDdkIsd0JBQVEsRUFBRSxRQUFRLENBQUMsTUFBTSxHQUFDLENBQUM7QUFDM0IsdUJBQU8sRUFBRSxRQUFRLENBQUMsRUFBRTtBQUNwQix1QkFBTyxFQUFFLFFBQVE7ZUFDbEIsQ0FBQztBQUNGLDRCQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hDLGtCQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN2Qzs7OztBQUVELDRCQUFrQjttQkFBQSw4QkFBRztBQUNuQixvQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQzthQUNqRDs7OztBQUVELGlCQUFPO21CQUFBLGlCQUFDLEtBQUssRUFBRTtBQUNiLHFCQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVuQixrQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGtCQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDaEIsa0JBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDbEMsb0JBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUE7QUFDaEYsb0JBQUksTUFBTSxHQUFHLElBQUksQ0FBQztBQUNsQixvQkFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDbkIsd0JBQU0sR0FBRyxJQUFJLENBQUM7aUJBQ2YsTUFBTTtBQUNMLHdCQUFNLEdBQUcsS0FBSyxDQUFDO2lCQUNoQjs7QUFFRCxxQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNsRCxzQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRCxzQkFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNkLHdCQUFJLE1BQU0sRUFBRTtBQUNWLDBCQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQztxQkFDakIsTUFBTTtBQUNMLDBCQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQztxQkFDakI7O0FBRUQsd0JBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0Isd0JBQUksQ0FBQyxNQUFNLENBQUMsWUFBVztBQUNyQiwwQkFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMvQyxDQUFDLENBQUM7bUJBQ0o7aUJBQ0YsQ0FBQzs7QUFFRixvQkFBSSxNQUFNLEVBQUU7QUFDVixzQkFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDO2lCQUMzQixNQUFNO0FBQ0wsc0JBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztpQkFDM0I7QUFDRCxvQkFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFXO0FBQ3JCLHNCQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDbkUsQ0FBQyxDQUFDO2VBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUN4QyxvQkFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUNwQixvQkFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLG9CQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUNuQix3QkFBTSxHQUFHLElBQUksQ0FBQztpQkFDZixNQUFNO0FBQ0wsd0JBQU0sR0FBRyxLQUFLLENBQUM7aUJBQ2hCOztBQUVELHFCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xELHNCQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xELHNCQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2Qsd0JBQUksTUFBTSxFQUFFO0FBQ1YsMEJBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDO3FCQUNqQixNQUFNO0FBQ0wsMEJBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDO3FCQUNqQjttQkFDRjtBQUNELHNCQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLHNCQUFJLENBQUMsTUFBTSxDQUFDLFlBQVc7QUFDckIsd0JBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzttQkFDL0MsQ0FBQyxDQUFDO2lCQUNKOztBQUVELG9CQUFJLE1BQU0sRUFBRTtBQUNWLHNCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7aUJBQzFCLE1BQU07QUFDTCxzQkFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDO2lCQUMxQjtBQUNELG9CQUFJLENBQUMsTUFBTSxDQUFDLFlBQVc7QUFDckIsc0JBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNqRSxDQUFDLENBQUM7ZUFDSjs7QUFFRCxxQkFBTyxLQUFLLENBQUM7YUFDZDs7OztBQUVELHVCQUFhO21CQUFBLHVCQUFDLEtBQUssRUFBRTtBQUNuQixtQkFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3hCLHFCQUFPLEtBQUssQ0FBQzthQUNkOzs7O0FBRUQsMkJBQWlCO21CQUFBLDJCQUFDLEtBQUssRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CdkIsa0JBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLG1CQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0Qsb0JBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLFFBQVEsRUFBRTtBQUMvRSxzQkFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7aUJBQzlEO0FBQ0QsZ0NBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2VBQ3pFOztBQUVELDhCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkMsdUJBQU8sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO2VBQzVCLENBQUMsQ0FBQTs7QUFFRixtQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNoRCxnQ0FBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2VBQ2hDLENBQUM7O0FBRUYsa0JBQUksSUFBSSxHQUFHLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDOUQsa0JBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUVyRCxrQkFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUUsQ0FBQyxDQUFDO0FBQ3ZELGtCQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsa0JBQUksQ0FBQyxNQUFNLENBQUMsWUFBVztBQUNyQixxQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNoRCxzQkFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtpQkFDNUYsQ0FBQztlQUNILENBQUMsQ0FBQzs7QUFFSCxxQkFBTyxJQUFJLENBQUM7YUFDYjs7OztBQUVELGVBQUs7bUJBQUEsaUJBQUc7QUFDTixvQkFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBQyxPQUFPLENBQUMsQ0FBQTthQUN4RTs7OztBQUVELHVCQUFhO21CQUFBLHVCQUFDLEtBQUssRUFBRTtBQUNuQixrQkFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDbkMsa0JBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2hGLHFCQUFPLElBQUksQ0FBQzthQUNiOzs7O0FBRUQsMEJBQWdCO21CQUFBLDRCQUFHO0FBQ2pCLGtCQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztBQUN6Qix1QkFBTztlQUFBLEFBQ1QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQy9DLG9CQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO2VBQ3ZCLENBQUM7YUFDSDs7OztBQUVELG1DQUF5QjttQkFBQSxtQ0FBQyxFQUFFLEVBQUU7Ozs7Ozs7Ozs7QUFVNUIsa0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixrQkFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFXOzs7QUFHckIsb0JBQUksT0FBTyxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7QUFDM0Isb0JBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUNoRSxvQkFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2VBQ3RDLENBQUMsQ0FBQzthQUNKOzs7O0FBRUQseUJBQWU7bUJBQUEsMkJBQUc7QUFDaEIsZUFBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3JEOzs7O0FBRUQseUJBQWU7bUJBQUEseUJBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtBQUNqQyxrQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxrQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQzdCLG9CQUFJLE9BQU8sQ0FBQywwQkFBeUIsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUcsQ0FBQyxFQUFFO0FBQ3hELHNCQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMzQixNQUFNO0FBQ0wsc0JBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ3pCO0FBQ0QsdUJBQU07ZUFDUDs7QUFFRCxrQkFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVqRCxrQkFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFDLE1BQU0sR0FBQyxHQUFHLEdBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO2FBQzlFOzs7O0FBRUQsNkJBQW1CO21CQUFBLDZCQUFDLEtBQUssRUFBRTtBQUN6QixrQkFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDbkMscUJBQU8sSUFBSSxDQUFDO2FBQ2I7Ozs7QUFFRCw4QkFBb0I7bUJBQUEsOEJBQUMsS0FBSyxFQUFFO0FBQzFCLGtCQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUNwQyxxQkFBTyxJQUFJLENBQUM7YUFDYjs7Ozs7O2VBM2ZVLElBQUk7U0FBUyxJQUFJIiwiZmlsZSI6ImZsYXQuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==