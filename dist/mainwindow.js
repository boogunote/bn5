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

                  this.resizeAllTextareas(this.active_id);
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
//# sourceMappingURL=data:application/json;base64,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