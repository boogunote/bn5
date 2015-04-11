import {Utility} from './utility';
import {Common} from './common';

export class Tree{
  static inject() { return [Common, Utility]; }
  constructor(common, utility){
    this.common = common;
    this.utility = utility;

    this.operationRecordList = [];
    this.operationRecordList.cursor = -1;

    this.file_id = null;
    this.root_id = null;
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
    this.root_id = params.root_id;
    this.rootRef = new Firebase(this.common.firebase_url);
    var authData = this.rootRef.getAuth();
    if (!authData) {
      console.log("Please login!")
      return;
    }
    this.fileRef = this.rootRef.child('/notes/users/' + authData.uid +
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
          that.root = that.file.nodes.root;
          that.file_id = that.file.meta.id;
          console.log(that.root)
          console.log(that.file_id)
          // that.loadNodeFromLocalCache(that.root_id);
          // that.loadTitle(that.root_id);
          setTimeout(function() {
            if (!that.root.children) that.root.children = [];
            for (var i = 0; i < that.root.children.length; i++) {
              that.initInteract(that.root.children[i]);
              that.setPosition(that.root.children[i]);
            };
          }, 10);
        }
      });

      // this.loadNodeDataById(this.file_id, this.root_id);
    }
  }

  delete(node) {
    this.removeSubTree(node)
    this.listTo
  }

  removeSubTree(node) {
    var position = this.utility.getChildrenPosition(this.root, node.id);
    this.root.children.splice(position, 1);
    var children = this.utility.getCleanChildren(this.root);
    var that = this;
    this.doEdit(function() {
      that.nodesRef.child("root/children").set(children);
      function visit(node) {
        that.nodesRef.child(node.id).remove();
        for (var i = 0; node.children && i < node.children.length; i++) {
          visit(node.children[i]);
        };
      }
      visit(node.id);
    });
  }

  doEdit(realEdit) {
    var that = this;
    var edit = function() {
      if (that.editing &&
          that.utility.now() - that.localChangedTime
          < that.localChangeWaitTime - that.localChangeWaitEpsilon) {
        setTimeout(edit, that.localChangeWaitTime);
        // console.log("setTimeout2")
      } else {
        realEdit();
        that.editing = false;
      }
    }
    this.localChangedTime = this.utility.now();
    if (!this.editing) {
      this.editing = true;
      setTimeout(edit, that.localChangeWaitTime);
      // console.log("setTimeout1")
    };
  }

  initInteract(id) {
    interact('#'+id)
      .allowFrom(".flat-titlebar")
      .draggable({
         onmove:   function dragMoveListener (event) {
            var target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
            target.style.transform =
              'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          }

          // this is used later in the resizing demo
          // window.dragMoveListener = dragMoveListener;
      })
      
    interact('#'+id+" .flat-body")
      .resizable({
          edges: { left: true, right: true, bottom: true, top: false }
        })
      .on('resizemove', function (event) {
        var target = event.target.parentElement,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + $('#'+id+' .flat-titlebar').height() + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        // target.textContent = event.rect.width + '×' + event.rect.height;
      });
  }

  newFlatNode() {
    var flatNode = this.utility.createNewFlatNode();
    this.nodesRef.child(flatNode.id).set(flatNode);
    var children = this.utility.getCleanChildren(this.root);
    this.file.nodes[flatNode.id] = flatNode
    this.root.children.push(flatNode.id);
    var that = this;
    setTimeout(function() {
      that.initInteract(flatNode.id);
    }, 0);

    this.doEdit(function() {
      // if (!this.root.children) this.root.children = [];
      children.push(flatNode.id);
      that.nodesRef.child("root/children").set(children);
    });
  }

  record(nodeDataList, operation) {
    var record = {};
    record.operation = operation;
    record.nodeList = nodeDataList;
    
    this.operationRecordList.splice(this.operationRecordList.cursor+1);
    this.operationRecordList.push(record);
    this.operationRecordList.cursor++;
  }

  setPosition(id) {
    // $("#"+id).css({left:this.file.nodes[id].x, top:this.file.nodes[id].y});//,
        // width:this.file.nodes[id].width, height:this.file.nodes[id].height})
  }

  undo() {
    if (this.operationRecordList.cursor < 0) return;
    var record = this.operationRecordList[this.operationRecordList.cursor];
    this.operationRecordList.cursor--;
    if ("insert" == record.operation) {
      for (var i = record.nodeList.length - 1; i >= 0; i--) {
        // this.uncollapsed(record.nodeList[i].positionArray);
        var r = record.nodeList[i];
        var nodeList = this.getNodeListByRootId(r.node_id);
        this.removeSubTree(r.parent_id, r.node_id);
        var that = this;
        this.doEdit(function() {
          that.setNodeChildrenToServer(that.file.nodes[r.parent_id]);
          console.log("setNodeChildrenToServer");
          console.log(that.file.nodes[r.parent_id])
          that.removeNodeListFromServer(nodeList)
          
          that.treeVM.setToRemoteTime = that.utility.now();
          
        });
        // this.doEdit(this.file.nodes[r.parent_id]);
        // this.removeNodeAt(record.nodeList[i].positionArray);
      }
    } else if ("remove" == record.operation) {
      for (var i = record.nodeList.length - 1; i >= 0 ; i--) {
        // this.uncollapsed(record.nodeList[i].positionArray);
        // this.insertNodeAt(record.nodeList[i].positionArray, record.nodeList[i].node);
        var r = record.nodeList[i];
        this.insertSubTree(r.parent_id, r.position, [], r.node_id);
        var nodeList = this.getNodeListByRootId(r.node_id);
        var that = this;
        this.doEdit(function() {
          that.setNodeListToServer(nodeList);
          that.setNodeChildrenToServer(that.file.nodes[r.parent_id]);
          console.log("setNodeChildrenToServer");
          console.log(that.file.nodes[r.parent_id])
          that.treeVM.setToRemoteTime = that.utility.now();
        });
        // this.doEdit(this.file.nodes[r.parent_id]);
      }
    }
  }
}