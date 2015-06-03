import {Common} from '../common'
import {Utility} from '../utility';
import 'jquery';
import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

export class Timeline{
  static inject() { return [Common, Utility]; }
  constructor(common, utility) {
    this.common = common;
    this.utility = utility;
  }

  activate(model){
    this.rootRef = new Firebase(this.common.firebase_url);
    var authData = this.rootRef.getAuth();
    if (!authData) {
      console.log("Please login!")
      return;
    }

    this.groupsRef = this.rootRef.child('/timeline/users/' + authData.uid + '/groups');
    this.dataRef = this.rootRef.child('/timeline/users/' + authData.uid + '/data');

    this.groups = [];
  }

  removeItem(item) {
    // this.setToRemoteTime = this.utility.now();
    console.log(item)
    this.dataRef.child(item.group).child(item.id).remove();
  }

  addItem(item) {
    if (typeof item.end != "undefined")
      item.title = this.utility.millisecondsToString(item.end - item.start);
    var remoteItem = {
      id: item.id,
      content: item.content,
      start: item.start.getTime()
    }
    if (typeof item.end != "undefined") {
      remoteItem.end = item.end.getTime();
    };
    // this.setToRemoteTime = this.utility.now();
    this.dataRef.child(item.group).child(remoteItem.id).set(remoteItem);
  }

