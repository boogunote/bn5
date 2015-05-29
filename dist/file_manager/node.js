System.register(["firebase", "../common", "../utility"], function (_export) {
  var Common, Utility, _prototypeProperties, _classCallCheck, Node;

  return {
    setters: [function (_firebase) {}, function (_common) {
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
            },
            writable: true,
            configurable: true
          },
          newItemInDirectory: {
            value: function newItemInDirectory(newId) {

              this.rootVM.dirNodesRef.child(newId).set({
                id: newId
              });

              // this.node.children.push(newId);
              var children = [];
              for (var i = 0; this.node.children && i < this.node.children.length; i++) {
                children.push(this.node.children[i]);
              };
              children.push(newId);

              this.rootVM.dirNodesRef.child(this.node.id).child("children").set(children);
            },
            writable: true,
            configurable: true
          },
          newDirectory: {
            value: (function (_newDirectory) {
              var _newDirectoryWrapper = function newDirectory() {
                return _newDirectory.apply(this, arguments);
              };

              _newDirectoryWrapper.toString = function () {
                return _newDirectory.toString();
              };

              return _newDirectoryWrapper;
            })(function () {
              var newId = this.utility.getUniqueId();
              this.newItemInDirectory(newId);

              var newDirectory = this.utility.clone(this.common.new_directory);
              newDirectory.meta.id = newId;
              newDirectory.meta.create_time = Firebase.ServerValue.TIMESTAMP;
              this.rootVM.filesRef.child(newId).set(newDirectory);
            }),
            writable: true,
            configurable: true
          },
          newTree: {
            value: (function (_newTree) {
              var _newTreeWrapper = function newTree() {
                return _newTree.apply(this, arguments);
              };

              _newTreeWrapper.toString = function () {
                return _newTree.toString();
              };

              return _newTreeWrapper;
            })(function () {
              var newId = this.utility.getUniqueId();
              this.newItemInDirectory(newId);

              var newTree = this.utility.clone(this.common.new_tree_note_skeleton);
              newTree.meta.id = newId;
              newTree.meta.create_time = Firebase.ServerValue.TIMESTAMP;
              this.rootVM.filesRef.child(newId).set(newTree);
            }),
            writable: true,
            configurable: true
          },
          newFlat: {
            value: (function (_newFlat) {
              var _newFlatWrapper = function newFlat() {
                return _newFlat.apply(this, arguments);
              };

              _newFlatWrapper.toString = function () {
                return _newFlat.toString();
              };

              return _newFlatWrapper;
            })(function () {
              var newId = this.utility.getUniqueId();
              this.newItemInDirectory(newId);

              var newFlat = this.utility.clone(this.common.new_flat_note_skeleton);
              newFlat.meta.id = newId;
              newFlat.meta.create_time = Firebase.ServerValue.TIMESTAMP;
              this.rootVM.filesRef.child(newId).set(newFlat);
            }),
            writable: true,
            configurable: true
          },
          newMosaic: {
            value: (function (_newMosaic) {
              var _newMosaicWrapper = function newMosaic() {
                return _newMosaic.apply(this, arguments);
              };

              _newMosaicWrapper.toString = function () {
                return _newMosaic.toString();
              };

              return _newMosaicWrapper;
            })(function () {
              var newId = this.utility.getUniqueId();
              this.newItemInDirectory(newId);

              var newMosaic = this.utility.clone(this.common.new_mosaic_skeleton);
              newMosaic.meta.id = newId;
              newMosaic.meta.create_time = Firebase.ServerValue.TIMESTAMP;
              this.rootVM.filesRef.child(newId).set(newMosaic);
            }),
            writable: true,
            configurable: true
          },
          "delete": {
            value: function _delete() {
              if (!confirm("Delete?")) {
                return;
              } // remove sub-tree.
              var subTreeIdList = [];
              var that = this;
              function visit(vm) {
                if (!vm.node) {
                  return;
                }for (var i = 0; i < vm.childVMList.length; i++) {
                  visit(vm.childVMList[i]);
                };
                console.log(vm.node.id);
                that.rootVM.dirNodesRef.child(vm.node.id).remove();
                that.rootVM.filesRef.child(vm.node.id).remove();
              }
              visit(this);

              // remove from parent children list.
              var position = -1;
              for (var i = 0; i < this.parentVM.node.children.length; i++) {
                if (this.parentVM.node.children[i] == this.node.id) {
                  position = i;
                  break;
                }
              };
              if (-1 != position) {
                this.parentVM.node.children.splice(position, 1);
                var children = [];
                for (var i = 0; this.parentVM.node.children && i < this.parentVM.node.children.length; i++) {
                  children.push(this.parentVM.node.children[i]);
                };
                this.rootVM.dirNodesRef.child(this.parentVM.node.id).child("children").set(children);
              };
            },
            writable: true,
            configurable: true
          },
          rename: {
            value: function rename() {
              var name = prompt("Please enter name name", this.meta.name);
              if (null == name) {
                return;
              }this.meta.name = name;
              this.rootVM.filesRef.child(this.node.id).child("meta").child("name").set(name);
            },
            writable: true,
            configurable: true
          },
          getPositionToParent: {
            value: function getPositionToParent() {
              var position = null;
              for (var i = 0; i < this.parentVM.node.children.length; i++) {
                if (this.parentVM.node.children[i] == this.node.id) {
                  position = i;
                  break;
                }
              };

              return position;
            },
            writable: true,
            configurable: true
          },
          paste: {
            value: function paste() {
              if (this.rootVM.clipping) {
                for (var i = 0; i < this.rootVM.clippedVMList.length; i++) {
                  this.node.children.push(this.rootVM.clippedVMList[i].node.id);
                  var oldParentPosition = this.rootVM.clippedVMList[i].getPositionToParent();
                  this.rootVM.clippedVMList[i].parentVM.node.children.splice(oldParentPosition, 1);
                };

                var updateList = [this];
                for (var i = 0; i < this.rootVM.clippedVMList.length; i++) {
                  var alreadyHere = false;
                  for (var j = 0; j < updateList.length; j++) {
                    if (updateList[j].node.id == this.rootVM.clippedVMList[i].parentVM.node.id) {
                      alreadyHere = true;
                      break;
                    }
                  };

                  if (!alreadyHere) updateList.push(this.rootVM.clippedVMList[i].parentVM);
                };

                for (var i = 0; i < updateList.length; i++) {
                  var children = [];
                  for (var j = 0; j < updateList[i].node.children.length; j++) {
                    children.push(updateList[i].node.children[j]);
                  };
                  this.rootVM.dirNodesRef.child(updateList[i].node.id).child("children").set(children);
                };

                this.rootVM.clipping = false;
                this.rootVM.clippedVMList = [];
              };
            },
            writable: true,
            configurable: true
          }
        });

        return Node;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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