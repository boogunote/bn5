System.register(["firebase", "jquery", "jquery-autosize", "bootstrap", "bootstrap/css/bootstrap.css!", "./common", "./utility", "aurelia-router"], function (_export) {
  var autosize, Common, Utility, Router, _prototypeProperties, _classCallCheck, MainWindow;

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
          this.showTimeline = false;
          this.lockTime = 0;
          this.localTabList = [];
          this.dialogMessage = "";
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

              var tempList = authData.uid.split(":");
              this.user_id = tempList[tempList.length - 1];

              this.infoRef = this.groupsRef = this.rootRef.child("/info/users/" + authData.uid);

              var that = this;
              this.infoRef.on("value", function (dataSnapshot) {
                if (that.utility.now() < that.lockTime) return;

                that.info = dataSnapshot.val();
                console.log(that.info);
                if (typeof that.info.mainwindow == "undefined") that.info.mainwindow = {};
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

                  this.resizeAllTextareas(this.active_id);
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
          toggleFileManager: {
            value: function toggleFileManager() {
              this.showFileManager = !this.showFileManager;
            },
            writable: true,
            configurable: true
          },
          toggleTimeline: {
            value: function toggleTimeline() {
              this.showTimeline = !this.showTimeline;
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
            },
            writable: true,
            configurable: true
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
          },
          showModalDialog: {
            value: function showModalDialog() {},
            writable: true,
            configurable: true
          }
        });

        return MainWindow;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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