  attached() {
    var nowTimestamp = this.utility.now();
    this.startTimestamp = nowTimestamp - 1*60*60*1000;
    this.endTimestamp = nowTimestamp + 4*60*60*1000;
    this.queryEpsilon = 24*60*60*1000;

        // console.log(VIS().canActivate())
    var that = this;
    System.import('amd/vis.min').then( (vis) => {
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

        var container = document.getElementById('visualization');
        var options = {
          start: that.startTimestamp,
          end: that.endTimestamp,
          orientation: "top",
          editable: true,
          snap: function (date, scale, step) {
            return date;
          },

          order: function(item1, item2) {
            if (typeof item1.end != "undefined" && typeof item2.end != "undefined") {
              return (item1.start.getTime()-item1.end.getTime()) - (item2.start.getTime()-item2.end.getTime());
            } else
              return -1;
          },

          onAdd: function (item, callback) {
            $('#timeline_modal').modal({
              backdrop: 'static'
            });
            $('#content').focus();
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

          onMove: function (item, callback) {
            console.log("yaya: "+item.content)
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

          onMoving: function (item, callback) {
            console.log("wawa: "+item.content)
            // that.moveItem(item);
            // if (item.start < min) item.start = min;
            // if (item.start > max) item.start = max;
            // if (item.end   > max) item.end   = max;

            callback(item); // send back the (possibly) changed item
          },

          onUpdate: function (item, callback) {
            item.content = prompt('Edit items text:', item.content);
            if (item.content != null) {
              that.updateItem(item);
              callback(item); // send back adjusted item
            }
            else {
              callback(null); // cancel updating the item
            }
          },

          onRemove: function (item, callback) {
            if (confirm('Remove ?')) {
              var selectedItems = that.timeline.getSelection()
              console.log(selectedItems)
              for (var i = 0; i < selectedItems.length; i++) {
                var dataSet = that.timeline.itemsData.getDataSet();
                that.removeItem(dataSet.get(selectedItems[i]))
                // dataSet.remove(selectedItems[i]);
              };
              // that.removeItem(item);
              // callback(item); // confirm deletion
            }
            else {
              callback(null); // cancel deletion
            }
          }
        };
        // var timeline = new vis.Timeline(container, items, options);
        that.timeline = new vis.Timeline(container, new vis.DataSet([]), options);
        that.timeline.on("rangechanged", function(event) {
          for (var i = 0; i < that.groups.length; i++) {
            that.dataRef.child(that.groups[i].id).orderByChild("start")
                .startAt(that.startTimestamp-that.queryEpsilon)
                .endAt(that.endTimestamp+that.queryEpsilon)
                .off("value");
          }
          that.startTimestamp = event.start.getTime();
          that.endTimestamp = event.end.getTime();
          that.getData();
          console.log(event);
        })

        that.getGroups();


        // setInterval(function() {
        //   timeline.setItems(items);
        // }, 1000);

        // items.on('*', function (event, properties) {
        //   logEvent(event, properties);
        // });

        function logEvent(event, properties) {
          // var log = document.getElementById('log');
          // var msg = document.createElement('div');
          // msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
          //     'properties=' + JSON.stringify(properties);
          // log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
        }
    });
    

    System.import('amd/bootstrap-datetimepicker').then( () => {
      that.datetimepicker = $('#datetimepicker1');
      that.datetimepicker.datetimepicker({
        // format: 'YYYY-MM-DD HH:mm:SS',
        format: 'YYYY-MM-DD HH:mm',
        date: new Date()
      });
    });
  }

  deactivate() {
  }

  detached() {
  }

  getData() {
    var that = this;
    for (var i = 0; i < that.groups.length; i++) {
      console.log(that.groups[i].id)
      var groupId = that.groups[i].id;
      that.dataRef.child(groupId).orderByChild("start")
          .startAt(that.startTimestamp-that.queryEpsilon)
          .endAt(that.endTimestamp+that.queryEpsilon)
          .on("value", function(dataSnapshot) {
        console.log(dataSnapshot.val());
        if (that.utility.now() - that.setToRemoteTime < 2000) return;

        var dataSet = that.timeline.itemsData.getDataSet();
        var removedItemId = [];
        dataSet.forEach(function(item) {
          if (!dataSnapshot.hasChild(item.id)) removedItemId.push(item.id);
        })

        for (var i = 0; i < removedItemId.length; i++) {
          dataSet.remove(removedItemId[i])
        };

        console.log(removedItemId)
        
        dataSnapshot.forEach(function(itemSnapshot) {
          console.log(itemSnapshot.key())
          console.log(itemSnapshot.val())
          var id = itemSnapshot.key();
          var oldItem = dataSet.get();
          var newItem = itemSnapshot.val()
          newItem.id = id;
          newItem.group = groupId;
          if (typeof newItem.end != "undefined")
            newItem.title = that.utility.millisecondsToString(newItem.end - newItem.start);
          if (oldItem) {
            dataSet.update(newItem)
          } else {
            dataSet.add(newItem);
          }
        })
      })
    };
    
  }

  getGroups() {
    var that = this;
    this.groupsRef.on("value", function(dataSnapshot) {
      that.groups = dataSnapshot.val();
      // console.log(that.timeline)
      var groups = new that.vis.DataSet([]);
      for (var i = 0; i < that.groups.length; i++) {
        groups.add({
          id: that.groups[i].id,
          content: that.groups[i].content
        }) 
      };
      that.timeline.setGroups(groups);
      that.getData();
    })
  }

  initDialog(item) {
    $('#content').val(item.content);
    this.datetimepicker.data("DateTimePicker").date(item.start);
    if (item.end) {
      var duration = Math.ceil((item.end - item.start)/60000.0);
      $('#duration').val(''+duration);
    } else {
      $('#duration').val('0');
    }
    $('#repeat').val('1');
  }

  moveItem(item) {
    this.setToRemoteTime = this.utility.now();
    if (typeof item.end != "undefined")
      item.title = this.utility.millisecondsToString(item.end - item.start);
    this.dataRef.child(item.group).child(item.id).child("start").set(item.start.getTime());
    if (typeof item.end != "undefined") {
      this.dataRef.child(item.group).child(item.id).child("end").set(item.end.getTime());
    }
  }

  onKeyDown(event) {
    console.log(event)
  }

  onDialogKeyDown(event) {
    if (13 == event.keyCode) {
      this.saveChanges();
    }
    return true;
  }

  saveChanges() {
    var content = $('#content').val().trim();
    var start = this.datetimepicker.data("DateTimePicker").date().toDate()
    var durationString = $('#duration').val();
    var repeatString = $('#repeat').val();

    var duration = 0;

    if ('' != durationString) {
      duration = parseInt(durationString)
      if (isNaN(duration) || duration < 0) {
        alert("Please input correct duration.")
        return;
      }
    }

    if (duration == 0) {
      var item = {
        id: this.utility.getUniqueId(),
        group: this.temp_group,
        content: content,
        start: start
      }
      this.addItem(item);
    } else {
      var repeat = 0;
      if ('' != repeatString) {
        var repeat = parseInt(repeatString)
        if (isNaN(repeat) || repeat < 0) {
          alert("Please input correct repeat.")
          return;
        }
      }

      for (var i = 0; i < repeat; i++) {
        var item = {
          id: this.utility.getUniqueId(),
          group: this.temp_group,
          content: content,
          start: new Date(start.getTime() + i*duration*60000),
          end: new Date(start.getTime() + (i+1)*duration*60000)
        }
        this.addItem(item);
      };
    }
    

    
    $('#timeline_modal').modal('hide');
  }

  updateItem(item) {
    this.dataRef.child(item.group).child(item.id).child("content").set(item.content);
  }
}