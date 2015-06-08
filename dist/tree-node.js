System.register(["aurelia-framework", "./common", "./data-source", "./node", "./utility", "jquery-autosize"], function (_export) {
  var Behavior, Common, DataSource, Node, Utility, autosize, _prototypeProperties, _get, _inherits, _classCallCheck, TreeNode;

  return {
    setters: [function (_aureliaFramework) {
      Behavior = _aureliaFramework.Behavior;
    }, function (_common) {
      Common = _common.Common;
    }, function (_dataSource) {
      DataSource = _dataSource.DataSource;
    }, function (_node) {
      Node = _node.Node;
    }, function (_utility) {
      Utility = _utility.Utility;
    }, function (_jqueryAutosize) {
      autosize = _jqueryAutosize["default"];
    }],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      TreeNode = _export("TreeNode", (function (Node) {
        function TreeNode(common, element, dataSource, utility) {
          _classCallCheck(this, TreeNode);

          _get(Object.getPrototypeOf(TreeNode.prototype), "constructor", this).call(this);
          this.common = common;
          this.selected = false;
          this.element = element;
          // console.log(element)
          this.dataSource = dataSource;
          this.utility = utility;
          this.ta = null;
        }

        _inherits(TreeNode, Node);

        _prototypeProperties(TreeNode, {
          inject: {
            value: function inject() {
              return [Common, Element, DataSource, Utility];
            },
            writable: true,
            configurable: true
          }
        }, {
          activate: {
            value: function activate(model) {
              // console.log("TreeNode activate");
              // console.log(model.node_id)
              // this.node = model.node;
              this.parentVM = model.parentVM;
              this.rootVM = model.parentVM.rootVM;
              this.parentVM.addChildVM(this, model.node_id);
              this.loadNode(model.node_id, false);
              // this.loadNodeDataById(this.rootVM.file_id, model.node_id);
            },
            writable: true,
            configurable: true
          },
          foldNode: {
            value: function foldNode() {
              if (this.node && !this.node.fold) {
                // console.log("autosize-----------------------------------------------------")
                autosize(this.ta);
              } else {
                var evt = document.createEvent("Event");
                evt.initEvent("autosize.destroy", true, false);
                this.ta.dispatchEvent(evt);
                this.ta.style.height = "24px"; //this.ta.scrollHeight;
              }
            },
            writable: true,
            configurable: true
          },
          attached: {
            value: function attached() {
              // console.log("attached!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
              // this.ta = this.element.children[0].children[1];
              if (this.element.children[0].children[1]) this.ta = this.element.children[0].children[1];
              if (this.ta && this.node) this.foldNode();
            },
            writable: true,
            configurable: true
          },
          deactivate: {
            value: function deactivate() {
              console.log("deactivate");
            },
            writable: true,
            configurable: true
          },
          detached: {
            value: function detached() {
              // console.log("detached: "+this.node.content+" "+this.node.id);
              this.removeObserver(this.node.id);
              this.parentVM.removeChildVM(this);
            },
            writable: true,
            configurable: true
          },
          fold: {
            value: function fold() {
              this.node.fold = !this.node.fold;
              this.foldNode(this.node.fold);
              this.setNodeToServer(this.node.id);
            },
            writable: true,
            configurable: true
          },
          stepIcon: {
            value: function stepIcon(direction) {
              if (direction) this.node.icon++;else this.node.icon--;
              if (this.node.icon > 7) this.node.icon = 0;
              if (this.node.icon < 0) this.node.icon = 7;
              this.setNodeToServer(this.node.id);
            },
            writable: true,
            configurable: true
          },
          toggle: {
            value: function toggle() {
              // console.log("toggle")
              this.node.collapsed = !this.node.collapsed;
              this.setNodeToServer(this.node.id);
            },
            writable: true,
            configurable: true
          },
          getPositionArray: {
            value: function getPositionArray() {
              var positionArray = [];
              var vm = this;
              while (vm.parentVM) {
                for (var i = 0; i < vm.parentVM.node.children.length; i++) {
                  if (vm.parentVM.node.children[i].id == vm.node.id) {
                    positionArray.unshift(i);
                    break;
                  }
                };
                vm = vm.parentVM;
              }
              return positionArray;
            },
            writable: true,
            configurable: true
          },
          onBlur: {
            value: function onBlur(event) {
              this.rootVM.focusedVM = null;
            },
            writable: true,
            configurable: true
          },
          onClick: {
            value: function onClick(event) {
              if (event.ctrlKey) {
                this.select(!this.selected);
                return true;
              }
            },
            writable: true,
            configurable: true
          },
          onFocus: {
            value: function onFocus(event) {
              this.rootVM.focusedVM = this;
            },
            writable: true,
            configurable: true
          },
          onKeyDown: {
            value: function onKeyDown(event) {
              if (event.ctrlKey && 192 == event.keyCode) {
                this.openSubTreeInNewWindow(this.node.id);
                return false;
              }

              return true;
            },
            writable: true,
            configurable: true
          },
          onKeyUp: {
            value: function onKeyUp(event) {
              var keyList = [{ start: 9, end: 9 }, { start: 16, end: 27 }, { start: 33, end: 40 }, { start: 144, end: 145 }];
              var combindKeyList = [{ key: 13, alt: true, ctrl: false, shift: false }, { key: 13, alt: false, ctrl: true, shift: false }, { key: 13, alt: false, ctrl: false, shift: true }, { key: 46, alt: false, ctrl: true, shift: false }, { key: 27, alt: false, ctrl: false, shift: false }, { key: 67, alt: false, ctrl: true, shift: true }, { key: 88, alt: false, ctrl: true, shift: true }, { key: 86, alt: false, ctrl: true, shift: true }, { key: 83, alt: false, ctrl: true, shift: false }, { key: 70, alt: true, ctrl: false, shift: false }, { key: 90, alt: false, ctrl: true, shift: true }, { key: 89, alt: false, ctrl: true, shift: true }, { key: 187, alt: true, ctrl: false, shift: false }, { key: 189, alt: true, ctrl: false, shift: false }];

              var needUpdate = true;
              for (var i = 0; i < keyList.length; i++) {
                if (event.keyCode >= keyList[i].start && event.keyCode <= keyList[i].end) {
                  needUpdate = false;
                  break;
                }
              };

              if (needUpdate) {
                for (var i = 0; i < combindKeyList.length; i++) {
                  if (event.keyCode == combindKeyList[i].key && event.altKey == combindKeyList[i].alt && event.ctrlKey == combindKeyList[i].ctrl && event.shiftKey == combindKeyList[i].shift) {
                    needUpdate = false;
                    break;
                  }
                };
              }

              if (needUpdate) {
                this.setNodeToServer(this.node.id);
              };

              return true;
            },
            writable: true,
            configurable: true
          },
          resize: {
            value: function resize() {
              if (!this.ta) {
                return;
              } // console.log("resize")
              var evt = document.createEvent("Event");
              evt.initEvent("autosize.update", true, false);
              this.ta.dispatchEvent(evt);
              this.ta.style.height = this.ta.scrollHeight;
            },
            writable: true,
            configurable: true
          },
          select: {
            value: function select(selected) {
              this.selected = selected;
              for (var i = 0; i < this.childVMList.length; i++) {
                this.childVMList[i].select(selected);
              };
            },
            writable: true,
            configurable: true
          }
        });

        return TreeNode;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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RUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxJQUFJLEVBQUMsRUFDMUMsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsSUFBSSxFQUFDLEVBQzFDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLElBQUksRUFBQyxFQUMxQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFDM0MsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsS0FBSyxFQUFDLEVBQzNDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLElBQUksRUFBQyxFQUMxQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxJQUFJLEVBQUMsRUFDMUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsS0FBSyxFQUFDLEVBQzVDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEtBQUssRUFBQyxDQUM3QyxDQUFBOztBQUVELGtCQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdEIsbUJBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZDLG9CQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUM7QUFDdEUsNEJBQVUsR0FBRyxLQUFLLENBQUM7QUFDbkIsd0JBQU07aUJBQ1A7ZUFDRixDQUFDOztBQUVGLGtCQUFJLFVBQVUsRUFBRTtBQUNkLHFCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM5QyxzQkFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQ3RDLEtBQUssQ0FBQyxNQUFNLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFDckMsS0FBSyxDQUFDLE9BQU8sSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUN2QyxLQUFLLENBQUMsUUFBUSxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUU7QUFDN0MsOEJBQVUsR0FBRyxLQUFLLENBQUM7QUFDbkIsMEJBQU07bUJBQ1A7aUJBQ0YsQ0FBQztlQUNIOztBQUVELGtCQUFJLFVBQVUsRUFBRTtBQUNkLG9CQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7ZUFDcEMsQ0FBQzs7QUFFRixxQkFBTyxJQUFJLENBQUM7YUFDYjs7OztBQUVELGdCQUFNO21CQUFBLGtCQUFHO0FBQ1Asa0JBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUFFLHVCQUFPO2VBQUE7QUFFckIsa0JBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEMsaUJBQUcsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlDLGtCQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixrQkFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO2FBQzdDOzs7O0FBRUQsZ0JBQU07bUJBQUEsZ0JBQUMsUUFBUSxFQUFFO0FBQ2Ysa0JBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLG1CQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEQsb0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2VBQ3RDLENBQUM7YUFDSDs7Ozs7O2VBdkxVLFFBQVE7U0FBUyxJQUFJIiwiZmlsZSI6InRyZWUtbm9kZS5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9