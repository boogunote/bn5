System.register(["firebase", "jquery", "jquery-autosize", "bootstrap/css/bootstrap.css!", "./common", "./utility", "aurelia-router"], function (_export) {
  var autosize, Common, Utility, Router, _prototypeProperties, _classCallCheck, MainWindow;

  return {
    setters: [function (_firebase) {}, function (_jquery) {}, function (_jqueryAutosize) {
      autosize = _jqueryAutosize["default"];
    }, function (_bootstrapCssBootstrapCss) {}, function (_common) {
      Common = _common.Common;
    }, function (_utility) {
      Utility = _utility.Utility;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      MainWindow = _export("MainWindow", (function () {
        function MainWindow(common, utility, router) {
          _classCallCheck(this, MainWindow);

          this.common = common;
          this.utility = utility;
          this.router = router;

          this.frameVM = this;

          this.active_id = "";
          this.showFileManager = false;
        }

        _prototypeProperties(MainWindow, {
          inject: {
            value: function inject() {
              return [Common, Utility, Router];
            },
            writable: true,
            configurable: true
          }
        }, {
          activate: {
            value: function activate(model) {
              this.rootRef = new Firebase(this.common.firebase_url);
              var authData = this.rootRef.getAuth();
              if (!authData) {
                console.log("Please login!");
                return;
              }

              this.infoRef = this.groupsRef = this.rootRef.child("/info/users/" + authData.uid);

              var that = this;
              this.infoRef.on("value", function (dataSnapshot) {
                that.info = dataSnapshot.val();
                console.log(that.info);
                if (typeof that.info.mainwindow.tabs == "undefined") that.info.mainwindow.tabs = [];
                var tabs = that.info.mainwindow.tabs;
                console.log(tabs);
                if (that.info.mainwindow.tabs.length > 0) that.active_id = that.info.mainwindow.tabs[0].id;
                for (var i = 0; i < that.info.mainwindow.tabs.length; i++) {
                  that.rootRef.child("notes").child("users").child(authData.uid).child("files").child(that.info.mainwindow.tabs[i].id).child("meta").on("value", function (metaSnapshot) {
                    console.log(metaSnapshot.val());
                    for (var i = 0; i < that.info.mainwindow.tabs.length; i++) {
                      var meta = metaSnapshot.val();
                      if (that.info.mainwindow.tabs[i].id == meta.id) {
                        if (that.info.mainwindow.tabs[i].type != meta.type) that.info.mainwindow.tabs[i].type = meta.type;
                        if (that.info.mainwindow.tabs[i].name != meta.name) that.info.mainwindow.tabs[i].name = meta.name;
                        break;
                      }
                    };
                  });
                  that.info[i];
                };
              });
            },
            writable: true,
            configurable: true
          },
          open: {
            value: function open(meta) {
              var opened = false;
              for (var i = 0; i < this.info.mainwindow.tabs.length; i++) {
                if (this.info.mainwindow.tabs[i].id == meta.id) {
                  opened = true;
                  break;
                }
              };
              if (!opened) {
                this.info.mainwindow.tabs.push(meta);
              }
              this.active_id = meta.id;
            },
            writable: true,
            configurable: true
          },
          openFileManager: {
            value: function openFileManager() {
              this.showFileManager = !this.showFileManager;
            },
            writable: true,
            configurable: true
          },
          onSwitchTab: {
            value: function onSwitchTab(event) {
              console.log(event);
              var id = event.target.id.slice(4);
              if (this.active_id != id) {
                this.active_id = id;
                console.log(id);
                setTimeout(function () {
                  var taList = $("#page-" + id).find("textarea");
                  console.log(taList);
                  for (var i = 0; i < taList.length; i++) {
                    taList[i].removeAttribute("data-autosize-on");
                    autosize(taList[i]);
                  };
                }, 10);
              }
            },
            writable: true,
            configurable: true
          }
        });

        return MainWindow;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QztlQUNILENBQUMsQ0FBQTthQUNIOzs7O0FBRUQsY0FBSTttQkFBQSxjQUFDLElBQUksRUFBRTtBQUNULGtCQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDbkIsbUJBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3pELG9CQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUM5Qyx3QkFBTSxHQUFHLElBQUksQ0FBQztBQUNkLHdCQUFNO2lCQUNQO2VBQ0YsQ0FBQztBQUNGLGtCQUFJLENBQUMsTUFBTSxFQUFFO0FBQ1gsb0JBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7ZUFDdEM7QUFDRCxrQkFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2FBQzFCOzs7O0FBRUQseUJBQWU7bUJBQUEsMkJBQUc7QUFDaEIsa0JBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO2FBQzlDOzs7O0FBRUQscUJBQVc7bUJBQUEscUJBQUMsS0FBSyxFQUFFO0FBQ2pCLHFCQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ2xCLGtCQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDakMsa0JBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLEVBQUU7QUFDeEIsb0JBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLHVCQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ2YsMEJBQVUsQ0FBQyxZQUFXO0FBQ3BCLHNCQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsUUFBUSxHQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3Qyx5QkFBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNuQix1QkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdEMsMEJBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM5Qyw0QkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO21CQUNyQixDQUFDO2lCQUNILEVBQUUsRUFBRSxDQUFDLENBQUM7ZUFDUjthQUVGOzs7Ozs7ZUF6RlUsVUFBVSIsImZpbGUiOiJtYWlud2luZG93LmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIn0=