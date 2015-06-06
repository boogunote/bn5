System.register(["../common", "../utility", "jquery", "bootstrap", "bootstrap/css/bootstrap.css!"], function (_export) {
  var Common, Utility, _createClass, _classCallCheck, Timeline;

  return {
    setters: [function (_common) {
      Common = _common.Common;
    }, function (_utility) {
      Utility = _utility.Utility;
    }, function (_jquery) {}, function (_bootstrap) {}, function (_bootstrapCssBootstrapCss) {}],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Timeline = _export("Timeline", (function () {
        function Timeline(common, utility) {
          _classCallCheck(this, Timeline);

          this.common = common;
          this.utility = utility;
        }

        _createClass(Timeline, {
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
            }
          },
          removeItem: {
            value: function removeItem(item) {
              // this.setToRemoteTime = this.utility.now();
              console.log(item);
              this.dataRef.child(item.group).child(item.id).remove();
            }
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
            }
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
            }
          },
          deactivate: {
            value: function deactivate() {}
          },
          detached: {
            value: function detached() {}
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
            }
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
            }
          },
          initDialog: {
            value: function initDialog(item) {
              $("#content").val(item.content);
              this.datetimepicker.data("DateTimePicker").date(item.start);
              if (item.end) {
                var duration = (item.end - item.start) / 60000;
                if (duration < 1) {
                  duration = 1;
                };
                duration = Math.floor(duration);
                $("#duration").val("" + duration);
              } else {
                $("#duration").val("0");
              }
              $("#repeat").val("1");
            }
          },
          moveItem: {
            value: function moveItem(item) {
              this.setToRemoteTime = this.utility.now();
              if (typeof item.end != "undefined") item.title = this.utility.millisecondsToString(item.end - item.start);
              this.dataRef.child(item.group).child(item.id).child("start").set(item.start.getTime());
              if (typeof item.end != "undefined") {
                this.dataRef.child(item.group).child(item.id).child("end").set(item.end.getTime());
              }
            }
          },
          onKeyDown: {
            value: function onKeyDown(event) {
              console.log(event);
            }
          },
          onDialogKeyDown: {
            value: function onDialogKeyDown(event) {
              if (13 == event.keyCode) {
                this.saveChanges();
              }
              return true;
            }
          },
          saveChanges: {
            value: function saveChanges() {
              var content = $("#content").val().trim();
              var start = this.datetimepicker.data("DateTimePicker").date().toDate();
              start = new Date(Math.floor(start.getTime() / (60 * 1000)) * (60 * 1000));
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
            }
          },
          updateItem: {
            value: function updateItem(item) {
              this.dataRef.child(item.group).child(item.id).child("content").set(item.content);
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [Common, Utility];
            }
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
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxXQUFXLEVBQUU7QUFDOUIsdUJBQUssRUFBRSxJQUFJLENBQUMsVUFBVTtBQUN0Qix5QkFBTyxFQUFFLE9BQU87QUFDaEIsdUJBQUssRUFBRSxLQUFLO2lCQUNiLENBQUE7QUFDRCxvQkFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztlQUNwQixNQUFNO0FBQ0wsb0JBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNmLG9CQUFJLEVBQUUsSUFBSSxZQUFZLEVBQUU7QUFDdEIsc0JBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNuQyxzQkFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMvQix5QkFBSyxDQUFDLDhCQUE4QixDQUFDLENBQUE7QUFDckMsMkJBQU87bUJBQ1I7aUJBQ0Y7O0FBRUQscUJBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDL0Isc0JBQUksSUFBSSxHQUFHO0FBQ1Qsc0JBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtBQUM5Qix5QkFBSyxFQUFFLElBQUksQ0FBQyxVQUFVO0FBQ3RCLDJCQUFPLEVBQUUsT0FBTztBQUNoQix5QkFBSyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEdBQUMsUUFBUSxHQUFDLEtBQUssQ0FBQztBQUNuRCx1QkFBRyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUEsR0FBRSxRQUFRLEdBQUMsS0FBSyxDQUFDO21CQUN0RCxDQUFBO0FBQ0Qsc0JBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3BCLENBQUM7ZUFDSDs7QUFJRCxlQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDcEM7O0FBRUQsb0JBQVU7bUJBQUEsb0JBQUMsSUFBSSxFQUFFO0FBQ2Ysa0JBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2xGOzs7QUFwV00sZ0JBQU07bUJBQUEsa0JBQUc7QUFBRSxxQkFBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzthQUFFOzs7O2VBRGxDLFFBQVEiLCJmaWxlIjoidGltZWxpbmUvdGltZWxpbmUuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==