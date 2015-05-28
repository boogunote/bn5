System.register(["../common", "./node", "../utility"], function (_export) {
  var Common, Node, Utility, _createClass, _get, _inherits, _classCallCheck, TreeNode;

  return {
    setters: [function (_common) {
      Common = _common.Common;
    }, function (_node) {
      Node = _node.Node;
    }, function (_utility) {
      Utility = _utility.Utility;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

      _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      TreeNode = _export("TreeNode", (function (_Node) {
        function TreeNode(common, element, utility) {
          _classCallCheck(this, TreeNode);

          _get(Object.getPrototypeOf(TreeNode.prototype), "constructor", this).call(this);
          this.common = common;
          this.element = element;
          this.utility = utility;

          this.node = null;
          this.node_id = null;
          this.url = "";
          this.title = null;
          this.collapsed = null;
          this.children = null;
          this.metaRef = null;
          this.meta = null;
        }

        _inherits(TreeNode, _Node);

        _createClass(TreeNode, {
          activate: {
            value: function activate(model) {
              // console.log("activate, model.node_id:"+model.node_id)
              this.node_id = model.node_id;
              this.parentVM = model.parentVM;
              this.rootVM = model.parentVM.rootVM;
              this.parentVM.addChildVM(this, this.node_id);

              var that = this;
              this.nodeRef = this.rootVM.dirNodesRef.child(this.node_id);
              this.nodeRef.on("value", function (dataSnapshot) {
                if (that.rootVM.editing) return;
                console.log("this.nodeRef.on('value', model.node_id:" + model.node_id);
                var data = dataSnapshot.val();
                console.log(data);
                if (!data) return;
                that.node = data;
                if (!that.node.children) that.node.children = [];
              });

              this.metaRef = this.rootVM.filesRef.child(this.node_id).child("meta");
              this.metaRef.on("value", function (dataSnapshot) {
                if (that.rootVM.editing) return;
                var data = dataSnapshot.val();
                if (!data) return;
                that.meta = data;
                console.log(that.meta);
                if ("tree" == that.meta.type || "flat" == that.meta.type) {
                  that.url = "./#" + that.meta.type + "/online/" + that.meta.id + "/root";
                } else if ("mosaic" == that.meta.type) {
                  that.url = "./#" + that.meta.type + "/online/" + that.meta.id;
                }
              });
            }
          },
          cut: {
            value: function cut() {
              this.rootVM.selectedVMList.push(this);
              this.rootVM.cut();
            }
          },
          open: {
            value: function open(event) {
              console.log(event);
              event.cancelBubble = true;
              event.stopPropagation();
              if (!this.url) {
                return;
              }if (this.rootVM.frameVM) {
                this.rootVM.frameVM.open(this.meta);
              } else {
                window.open(this.url);
              }
              return true;
            }
          },
          toggle: {
            value: function toggle() {
              if ("directory" != this.meta.type) {
                return;
              }this.meta.collapsed = !this.meta.collapsed;
              this.rootVM.filesRef.child(this.node.id).child("/meta/collapsed").set(this.meta.collapsed);
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [Common, Element, Utility];
            }
          }
        });

        return TreeNode;
      })(Node));
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGVfbWFuYWdlci90cmVlLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtNQUFRLE1BQU0sRUFDTixJQUFJLEVBQ0osT0FBTyxrREFFRixRQUFROzs7O0FBSmIsWUFBTSxXQUFOLE1BQU07O0FBQ04sVUFBSSxTQUFKLElBQUk7O0FBQ0osYUFBTyxZQUFQLE9BQU87Ozs7Ozs7Ozs7Ozs7QUFFRixjQUFRO0FBRVIsaUJBRkEsUUFBUSxDQUVQLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDO2dDQUYxQixRQUFROztBQUdqQixxQ0FIUyxRQUFRLDZDQUdUO0FBQ1IsY0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsY0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsY0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRXZCLGNBQUksQ0FBQyxJQUFJLEdBQUksSUFBSSxDQUFDO0FBQ2xCLGNBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLGNBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2QsY0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDakIsY0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEIsY0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsY0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDbEI7O2tCQWhCVSxRQUFROztxQkFBUixRQUFRO0FBa0JuQixrQkFBUTttQkFBQSxrQkFBQyxLQUFLLEVBQUM7O0FBRWIsa0JBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUM3QixrQkFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO0FBQy9CLGtCQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxD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QUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7ZUFDckMsTUFBTTtBQUNMLHNCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztlQUN2QjtBQUNELHFCQUFPLElBQUksQ0FBQzthQUNiOztBQUVELGdCQUFNO21CQUFBLGtCQUFHO0FBQ1Asa0JBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtBQUFFLHVCQUFPO2VBQUEsQUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUMzQyxrQkFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDNUY7OztBQTFFTSxnQkFBTTttQkFBQSxrQkFBRztBQUFFLHFCQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQzthQUFFOzs7O2VBRDNDLFFBQVE7U0FBUyxJQUFJIiwiZmlsZSI6ImZpbGVfbWFuYWdlci90cmVlLW5vZGUuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==