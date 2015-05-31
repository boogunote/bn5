System.register(["./utility", "./common", "./node", "jquery", "jquery-autosize"], function (_export) {
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
    }],
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
              var id = parseInt(idString);
              if (isNaN(id) || id < 1) {
                alert("Please input friend id in numerica.");
                return;
              }

              var realId = "simplelogin:" + id;

              this.fileRef.child("meta/share/" + realId).set("");
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
              var that = this;
              this.fileRef.child("meta/share").once("value", function (dataSnapshot) {
                console.log(dataSnapshot.val());
                var idList = dataSnapshot.val();
                that.share_list = [];
                for (var id in idList) {
                  if (idList.hasOwnProperty(id)) {
                    that.share_list.push({
                      id: id
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
//# sourceMappingURL=data:application/json;base64,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