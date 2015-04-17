System.register(["aurelia-framework", "./tree-params", "aurelia-router"], function (_export) {
  var Behavior, Parent, TreeParams, Router, _prototypeProperties, _classCallCheck, Index, SelectAttachedBehavior;

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

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Index = _export("Index", (function () {
        function Index(treeParams, parentRouter) {
          _classCallCheck(this, Index);

          this.treeParams = treeParams;
          this.parentRouter = parentRouter;
        }

        _prototypeProperties(Index, {
          inject: {
            value: function inject() {
              return [TreeParams, Parent.of(Router)];
            },
            writable: true,
            configurable: true
          }
        }, {
          open: {
            value: function open(path) {
              console.log(path);
              this.treeParams.path = path;
              // window.location.href = "#/tree/root"
              this.parentRouter.navigate("tree");
            },
            writable: true,
            configurable: true
          },
          "new": {
            value: function _new(path) {
              console.log(path);
            },
            writable: true,
            configurable: true
          }
        });

        return Index;
      })());
      SelectAttachedBehavior = _export("SelectAttachedBehavior", (function () {
        function SelectAttachedBehavior(element) {
          _classCallCheck(this, SelectAttachedBehavior);

          this.element = element;
        }

        _prototypeProperties(SelectAttachedBehavior, {
          inject: {
            value: function inject() {
              return [Element];
            },
            writable: true,
            configurable: true
          }
        }, {
          bind: {
            value: function bind(observer) {
              var _this = this;

              this.observer = observer;
              this.element.addEventListener("change", function (event) {
                _this.observer[event.srcElement.id](_this.element.value);
              });
            },
            writable: true,
            configurable: true
          }
        });

        return SelectAttachedBehavior;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7TUFBUSxRQUFRLEVBQUMsTUFBTSxFQUNmLFVBQVUsRUFDVixNQUFNLHlDQUVELEtBQUssRUFtQkwsc0JBQXNCOzs7O0FBdkIzQixjQUFRLHFCQUFSLFFBQVE7QUFBQyxZQUFNLHFCQUFOLE1BQU07O0FBQ2YsZ0JBQVUsZUFBVixVQUFVOztBQUNWLFlBQU0sa0JBQU4sTUFBTTs7Ozs7Ozs7O0FBRUQsV0FBSztBQUVMLGlCQUZBLEtBQUssQ0FFSixVQUFVLEVBQUUsWUFBWTtnQ0FGekIsS0FBSzs7QUFHZCxjQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixjQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztTQUNsQzs7NkJBTFUsS0FBSztBQUNULGdCQUFNO21CQUFBLGtCQUFHO0FBQUUscUJBQU8sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQUU7Ozs7O0FBTTNELGNBQUk7bUJBQUEsY0FBQyxJQUFJLEVBQUU7QUFDVCxxQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQixrQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUU1QixrQkFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDcEM7Ozs7O21CQUVFLGNBQUMsSUFBSSxFQUFFO0FBQ1IscUJBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbkI7Ozs7OztlQWhCVSxLQUFLOztBQW1CTCw0QkFBc0I7QUFFdEIsaUJBRkEsc0JBQXNCLENBRXJCLE9BQU87Z0NBRlIsc0JBQXNCOztBQUcvQixjQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUN4Qjs7NkJBSlUsc0JBQXNCO0FBQzFCLGdCQUFNO21CQUFBLGtCQUFHO0FBQUUscUJBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUFFOzs7OztBQUtyQyxjQUFJO21CQUFBLGNBQUMsUUFBUSxFQUFFOzs7QUFDYixrQkFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsa0JBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQy9DLHNCQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2VBQ3hELENBQUMsQ0FBQzthQUNOOzs7Ozs7ZUFYVSxzQkFBc0IiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==