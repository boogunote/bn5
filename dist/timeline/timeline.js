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
              if (typeof item.end != "undefined") item.title = this.utility.millisecondsToString(item.end - item.start);
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

                  order: function order(item1, item2) {
                    if (typeof item1.end != "undefined" && typeof item2.end != "undefined") {
                      return item1.start.getTime() - item1.end.getTime() - (item2.start.getTime() - item2.end.getTime());
                    } else {
                      return -1;
                    }
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
          moveItem: {
            value: function moveItem(item) {
              if (typeof item.end != "undefined") item.title = this.utility.millisecondsToString(item.end - item.start);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWVsaW5lL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7TUFBUSxNQUFNLEVBQ04sT0FBTyxpQ0FHRixRQUFROzs7O0FBSmIsWUFBTSxXQUFOLE1BQU07O0FBQ04sYUFBTyxZQUFQLE9BQU87Ozs7Ozs7Ozs7O0FBR0YsY0FBUTtBQUVSLGlCQUZBLFFBQVEsQ0FFUCxNQUFNLEVBQUUsT0FBTyxFQUFFO2dDQUZsQixRQUFROztBQUdqQixjQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixjQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUN4Qjs7cUJBTFUsUUFBUTtBQU9uQixrQkFBUTttQkFBQSxrQkFBQyxLQUFLLEVBQUM7QUFDYixrQkFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RELGtCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3RDLGtCQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsdUJBQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUE7QUFDNUIsdUJBQU87ZUFDUjs7QUFFRCxrQkFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQ25GLGtCQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUM7O0FBRS9FLGtCQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzthQUNsQjs7QUFFRCxvQkFBVTttQkFBQSxvQkFBQyxJQUFJLEVBQUU7QUFDZixrQkFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFDLHFCQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2pCLGtCQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUN4RDs7QUFFRCxpQkFBTzttQkFBQSxpQkFBQyxJQUFJLEVBQUU7QUFDWixrQkFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLElBQUksV0FBVyxFQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEUsa0JBQUksVUFBVSxHQUFHO0FBQ2Ysa0JBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtBQUNYLHVCQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDckIscUJBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtlQUM1QixDQUFBO0FBQ0Qsa0JBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxJQUFJLFdBQVcsRUFBRTtBQUNsQywwQkFBVSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO2VBQ3JDLENBQUM7QUFDRixrQkFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFDLGtCQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDckU7O0FBRUQsa0JBQVE7bUJBQUEsb0JBQUc7QUFDVCxrQkFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN0QyxrQkFBSSxDQUFDLGNBQWMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxHQUFDLEVBQUUsR0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDO0FBQ2xELGtCQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksR0FBRyxDQUFDLEdBQUMsRUFBRSxHQUFDLEVBQUUsR0FBQyxJQUFJLENBQUM7QUFDaEQsa0JBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxHQUFDLEVBQUUsR0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDOzs7QUFHbEMsa0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixvQkFBTSxVQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUMsR0FBRyxFQUFLO0FBQzFDLG9CQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFjYixvQkFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6RCxvQkFBSSxPQUFPLEdBQUc7QUFDWix1QkFBSyxFQUFFLElBQUksQ0FBQyxjQUFjO0FBQzFCLHFCQUFHLEVBQUUsSUFBSSxDQUFDLFlBQVk7QUFDdEIsNkJBQVcsRUFBRSxLQUFLO0FBQ2xCLDBCQUFRLEVBQUUsSUFBSTtBQUNkLHNCQUFJLEVBQUUsY0FBVSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNqQywyQkFBTyxJQUFJLENBQUM7bUJBQ2I7O0FBRUQsdUJBQUssRUFBRSxlQUFTLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDNUIsd0JBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxJQUFJLFdBQVcsSUFBSSxPQUFPLEtBQUssQ0FBQyxHQUFHLElBQUksV0FBVyxFQUFFO0FBQ3RFLDZCQUFPLEFBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQSxBQUFDLENBQUM7cUJBQ2xHO0FBQ0MsNkJBQU8sQ0FBQyxDQUFDLENBQUM7cUJBQUE7bUJBQ2I7O0FBRUQsdUJBQUssRUFBRSxlQUFVLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDL0Isd0JBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLGtDQUFrQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4RSx3QkFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRTtBQUN4QiwwQkFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQiw4QkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNoQixNQUNJO0FBQ0gsOEJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDaEI7bUJBQ0Y7O0FBRUQsd0JBQU0sRUFBRSxnQkFBVSxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ2hDLHdCQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BCLDRCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7Ozs7OzttQkFTaEI7O0FBRUQsMEJBQVEsRUFBRSxrQkFBVSxJQUFJLEVBQUUsUUFBUSxFQUFFOzs7OztBQUtsQyw0QkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO21CQUNoQjs7QUFFRCwwQkFBUSxFQUFFLGtCQUFVLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDbEMsd0JBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4RCx3QkFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRTtBQUN4QiwwQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0Qiw4QkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNoQixNQUNJO0FBQ0gsOEJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDaEI7bUJBQ0Y7O0FBRUQsMEJBQVEsRUFBRSxrQkFBVSxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ2xDLHdCQUFJLE9BQU8sQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsRUFBRTtBQUNoRCwwQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0Qiw4QkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNoQixNQUNJO0FBQ0gsOEJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDaEI7bUJBQ0Y7aUJBQ0YsQ0FBQzs7QUFFRixvQkFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxRSxvQkFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLFVBQVMsS0FBSyxFQUFFO0FBQy9DLHVCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDM0Msd0JBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUN0RCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQzlDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FDMUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO21CQUNuQjtBQUNELHNCQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDNUMsc0JBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN4QyxzQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2YseUJBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3BCLENBQUMsQ0FBQTs7QUFFRixvQkFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDOzs7Ozs7Ozs7O0FBYWpCLHlCQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBTXBDO2VBQ0osQ0FBQyxDQUFDO2FBQ0o7O0FBRUQsb0JBQVU7bUJBQUEsc0JBQUcsRUFDWjs7QUFFRCxrQkFBUTttQkFBQSxvQkFBRyxFQUNWOztBQUVELGlCQUFPO21CQUFBLG1CQUFHO0FBQ1Isa0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixtQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNDLHVCQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDOUIsb0JBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ2hDLG9CQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQzVDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FDOUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUMxQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVMsWUFBWSxFQUFFO0FBQ3RDLHlCQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLHNCQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLEVBQUUsT0FBTzs7QUFFN0Qsc0JBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ25ELHNCQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDdkIseUJBQU8sQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJLEVBQUU7QUFDN0Isd0JBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzttQkFDbEUsQ0FBQyxDQUFBOztBQUVGLHVCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM3QywyQkFBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTttQkFDakMsQ0FBQzs7QUFFRix5QkFBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTs7QUFFMUIsOEJBQVksQ0FBQyxPQUFPLENBQUMsVUFBUyxZQUFZLEVBQUU7QUFDMUMsMkJBQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUE7QUFDL0IsMkJBQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUE7QUFDL0Isd0JBQUksRUFBRSxHQUFHLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM1Qix3QkFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzVCLHdCQUFJLE9BQU8sR0FBRyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDaEMsMkJBQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLDJCQUFPLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUN4Qix3QkFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLElBQUksV0FBVyxFQUNuQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakYsd0JBQUksT0FBTyxFQUFFO0FBQ1gsNkJBQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7cUJBQ3hCLE1BQU07QUFDTCw2QkFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDdEI7bUJBQ0YsQ0FBQyxDQUFBO2lCQUNILENBQUMsQ0FBQTtlQUNILENBQUM7YUFFSDs7QUFFRCxtQkFBUzttQkFBQSxxQkFBRztBQUNWLGtCQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsa0JBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFTLFlBQVksRUFBRTtBQUNoRCxvQkFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRWpDLG9CQUFJLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3RDLHFCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDM0Msd0JBQU0sQ0FBQyxHQUFHLENBQUM7QUFDVCxzQkFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNyQiwyQkFBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTzttQkFDaEMsQ0FBQyxDQUFBO2lCQUNILENBQUM7QUFDRixvQkFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEMsb0JBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztlQUNoQixDQUFDLENBQUE7YUFDSDs7QUFFRCxrQkFBUTttQkFBQSxrQkFBQyxJQUFJLEVBQUU7QUFDYixrQkFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLElBQUksV0FBVyxFQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEUsa0JBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZGLGtCQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsSUFBSSxXQUFXLEVBQUU7QUFDbEMsb0JBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2VBQ3BGO2FBQ0Y7O0FBRUQsb0JBQVU7bUJBQUEsb0JBQUMsSUFBSSxFQUFFO0FBQ2Ysa0JBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2xGOzs7QUEzUE0sZ0JBQU07bUJBQUEsa0JBQUc7QUFBRSxxQkFBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzthQUFFOzs7O2VBRGxDLFFBQVEiLCJmaWxlIjoidGltZWxpbmUvdGltZWxpbmUuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==