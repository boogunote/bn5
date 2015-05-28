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
          this.lockTime = 0;
          this.localTabList = [];
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
                if (that.utility.now() < that.lockTime) return;

                that.info = dataSnapshot.val();
                console.log(that.info);
                if (typeof that.info.mainwindow.tabs == "undefined") that.info.mainwindow.tabs = [];
                // copy to local tab list
                for (var i = 0; i < that.info.mainwindow.tabs.length; i++) {
                  that.localTabList.push({ id: that.info.mainwindow.tabs[i].id });
                };

                if (that.info.mainwindow.tabs.length > 0) that.active_id = that.info.mainwindow.tabs[0].id;
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
            },
            writable: true,
            configurable: true
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
          onMouseEnter: {
            value: function onMouseEnter(event) {
              $(event.target).find("input").show();
            },
            writable: true,
            configurable: true
          },
          onMouseLeave: {
            value: function onMouseLeave(event) {
              $(event.target).find("input").hide();
            },
            writable: true,
            configurable: true
          },
          onSwitchTab: {
            value: function onSwitchTab(event) {
              console.log(event);
              var id = event.target.file_id;
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
//# sourceMappingURL=data:application/json;base64,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QUFDYixtQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekQsb0JBQUksSUFBSSxHQUFHO0FBQ1Qsb0JBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDcEMsQ0FBQTtBQUNELG9CQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2VBQ2pCLENBQUM7O0FBRUYsa0JBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELGtCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFDLElBQUksQ0FBQzthQUM3Qzs7Ozs7O2VBeEtVLFVBQVUiLCJmaWxlIjoibWFpbndpbmRvdy5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9