System.register(["../common", "../utility"], function (_export) {
  var Common, Utility, _createClass, _classCallCheck, Timeline;

  return {
    setters: [function (_common) {
      Common = _common.Common;
    }, function (_utility) {
      Utility = _utility.Utility;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      // import {VIS} from './vis'

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
              this.setToRemoteTime = this.utility.now();
              console.log(item);
              this.dataRef.child(item.group).child(item.id).remove();
            }
          },
          addItem: {
            value: function addItem(item) {
              var remoteItem = {
                id: item.id,
                content: item.content,
                start: item.start.getTime()
              };
              if (typeof item.end != "undefined") {
                remoteItem.end = item.end.getTime();
              };
              this.setToRemoteTime = this.utility.now();
              this.dataRef.child(item.group).child(remoteItem.id).set(remoteItem);
            }
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

                  onAdd: function onAdd(item, callback) {
                    item.content = prompt("Enter text content for new item:", item.content);
                    if (item.content != null) {
                      that.addItem(item);
                      callback(item); // send back adjusted new item
                    } else {
                      callback(null); // cancel item creation
                    }
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
          moveItem: {
            value: function moveItem(item) {
              this.dataRef.child(item.group).child(item.id).child("start").set(item.start.getTime());
              if (typeof item.end != "undefined") {
                this.dataRef.child(item.group).child(item.id).child("end").set(item.end.getTime());
              }
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

// var log = document.getElementById('log');
// var msg = document.createElement('div');
// msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
//     'properties=' + JSON.stringify(properties);
// log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
//# sourceMappingURL=data:application/json;base64,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