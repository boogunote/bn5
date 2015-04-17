System.register(["aurelia-framework", "./common", "./data-source", "./node", "./utility", "jquery-autosize"], function (_export) {
  var Behavior, Common, DataSource, Node, Utility, _createClass, _get, _inherits, _classCallCheck, TreeNode;

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
    }, function (_jqueryAutosize) {}],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      TreeNode = _export("TreeNode", (function (_Node) {
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

        _inherits(TreeNode, _Node);

        _createClass(TreeNode, {
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
            }
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
                this.ta.style.height = this.ta.scrollHeight;
              }
            }
          },
          attached: {
            value: function attached() {
              // console.log("attached!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
              // this.ta = this.element.children[0].children[1];
              if (this.element.children[0].children[1]) this.ta = this.element.children[0].children[1];
              if (this.ta && this.node) this.foldNode();
            }
          },
          deactivate: {
            value: function deactivate() {
              console.log("deactivate");
            }
          },
          detached: {
            value: function detached() {
              // console.log("detached: "+this.node.content+" "+this.node.id);
              this.removeObserver(this.node.id);
              this.parentVM.removeChildVM(this);
            }
          },
          fold: {
            value: function fold() {
              this.node.fold = !this.node.fold;
              this.foldNode(this.node.fold);
              this.setNodeToServer(this.node.id);
            }
          },
          stepIcon: {
            value: function stepIcon(direction) {
              if (direction) this.node.icon++;else this.node.icon--;
              if (this.node.icon > 7) this.node.icon = 0;
              if (this.node.icon < 0) this.node.icon = 7;
              this.setNodeToServer(this.node.id);
            }
          },
          toggle: {
            value: function toggle() {
              // console.log("toggle")
              this.node.collapsed = !this.node.collapsed;
              this.setNodeToServer(this.node.id);
            }
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
            }
          },
          onBlur: {
            value: function onBlur(event) {
              this.rootVM.focusedVM = null;
            }
          },
          onClick: {
            value: function onClick(event) {
              if (event.ctrlKey) {
                this.select(!this.selected);
                return true;
              }
            }
          },
          onFocus: {
            value: function onFocus(event) {
              this.rootVM.focusedVM = this;
            }
          },
          onKeyDown: {
            value: function onKeyDown(event) {
              if (event.ctrlKey && 192 == event.keyCode) {
                this.openSubTreeInNewWindow(this.node.id);
                return false;
              }

              return true;
            }
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
            }
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
            }
          },
          select: {
            value: function select(selected) {
              this.selected = selected;
              for (var i = 0; i < this.childVMList.length; i++) {
                this.childVMList[i].select(selected);
              };
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [Common, Element, DataSource, Utility];
            }
          }
        });

        return TreeNode;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QzFDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLElBQUksRUFBQyxFQUMxQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFDM0MsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsS0FBSyxFQUFDLEVBQzNDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLElBQUksRUFBQyxFQUMxQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxJQUFJLEVBQUMsRUFDMUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsS0FBSyxFQUFDLEVBQzVDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEtBQUssRUFBQyxDQUM3QyxDQUFBOztBQUVELGtCQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdEIsbUJBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZDLG9CQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUM7QUFDdEUsNEJBQVUsR0FBRyxLQUFLLENBQUM7QUFDbkIsd0JBQU07aUJBQ1A7ZUFDRixDQUFDOztBQUVGLGtCQUFJLFVBQVUsRUFBRTtBQUNkLHFCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM5QyxzQkFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQ3RDLEtBQUssQ0FBQyxNQUFNLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFDckMsS0FBSyxDQUFDLE9BQU8sSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUN2QyxLQUFLLENBQUMsUUFBUSxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUU7QUFDN0MsOEJBQVUsR0FBRyxLQUFLLENBQUM7QUFDbkIsMEJBQU07bUJBQ1A7aUJBQ0YsQ0FBQztlQUNIOztBQUVELGtCQUFJLFVBQVUsRUFBRTtBQUNkLG9CQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7ZUFDcEMsQ0FBQzs7QUFFRixxQkFBTyxJQUFJLENBQUM7YUFDYjs7QUFFRCxnQkFBTTttQkFBQSxrQkFBRztBQUNQLGtCQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFBRSx1QkFBTztlQUFBO0FBRXJCLGtCQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDLGlCQUFHLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM5QyxrQkFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0Isa0JBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQzthQUM3Qzs7QUFFRCxnQkFBTTttQkFBQSxnQkFBQyxRQUFRLEVBQUU7QUFDZixrQkFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsbUJBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNoRCxvQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7ZUFDdEMsQ0FBQzthQUNIOzs7QUF0TE0sZ0JBQU07bUJBQUEsa0JBQUc7QUFBRSxxQkFBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQUU7Ozs7ZUFEdkQsUUFBUTtTQUFTLElBQUkiLCJmaWxlIjoidHJlZS1ub2RlLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIn0=