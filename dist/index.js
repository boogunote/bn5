System.register(["aurelia-framework", "./tree-params", "aurelia-router"], function (_export) {
  var Behavior, Parent, TreeParams, Router, _createClass, _classCallCheck, Index, SelectAttachedBehavior;

  return {
    setters: [function (_aureliaFramework) {
      Behavior = _aureliaFramework.Behavior;
      Parent = _aureliaFramework.Parent;
    }, function (_treeParams) {
      TreeParams = _treeParams.TreeParams;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Index = _export("Index", (function () {
        function Index(treeParams, parentRouter) {
          _classCallCheck(this, Index);

          this.treeParams = treeParams;
          this.parentRouter = parentRouter;
        }

        _createClass(Index, {
          open: {
            value: function open(path) {
              console.log(path);
              this.treeParams.path = path;
              // window.location.href = "#/tree/root"
              this.parentRouter.navigate("tree");
            }
          },
          "new": {
            value: function _new(path) {
              console.log(path);
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [TreeParams, Parent.of(Router)];
            }
          }
        });

        return Index;
      })());
      SelectAttachedBehavior = _export("SelectAttachedBehavior", (function () {
        function SelectAttachedBehavior(element) {
          _classCallCheck(this, SelectAttachedBehavior);

          this.element = element;
        }

        _createClass(SelectAttachedBehavior, {
          bind: {
            value: function bind(observer) {
              var _this = this;

              this.observer = observer;
              this.element.addEventListener("change", function (event) {
                _this.observer[event.srcElement.id](_this.element.value);
              });
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [Element];
            }
          }
        });

        return SelectAttachedBehavior;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7TUFBUSxRQUFRLEVBQUMsTUFBTSxFQUNmLFVBQVUsRUFDVixNQUFNLGlDQUVELEtBQUssRUFtQkwsc0JBQXNCOzs7O0FBdkIzQixjQUFRLHFCQUFSLFFBQVE7QUFBQyxZQUFNLHFCQUFOLE1BQU07O0FBQ2YsZ0JBQVUsZUFBVixVQUFVOztBQUNWLFlBQU0sa0JBQU4sTUFBTTs7Ozs7Ozs7O0FBRUQsV0FBSztBQUVMLGlCQUZBLEtBQUssQ0FFSixVQUFVLEVBQUUsWUFBWSxFQUFFO2dDQUYzQixLQUFLOztBQUdkLGNBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLGNBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1NBQ2xDOztxQkFMVSxLQUFLO0FBT2hCLGNBQUk7bUJBQUEsY0FBQyxJQUFJLEVBQUU7QUFDVCxxQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQixrQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUU1QixrQkFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDcEM7OzttQkFFRSxjQUFDLElBQUksRUFBRTtBQUNSLHFCQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25COzs7QUFmTSxnQkFBTTttQkFBQSxrQkFBRztBQUFFLHFCQUFPLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUFFOzs7O2VBRGhELEtBQUs7O0FBbUJMLDRCQUFzQjtBQUV0QixpQkFGQSxzQkFBc0IsQ0FFckIsT0FBTyxFQUFFO2dDQUZWLHNCQUFzQjs7QUFHL0IsY0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7U0FDeEI7O3FCQUpVLHNCQUFzQjtBQU1qQyxjQUFJO21CQUFBLGNBQUMsUUFBUSxFQUFFOzs7QUFDYixrQkFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsa0JBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQy9DLHNCQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2VBQ3hELENBQUMsQ0FBQzthQUNOOzs7QUFWTSxnQkFBTTttQkFBQSxrQkFBRztBQUFFLHFCQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7YUFBRTs7OztlQUQxQixzQkFBc0IiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==