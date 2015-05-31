System.register(["firebase", "../common", "../utility"], function (_export) {
  var Common, Utility, _createClass, _classCallCheck, Node;

  return {
    setters: [function (_firebase) {}, function (_common) {
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
            }
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
            }
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
            })
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
            })
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
            })
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
            })
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
            }
          },
          rename: {
            value: function rename() {
              var name = prompt("Please enter name name", this.meta.name);
              if (null == name) {
                return;
              }this.meta.name = name;
              this.rootVM.filesRef.child(this.node.id).child("meta").child("name").set(name);
            }
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
            }
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
            }
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
//# sourceMappingURL=data:application/json;base64,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