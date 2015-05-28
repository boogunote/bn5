System.register(["firebase", "jquery", "jquery-autosize", "bootstrap", "bootstrap/css/bootstrap.css!", "./common", "./utility", "aurelia-router"], function (_export) {
  var autosize, Common, Utility, Router, _createClass, _classCallCheck, MainWindow;

  return {
    setters: [function (_firebase) {}, function (_jquery) {}, function (_jqueryAutosize) {
      autosize = _jqueryAutosize["default"];
    }, function (_bootstrap) {}, function (_bootstrapCssBootstrapCss) {}, function (_common) {
      Common = _common.Common;
    }, function (_utility) {
      Utility = _utility.Utility;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
          this.showTimeline = false;
          this.lockTime = 0;
          this.localTabList = [];
          this.dialogMessage = "";
        }

        _createClass(MainWindow, {
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
                if (that.utility.now() < that.lockTime) return;

                that.info = dataSnapshot.val();
                console.log(that.info);
                if (typeof that.info.mainwindow.tabs == "undefined") that.info.mainwindow.tabs = [];
                // copy to local tab list
                for (var i = 0; i < that.info.mainwindow.tabs.length; i++) {
                  that.localTabList.push({ id: that.info.mainwindow.tabs[i].id });
                };

                if (that.info.mainwindow.tabs.length > 0) {
                  that.active_id = that.info.mainwindow.tabs[0].id;
                  // this line should be commented out. first activated page also needs resize.
                  // that.info.mainwindow.tabs[0].resized = true;
                }
                for (var i = 0; i < that.info.mainwindow.tabs.length; i++) {
                  that.rootRef.child("notes").child("users").child(authData.uid).child("files").child(that.info.mainwindow.tabs[i].id).child("meta").on("value", function (metaSnapshot) {
                    console.log(metaSnapshot.val());
                    var meta = metaSnapshot.val();
                    for (var i = 0; i < that.info.mainwindow.tabs.length; i++) {
                      if (that.info.mainwindow.tabs[i].id == meta.id) {
                        if (that.info.mainwindow.tabs[i].type != meta.type) that.info.mainwindow.tabs[i].type = meta.type;
                        if (that.info.mainwindow.tabs[i].name != meta.name) that.info.mainwindow.tabs[i].name = meta.name;
                        break;
                      }
                    };

                    for (var i = 0; i < that.localTabList.length; i++) {
                      if (that.localTabList[i].id == meta.id) {
                        if (that.localTabList[i].type != meta.type) that.localTabList[i].type = meta.type;
                        if (that.localTabList[i].name != meta.name) that.localTabList[i].name = meta.name;
                        break;
                      }
                    };
                  });
                  that.info[i];
                };
              });
            }
          },
          close: {
            value: function close(event) {
              var index = -1;
              for (var i = 0; i < this.info.mainwindow.tabs.length; i++) {
                if (this.info.mainwindow.tabs[i].id == event.target.file_id) {
                  index = i;
                  break;
                }
              };
              if (-1 != index) {
                this.info.mainwindow.tabs.splice(index, 1);
                if (this.info.mainwindow.tabs.length > 0) {
                  if (index < this.info.mainwindow.tabs.length) {
                    this.active_id = this.info.mainwindow.tabs[index].id;
                  } else {
                    this.active_id = this.info.mainwindow.tabs[0].id;
                  }
                } else {
                  this.active_id = "";
                  this.localTabList = [];
                }
              };

              this.setRemoteData();
            }
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
                this.info.mainwindow.tabs.push({
                  id: meta.id,
                  type: meta.type,
                  name: meta.name
                });

                this.localTabList.push({
                  id: meta.id,
                  type: meta.type,
                  name: meta.name
                });
              }
              var that = this;
              setTimeout(function () {
                that.active_id = meta.id;
              }, 10);

              this.setRemoteData();
            }
          },
          toggleFileManager: {
            value: function toggleFileManager() {
              this.showFileManager = !this.showFileManager;
            }
          },
          toggleTimeline: {
            value: function toggleTimeline() {
              this.showTimeline = !this.showTimeline;
            }
          },
          onMouseEnter: {
            value: function onMouseEnter(event) {
              $(event.target).find("input").show();
            }
          },
          onMouseLeave: {
            value: function onMouseLeave(event) {
              $(event.target).find("input").hide();
            }
          },
          onSwitchTab: {
            value: function onSwitchTab(event) {
              console.log(event);
              var id = event.target.file_id;
              if (this.active_id != id) {
                this.active_id = id;
                console.log(id);
                for (var i = 0; i < this.info.mainwindow.tabs.length; i++) {
                  if (this.info.mainwindow.tabs[i].id == id) {
                    if (!this.info.mainwindow.tabs[i].resized) {
                      this.resizeAllTextareas(id);
                      this.info.mainwindow.tabs[i].resized = true;
                    }
                    break;
                  }
                };
              }
            }
          },
          resizeAllTextareas: {
            value: function resizeAllTextareas(id) {
              console.log("resizeAllTextareas");
              setTimeout(function () {
                var taList = $("#page-" + id).find("textarea");
                // console.log(taList)
                for (var i = 0; i < taList.length; i++) {
                  taList[i].removeAttribute("data-autosize-on");
                  if ($(taList).hasClass("tree-textarea-fold")) {
                    // var evt = document.createEvent('Event');
                    // evt.initEvent('autosize.destroy', true, false);
                    // taList[i].dispatchEvent(evt);
                    // autosize(taList[i]);
                    taList[i].style.height = "24px"; //taList[i].scrollHeight+"px";
                  } else {
                    autosize(taList[i]);
                  }
                };
              }, 0);
            }
          },
          setRemoteData: {
            value: function setRemoteData() {
              var list = [];
              for (var i = 0; i < this.info.mainwindow.tabs.length; i++) {
                var item = {
                  id: this.info.mainwindow.tabs[i].id
                };
                list.push(item);
              };

              this.infoRef.child("mainwindow/tabs").set(list);
              this.lockTime = this.utility.now() + 5 * 1000;
            }
          },
          showModalDialog: {
            value: function showModalDialog() {}
          }
        }, {
          inject: {
            value: function inject() {
              return [Common, Utility, Router];
            }
          }
        });

        return MainWindow;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztxQkFDN0M7QUFDRCwwQkFBTTttQkFDUDtpQkFDRixDQUFDO2VBQ0g7YUFFRjs7QUFFRCw0QkFBa0I7bUJBQUEsNEJBQUMsRUFBRSxFQUFFO0FBQ3JCLHFCQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFDakMsd0JBQVUsQ0FBQyxZQUFXO0FBQ3BCLG9CQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsUUFBUSxHQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFN0MscUJBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RDLHdCQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDOUMsc0JBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFOzs7OztBQUs1QywwQkFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO21CQUNqQyxNQUFNO0FBQ0wsNEJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzttQkFDckI7aUJBQ0YsQ0FBQztlQUNILEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDUDs7QUFFRCx1QkFBYTttQkFBQSx5QkFBRztBQUNkLGtCQUFJLElBQUksR0FBRyxFQUFFLENBQUE7QUFDYixtQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekQsb0JBQUksSUFBSSxHQUFHO0FBQ1Qsb0JBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDcEMsQ0FBQTtBQUNELG9CQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2VBQ2pCLENBQUM7O0FBRUYsa0JBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELGtCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFDLElBQUksQ0FBQzthQUM3Qzs7QUFFRCx5QkFBZTttQkFBQSwyQkFBRyxFQUVqQjs7O0FBek1NLGdCQUFNO21CQUFBLGtCQUFHO0FBQUUscUJBQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQUU7Ozs7ZUFEMUMsVUFBVSIsImZpbGUiOiJtYWlud2luZG93LmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIn0=