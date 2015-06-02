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
              this.setToRemoteTime = this.utility.now();
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
              this.startTimestamp = nowTimestamp - 3 * 60 * 60 * 1000;
              this.endTimestamp = nowTimestamp + 9 * 60 * 60 * 1000;
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
                    if (confirm("Remove item " + item.content + "?")) {
                      that.removeItem(item);
                      callback(item); // confirm deletion
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

// var log = document.getElementById('log');
// var msg = document.createElement('div');
// msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
//     'properties=' + JSON.stringify(properties);
// log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
//# sourceMappingURL=data:application/json;base64,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LENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEdBQUUsUUFBUSxHQUFDLEtBQUssQ0FBQzttQkFDdEQsQ0FBQTtBQUNELHNCQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNwQixDQUFDO2VBQ0g7O0FBSUQsZUFBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3BDOzs7O0FBRUQsb0JBQVU7bUJBQUEsb0JBQUMsSUFBSSxFQUFFO0FBQ2Ysa0JBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2xGOzs7Ozs7ZUEvVVUsUUFBUSIsImZpbGUiOiJ0aW1lbGluZS90aW1lbGluZS5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9