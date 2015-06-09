System.register(["firebase", "jquery", "jquery-autosize", "bootstrap", "bootstrap/css/bootstrap.css!", "./common", "./utility", "aurelia-router"], function (_export) {
  var autosize, Common, Utility, Router, _createClass, _classCallCheck, Main;

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

      Main = _export("Main", (function () {
        function Main(common, utility, router) {
          _classCallCheck(this, Main);

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

        _createClass(Main, {
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

        return Main;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUNwQyxDQUFBO0FBQ0Qsb0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7ZUFDakIsQ0FBQzs7QUFFRixrQkFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEQsa0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUMsSUFBSSxDQUFDO2FBQzdDOztBQUVELHlCQUFlO21CQUFBLDJCQUFHLEVBRWpCOzs7QUF4TU0sZ0JBQU07bUJBQUEsa0JBQUc7QUFBRSxxQkFBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFBRTs7OztlQUQxQyxJQUFJIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==