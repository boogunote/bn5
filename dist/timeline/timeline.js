System.register(["../common", "../utility", "jquery", "bootstrap", "bootstrap/css/bootstrap.css!"], function (_export) {
  var Common, Utility, _prototypeProperties, _classCallCheck, Timeline;

  return {
    setters: [function (_common) {
      Common = _common.Common;
    }, function (_utility) {
      Utility = _utility.Utility;
    }, function (_jquery) {}, function (_bootstrap) {}, function (_bootstrapCssBootstrapCss) {}],
    execute: function () {
      "use strict";

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Timeline = _export("Timeline", (function () {
        function Timeline(common, utility) {
          _classCallCheck(this, Timeline);

          this.common = common;
          this.utility = utility;
        }

        _prototypeProperties(Timeline, {
          inject: {
            value: function inject() {
              return [Common, Utility];
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

              this.groupsRef = this.rootRef.child("/timeline/users/" + authData.uid + "/groups");
              this.dataRef = this.rootRef.child("/timeline/users/" + authData.uid + "/data");

              this.groups = [];
            },
            writable: true,
            configurable: true
          },
          removeItem: {
            value: function removeItem(item) {
              // this.setToRemoteTime = this.utility.now();
              console.log(item);
              this.dataRef.child(item.group).child(item.id).remove();
            },
            writable: true,
            configurable: true
          },
          addItem: {
            value: function addItem(item) {
              if (typeof item.end != "undefined") item.title = this.utility.millisecondsToString(item.end - item.start);
              var remoteItem = {
                id: item.id,
                content: item.content,
                start: item.start.getTime()
              };
              if (typeof item.end != "undefined") {
                remoteItem.end = item.end.getTime();
              };
              // this.setToRemoteTime = this.utility.now();
              this.dataRef.child(item.group).child(remoteItem.id).set(remoteItem);
            },
            writable: true,
            configurable: true
          },
          attached: {
            value: function attached() {
              var nowTimestamp = this.utility.now();
              this.startTimestamp = nowTimestamp - 1 * 60 * 60 * 1000;
              this.endTimestamp = nowTimestamp + 4 * 60 * 60 * 1000;
              this.queryEpsilon = 24 * 60 * 60 * 1000;

              // console.log(VIS().canActivate())
              var that = this;
              System["import"]("amd/vis.min").then(function (vis) {
                that.vis = vis;
                // note that months are zero-based in the JavaScript Date object, so month 3 is April
                // var items = new vis.DataSet([
                //   {id: 1, content: 'item 1', start: new Date(2013, 3, 20)},
                //   {id: 2, content: 'item 2', start: new Date(2013, 3, 14)},
                //   {id: 3, content: 'item 3', start: new Date(2013, 3, 18)},
                //   {id: 4, content: 'item 4', start: new Date(2013, 3, 16), end: new Date(2013, 3, 19)},
                //   {id: 5, content: 'item 5', start: new Date(2013, 3, 25)},
                //   {id: 6, content: 'item 6', start: new Date(2013, 3, 27)}
                // ]);

                // var min = new Date(2013, 3, 1); // 1 april
                // var max = new Date(2013, 3, 30, 23, 59, 59); // 30 april

                var container = document.getElementById("visualization");
                var options = {
                  start: that.startTimestamp,
                  end: that.endTimestamp,
                  orientation: "top",
                  editable: true,
                  snap: function snap(date, scale, step) {
                    return date;
                  },

                  order: function order(item1, item2) {
                    if (typeof item1.end != "undefined" && typeof item2.end != "undefined") {
                      return item1.start.getTime() - item1.end.getTime() - (item2.start.getTime() - item2.end.getTime());
                    } else {
                      return -1;
                    }
                  },

                  onAdd: function onAdd(item, callback) {
                    $("#timeline_modal").modal({
                      backdrop: "static"
                    });
                    $("#content").focus();
                    // that.datetimepicker.data("DateTimePicker").date(new Date());
                    item.content = "";
                    that.initDialog(item);
                    that.temp_group = item.group;
                    callback(null);
                    // item.content = prompt('Enter text content for new item:', item.content);
                    // if (item.content != null) {
                    //   that.addItem(item);
                    //   callback(item); // send back adjusted new item
                    // }
                    // else {
                    //   callback(null); // cancel item creation
                    // }
                  },

                  onMove: function onMove(item, callback) {
                    console.log("yaya: " + item.content);
                    that.moveItem(item);
                    callback(item);
                    // if (confirm('Do you really want to move the item to\n' +
                    //     'start: ' + item.start + '\n' +
                    //     'end: ' + item.end + '?')) {
                    //   callback(item); // send back item as confirmation (can be changed)
                    // }
                    // else {
                    //   callback(null); // cancel editing item
                    // }
                  },

                  onMoving: function onMoving(item, callback) {
                    console.log("wawa: " + item.content);
                    // that.moveItem(item);
                    // if (item.start < min) item.start = min;
                    // if (item.start > max) item.start = max;
                    // if (item.end   > max) item.end   = max;

                    callback(item); // send back the (possibly) changed item
                  },

                  onUpdate: function onUpdate(item, callback) {
                    item.content = prompt("Edit items text:", item.content);
                    if (item.content != null) {
                      that.updateItem(item);
                      callback(item); // send back adjusted item
                    } else {
                      callback(null); // cancel updating the item
                    }
                  },

                  onRemove: function onRemove(item, callback) {
                    if (confirm("Remove ?")) {
                      var selectedItems = that.timeline.getSelection();
                      console.log(selectedItems);
                      for (var i = 0; i < selectedItems.length; i++) {
                        var dataSet = that.timeline.itemsData.getDataSet();
                        that.removeItem(dataSet.get(selectedItems[i]));
                      };
                      // that.removeItem(item);
                      // callback(item); // confirm deletion
                    } else {
                      callback(null); // cancel deletion
                    }
                  }
                };
                // var timeline = new vis.Timeline(container, items, options);
                that.timeline = new vis.Timeline(container, new vis.DataSet([]), options);
                that.timeline.on("rangechanged", function (event) {
                  for (var i = 0; i < that.groups.length; i++) {
                    that.dataRef.child(that.groups[i].id).orderByChild("start").startAt(that.startTimestamp - that.queryEpsilon).endAt(that.endTimestamp + that.queryEpsilon).off("value");
                  }
                  that.startTimestamp = event.start.getTime();
                  that.endTimestamp = event.end.getTime();
                  that.getData();
                  console.log(event);
                });

                that.getGroups();

                // setInterval(function() {
                //   timeline.setItems(items);
                // }, 1000);

                // items.on('*', function (event, properties) {
                //   logEvent(event, properties);
                // });

                function logEvent(event, properties) {}
              });

              System["import"]("amd/bootstrap-datetimepicker").then(function () {
                that.datetimepicker = $("#datetimepicker1");
                that.datetimepicker.datetimepicker({
                  // format: 'YYYY-MM-DD HH:mm:SS',
                  format: "YYYY-MM-DD HH:mm",
                  date: new Date()
                });
              });
            },
            writable: true,
            configurable: true
          },
          deactivate: {
            value: function deactivate() {},
            writable: true,
            configurable: true
          },
          detached: {
            value: function detached() {},
            writable: true,
            configurable: true
          },
          getData: {
            value: function getData() {
              var that = this;
              for (var i = 0; i < that.groups.length; i++) {
                console.log(that.groups[i].id);
                var groupId = that.groups[i].id;
                that.dataRef.child(groupId).orderByChild("start").startAt(that.startTimestamp - that.queryEpsilon).endAt(that.endTimestamp + that.queryEpsilon).on("value", function (dataSnapshot) {
                  console.log(dataSnapshot.val());
                  if (that.utility.now() - that.setToRemoteTime < 2000) return;

                  var dataSet = that.timeline.itemsData.getDataSet();
                  var removedItemId = [];
                  dataSet.forEach(function (item) {
                    if (!dataSnapshot.hasChild(item.id)) removedItemId.push(item.id);
                  });

                  for (var i = 0; i < removedItemId.length; i++) {
                    dataSet.remove(removedItemId[i]);
                  };

                  console.log(removedItemId);

                  dataSnapshot.forEach(function (itemSnapshot) {
                    console.log(itemSnapshot.key());
                    console.log(itemSnapshot.val());
                    var id = itemSnapshot.key();
                    var oldItem = dataSet.get();
                    var newItem = itemSnapshot.val();
                    newItem.id = id;
                    newItem.group = groupId;
                    if (typeof newItem.end != "undefined") newItem.title = that.utility.millisecondsToString(newItem.end - newItem.start);
                    if (oldItem) {
                      dataSet.update(newItem);
                    } else {
                      dataSet.add(newItem);
                    }
                  });
                });
              };
            },
            writable: true,
            configurable: true
          },
          getGroups: {
            value: function getGroups() {
              var that = this;
              this.groupsRef.on("value", function (dataSnapshot) {
                that.groups = dataSnapshot.val();
                // console.log(that.timeline)
                var groups = new that.vis.DataSet([]);
                for (var i = 0; i < that.groups.length; i++) {
                  groups.add({
                    id: that.groups[i].id,
                    content: that.groups[i].content
                  });
                };
                that.timeline.setGroups(groups);
                that.getData();
              });
            },
            writable: true,
            configurable: true
          },
          initDialog: {
            value: function initDialog(item) {
              $("#content").val(item.content);
              this.datetimepicker.data("DateTimePicker").date(item.start);
              if (item.end) {
                var duration = Math.ceil((item.end - item.start) / 60000);
                $("#duration").val("" + duration);
              } else {
                $("#duration").val("0");
              }
              $("#repeat").val("1");
            },
            writable: true,
            configurable: true
          },
          moveItem: {
            value: function moveItem(item) {
              this.setToRemoteTime = this.utility.now();
              if (typeof item.end != "undefined") item.title = this.utility.millisecondsToString(item.end - item.start);
              this.dataRef.child(item.group).child(item.id).child("start").set(item.start.getTime());
              if (typeof item.end != "undefined") {
                this.dataRef.child(item.group).child(item.id).child("end").set(item.end.getTime());
              }
            },
            writable: true,
            configurable: true
          },
          onKeyDown: {
            value: function onKeyDown(event) {
              console.log(event);
            },
            writable: true,
            configurable: true
          },
          onDialogKeyDown: {
            value: function onDialogKeyDown(event) {
              if (13 == event.keyCode) {
                this.saveChanges();
              }
              return true;
            },
            writable: true,
            configurable: true
          },
          saveChanges: {
            value: function saveChanges() {
              var content = $("#content").val().trim();
              var start = this.datetimepicker.data("DateTimePicker").date().toDate();
              var durationString = $("#duration").val();
              var repeatString = $("#repeat").val();

              var duration = 0;

              if ("" != durationString) {
                duration = parseInt(durationString);
                if (isNaN(duration) || duration < 0) {
                  alert("Please input correct duration.");
                  return;
                }
              }

              if (duration == 0) {
                var item = {
                  id: this.utility.getUniqueId(),
                  group: this.temp_group,
                  content: content,
                  start: start
                };
                this.addItem(item);
              } else {
                var repeat = 0;
                if ("" != repeatString) {
                  var repeat = parseInt(repeatString);
                  if (isNaN(repeat) || repeat < 0) {
                    alert("Please input correct repeat.");
                    return;
                  }
                }

                for (var i = 0; i < repeat; i++) {
                  var item = {
                    id: this.utility.getUniqueId(),
                    group: this.temp_group,
                    content: content,
                    start: new Date(start.getTime() + i * duration * 60000),
                    end: new Date(start.getTime() + (i + 1) * duration * 60000)
                  };
                  this.addItem(item);
                };
              }

              $("#timeline_modal").modal("hide");
            },
            writable: true,
            configurable: true
          },
          updateItem: {
            value: function updateItem(item) {
              this.dataRef.child(item.group).child(item.id).child("content").set(item.content);
            },
            writable: true,
            configurable: true
          }
        });

        return Timeline;
      })());
    }
  };
});
// dataSet.remove(selectedItems[i]);

// var log = document.getElementById('log');
// var msg = document.createElement('div');
// msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
//     'properties=' + JSON.stringify(properties);
// log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
//# sourceMappingURL=data:application/json;base64,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