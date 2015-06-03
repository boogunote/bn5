System.register(["aurelia-framework", "./common", "./data-source", "./node", "./utility", "jquery-autosize"], function (_export) {
  var Behavior, Common, DataSource, Node, Utility, autosize, _createClass, _get, _inherits, _classCallCheck, TreeNode;

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
                this.ta.style.height = "24px"; //this.ta.scrollHeight;
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
//# sourceMappingURL=data:application/json;base64,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LEVBQUU7QUFDYixrQkFBSSxPQUFPLEdBQUcsQ0FDWixFQUFDLEtBQUssRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUMsRUFBQyxFQUNoQixFQUFDLEtBQUssRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLEVBQUUsRUFBQyxFQUNsQixFQUFDLEtBQUssRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLEVBQUUsRUFBQyxFQUNsQixFQUFDLEtBQUssRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBQyxDQUNyQixDQUFBO0FBQ0Qsa0JBQUksY0FBYyxHQUFHLENBQ25CLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEtBQUssRUFBQyxFQUMzQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFDM0MsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsSUFBSSxFQUFDLEVBQzNDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLEtBQUssRUFBQyxFQUMzQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFDNUMsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsSUFBSSxFQUFDLEVBQzFDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLElBQUksRUFBQyxFQUMxQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxJQUFJLEVBQUMsRUFDMUMsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsS0FBSyxFQUFDLEVBQzNDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEtBQUssRUFBQyxFQUMzQyxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxJQUFJLEVBQUMsRUFDMUMsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsSUFBSSxFQUFDLEVBQzFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEtBQUssRUFBQyxFQUM1QyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUMsQ0FDN0MsQ0FBQTs7QUFFRCxrQkFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLG1CQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QyxvQkFBRyxLQUFLLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDO0FBQ3RFLDRCQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ25CLHdCQUFNO2lCQUNQO2VBQ0YsQ0FBQzs7QUFFRixrQkFBSSxVQUFVLEVBQUU7QUFDZCxxQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDOUMsc0JBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUN0QyxLQUFLLENBQUMsTUFBTSxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQ3JDLEtBQUssQ0FBQyxPQUFPLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFDdkMsS0FBSyxDQUFDLFFBQVEsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFO0FBQzdDLDhCQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ25CLDBCQUFNO21CQUNQO2lCQUNGLENBQUM7ZUFDSDs7QUFFRCxrQkFBSSxVQUFVLEVBQUU7QUFDZCxvQkFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2VBQ3BDLENBQUM7O0FBRUYscUJBQU8sSUFBSSxDQUFDO2FBQ2I7O0FBRUQsZ0JBQU07bUJBQUEsa0JBQUc7QUFDUCxrQkFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQUUsdUJBQU87ZUFBQTtBQUVyQixrQkFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4QyxpQkFBRyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUMsa0JBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLGtCQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUM7YUFDN0M7O0FBRUQsZ0JBQU07bUJBQUEsZ0JBQUMsUUFBUSxFQUFFO0FBQ2Ysa0JBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLG1CQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEQsb0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2VBQ3RDLENBQUM7YUFDSDs7O0FBdExNLGdCQUFNO21CQUFBLGtCQUFHO0FBQUUscUJBQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUFFOzs7O2VBRHZELFFBQVE7U0FBUyxJQUFJIiwiZmlsZSI6InRyZWUtbm9kZS5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9