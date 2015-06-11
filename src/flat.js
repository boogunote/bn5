import {Utility} from './utility';
import {Common} from './common';
import {Node} from './node';
import 'jquery';
import autosize from 'jquery-autosize';
import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

export class Tree extends Node {
  static inject() { return [Common, Element, Utility]; }
  constructor(common, element, utility){
    super();
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

  activate(params, queryString, routeConfig) {
    console.log('activate');
    this.file_id = params.file_id;
    // this.root_id = params.root_id;
    this.rootRef = new Firebase(this.common.firebase_url);
    var authData = this.rootRef.getAuth();
    if (!authData) {
      console.log("Please login!")
      return;
    }

    this.user_id = params.user_id;
    this.fileRef = this.rootRef.child('/notes/users/' + this.utility.getRealUserId(this.user_id) +
      '/files/' + this.file_id);
    this.nodesRef = this.fileRef.child("nodes");

    // console.log("params")
    // console.log(params)
    if ('online' == params.type) {
      var ref = new Firebase(this.common.firebase_url);
      var authData = ref.getAuth();
      if (!authData) {
        console.log("Please login!")
        return;
      }
      var that = this;
      this.fileRef.once('value', function(dataSnapshot) {
        console.log("1111111111111dataSnapshot.val()")
        that.file = dataSnapshot.val()
        console.log(that.file);
        if (that.file) {
          that.node = that.file.nodes.root;
          that.file_id = that.file.meta.id;
          // that.routeConfig.navModel.title = that.file.meta.name;
          // that.routeConfig.title = that.file.meta.name;
          // that.routeConfig.name = that.file.meta.name;
          console.log(that.node)
          console.log(that.file_id)
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

  addShareId() {
    var shareIdElement = $(this.element).find("#share_dialog #share_id");
    var idString = shareIdElement.val();
    shareIdElement.val("")
    var id = parseInt(idString)
    if (isNaN(id) || id < 1) {
      alert("Please input friend id in numerica.")
      return;
    }
    
    var simpleloginIdString = this.utility.getRealUserId(id);
    var infoRef = this.rootRef.child('/info/users');
    var that = this;
    infoRef.child(simpleloginIdString+"/name").on("value", function(dataSnapshot) {
      var name = dataSnapshot.val();
      if (!name) {
        alert("Don't have this ID.")
        return;
      };
      that.fileRef.child("meta/share/"+simpleloginIdString).set({
        read: true,
        write: false
      })
    });
  }

  canActivate(params, queryString, routeConfig) {
    // this.routeConfig = routeConfig;
    // this.routeConfig.navModel.title = "wawaw";
    return true;
  }

  copy(node) {
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

  delete(node) {
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

  getShareList() {
    var infoRef = this.rootRef.child('/info/users');
    var that = this;
    this.fileRef.child("meta/share").on("value", function(dataSnapshot) {
      console.log(dataSnapshot.val());
      var simpleloginIdStringList = dataSnapshot.val();
      that.share_list = [];
      for (var simpleloginIdString in simpleloginIdStringList) {
        // simpleloginIdString = simpleloginIdString.trim();
        if (simpleloginIdStringList.hasOwnProperty(simpleloginIdString)) {
          var tokens = simpleloginIdString.split(":")
          var idString = tokens[tokens.length-1];
          that.share_list.push({
            id: idString,
            read: simpleloginIdStringList[simpleloginIdString].read,
            write: simpleloginIdStringList[simpleloginIdString].write,
          });

          infoRef.child(simpleloginIdString+"/name").on("value", function(dataSnapshot) {
            var name = dataSnapshot.val();

            var tokens = dataSnapshot.ref().parent().path.slice();
            var simpleloginIdString = tokens[tokens.length-1];
            simpleloginIdString = simpleloginIdString.trim();
            for (var i = 0; i < that.share_list.length; i++) {
              var tokens = simpleloginIdString.split(":")
              var idString = tokens[tokens.length-1];
              if (that.share_list[i].id == idString) {
                that.share_list[i].name = name;
              };
            };
          })
        }
      }

      console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
      console.log(that.share_list)
    })
  }

  infect(node) {
    if (node.content != "") return;
    if (node.children.length != 0) return;

    var clipboardData = localStorage.getItem("clipboardData");
    if (!clipboardData) return;
    var copiedSubTreeList = JSON.parse(clipboardData);

    if (copiedSubTreeList.length > 1) {
      alert("Only accepte one item!")
      return;
    };

    var ret = this.utility.treeToList(copiedSubTreeList[0].subTree);
    var new_node = null;
    for (var i = 0; i < ret.nodes.length; i++) {
      if (ret.nodes[i].id == ret.root_id) {
        new_node = ret.nodes[i]
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

  newFlatNode() {
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
      position: children.length-1,
      node_id: flatNode.id,
      subTree: flatNode
    };
    nodeRecordList.push(nodeRecord);
    this.record(nodeRecordList, "insert");
  }

  newTemporaryMosaic() {
    window.open(window.location.origin + "#mosaic");
  }

  onClick(event) {
    console.log(event);
    // event.bubbles = false;
    var that = this;
    var delta = 100;
    if (event.ctrlKey && !event.altKey) {
      var y = event.pageY - $(event.target).closest('.flat-mainwindow').position().top
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
          this.doEdit(function() {
            that.nodesRef.child(node.id+"/y").set(node.y);
          });
        }
      };

      if (expand) {
        this.node.height += delta;
      } else {
        this.node.height -= delta;
      }
      this.doEdit(function() {
        that.nodesRef.child(that.node.id+"/height").set(that.node.height);
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
        this.doEdit(function() {
          that.nodesRef.child(node.id+"/x").set(node.x);
        });
      }

      if (expand) {
        this.node.width += delta;
      } else {
        this.node.width -= delta;
      }
      this.doEdit(function() {
        that.nodesRef.child(that.node.id+"/width").set(that.node.width);
      });
    }

    return false;
  }

  onWindowClick(event) {
    event.stopPropagation();
    return false;
  }

  onWindowMouseDown(event) {
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

    var rootChildrenList = []
    for (var i = 0; i < this.file.nodes.root.children.length; i++) {
      if (typeof this.file.nodes[this.file.nodes.root.children[i]].zindex != 'number') {
        this.file.nodes[this.file.nodes.root.children[i]].zindex = 0;
      }
      rootChildrenList.push(this.file.nodes[this.file.nodes.root.children[i]])
    }

    rootChildrenList.sort(function(a, b) {
      return a.zindex - b.zindex;
    })

    for (var i = 0; i < rootChildrenList.length; i++) {
      rootChildrenList[i].zindex = i;
    };

    var maxZ = rootChildrenList[rootChildrenList.length-1].zindex;
    var target = $(event.target).closest('.flat-window');
    // console.log(target.id)
    this.file.nodes[$(target).attr('id')].zindex = maxZ +1;
    var that = this;
    this.doEdit(function() {
      for (var i = 0; i < rootChildrenList.length; i++) {
        that.nodesRef.child(rootChildrenList[i].id).child('zindex').set(rootChildrenList[i].zindex)
      };
    });

    return true;
  }

  popup() {
    window.open("#flat/online/"+ this.user_id + "/" + this.file_id+"/root")
  }

  removeShareId(index) {
    var id = this.share_list[index].id;
    this.fileRef.child("meta/share").child(this.utility.getRealUserId(id)).remove();
    return true;
  }

  removeAllShareId() {
    if (!confirm("Remove all?"))
      return;
    for (var i = 0; i < this.share_list.length; i++) {
      this.removeShareId(i);
    };
  }

  setPositionToRemoteServer(id) {
    // var element = $("#"+id);
    // console.log(element.left())
    // console.log(element.top())
    // console.log(element.width())
    // console.log(element.height())
    // var newNode = new Object();
    // this.utility.copyAttributes(newNode, this.file.nodes[id]);
    // console.log("2- "+element.position().left+" "+element.position().top+" "+element.width()+" "+element.height())
    
    var that = this;
    this.doEdit(function() {
      // console.log("3- "+element.position().left+" "+element.position().top+" "+element.width()+" "+element.height())
      // // console.log("setNodeToServer")
      var newNode = new Object();
      that.utility.copyAttributes(newNode, that.rootVM.file.nodes[id])
      that.nodesRef.child(id).set(newNode);
    });
  }

  showShareDialog() {
    $(this.element).find("#share_dialog").modal('show');
  }

  togglePomission(index, permission) {
    var item = this.share_list[index];
    if (!item.read && !item.write) {
      if (confirm('Do you want to remove "' + item.name + '"')) {
        this.removeShareId(index);
      } else {
        item[permission] = true;
      }
      return
    }

    var realId = this.utility.getRealUserId(item.id);

    this.fileRef.child("meta/share/"+realId+"/"+permission).set(item[permission])
  }

  toggleReadPomission(index) {
    this.togglePomission(index, "read")
    return true;
  }

  toggleWritePomission(index) {
    this.togglePomission(index, "write")
    return true;
  }
}