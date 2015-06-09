System.register(["firebase", "./common", "./utility", "aurelia-router", "bootstrap/css/bootstrap.css!"], function (_export) {
  var Common, Utility, Router, _createClass, _classCallCheck, App;

  return {
    setters: [function (_firebase) {}, function (_common) {
      Common = _common.Common;
    }, function (_utility) {
      Utility = _utility.Utility;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_bootstrapCssBootstrapCss) {}],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      App = _export("App", (function () {
        function App(common, utility, router) {
          _classCallCheck(this, App);

          window.is_nodewebkit = typeof process == "object";
          if (window.is_nodewebkit) {
            window.require = function (moduleName) {
              var tmp = window.global;
              window.global = window.node_global;
              var module = window.global.require(moduleName);
              window.global = tmp;
              return module;
            };
          }

          this.common = common;
          this.utility = utility;
          this.router = router;
          this.router.configure(function (config) {
            config.title = "BooguNote5";
            config.map([{ route: ["index"], moduleId: "index", nav: true },
            // {route: ['flat/:id'],  moduleId: 'flat', nav: true},
            { route: ["tree/:type/:user_id/:file_id/:root_id"], moduleId: "tree", nav: true }, { route: ["", "login"], moduleId: "login", nav: true }, { route: ["fm/:user_id"], moduleId: "./file_manager/tree", nav: true }, { route: ["flat/:type/:user_id/:file_id/:root_id"], moduleId: "flat", nav: true }, { route: ["mosaic/:type/:user_id/:file_id", "mosaic"], moduleId: "mosaic/mosaic", nav: true }, { route: ["main"], moduleId: "main", nav: true }, { route: ["timeline"], moduleId: "timeline/timeline", nav: true }]);
          });

          this.isOffline = false;

          var that = this;
          new Firebase(this.common.firebase_url).child(".info/connected").on("value", function (connectedSnap) {
            if (connectedSnap.val() === true) {
              that.isOffline = false;
            } else {
              that.isOffline = true;
            }
          });
        }

        _createClass(App, null, {
          inject: {
            value: function inject() {
              return [Common, Utility, Router];
            }
          }
        });

        return App;
      })());
    }
  };
});

// import 'bootstrap';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO01BQ1EsTUFBTSxFQUNOLE9BQU8sRUFFUCxNQUFNLGlDQUlELEdBQUc7Ozs7QUFQUixZQUFNLFdBQU4sTUFBTTs7QUFDTixhQUFPLFlBQVAsT0FBTzs7QUFFUCxZQUFNLGtCQUFOLE1BQU07Ozs7Ozs7OztBQUlELFNBQUc7QUFFSCxpQkFGQSxHQUFHLENBRUYsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0NBRjFCLEdBQUc7O0FBR1osZ0JBQU0sQ0FBQyxhQUFhLEdBQUksT0FBTyxPQUFPLElBQUksUUFBUSxBQUFDLENBQUM7QUFDcEQsY0FBSSxNQUFNLENBQUMsYUFBYSxFQUFFO0FBQ3hCLGtCQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsVUFBVSxFQUFFO0FBQ3BDLGtCQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ3hCLG9CQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDbkMsa0JBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQy9DLG9CQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUNwQixxQkFBTyxNQUFNLENBQUM7YUFDZixDQUFBO1dBQ0Y7O0FBRUQsY0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsY0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsY0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsY0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDOUIsa0JBQU0sQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDO0FBQzVCLGtCQUFNLENBQUMsR0FBRyxDQUFDLENBQ1QsRUFBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRyxRQUFRLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUM7O0FBRWpELGNBQUMsS0FBSyxFQUFFLENBQUMsdUNBQXVDLENBQUMsRUFBTSxRQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFDbkYsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUMsT0FBTyxDQUFDLEVBQU0sUUFBUSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQ3ZELEVBQUMsS0FBSyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQU0sUUFBUSxFQUFFLHFCQUFxQixFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFDeEUsRUFBQyxLQUFLLEVBQUUsQ0FBQyx1Q0FBdUMsQ0FBQyxFQUFNLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxFQUNuRixFQUFDLEtBQUssRUFBRSxDQUFDLGdDQUFnQyxFQUFFLFFBQVEsQ0FBQyxFQUFNLFFBQVEsRUFBRSxlQUFlLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxFQUMvRixFQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxFQUM5QyxFQUFDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQ2hFLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQzs7QUFFSCxjQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzs7QUFFdkIsY0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGNBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFTLGFBQWEsRUFBRTtBQUNsRyxnQkFBSSxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssSUFBSSxFQUFFO0FBQ2hDLGtCQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzthQUN4QixNQUFNO0FBQ0wsa0JBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2FBQ3ZCO1dBQ0YsQ0FBQyxDQUFDO1NBRUo7O3FCQTNDVSxHQUFHO0FBQ1AsZ0JBQU07bUJBQUEsa0JBQUc7QUFBRSxxQkFBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFBRTs7OztlQUQxQyxHQUFHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9