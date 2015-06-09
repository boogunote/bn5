import 'firebase';
import 'jquery';
import autosize from 'jquery-autosize';
import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';


import {Common} from './common';
import {Utility} from './utility';
import {Router} from 'aurelia-router';

export class Main {
  static inject() { return [Common, Utility, Router]; }
  constructor(common, utility, router){
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

  activate(model){
    this.rootRef = new Firebase(this.common.firebase_url);
    var authData = this.rootRef.getAuth();
    if (!authData) {
      console.log("Please login!")
      return;
    }

    var tempList = authData.uid.split(':')
    this.user_id = tempList[tempList.length-1];

    this.infoRef = this.groupsRef = this.rootRef.child('/info/users/' + authData.uid);

    var that = this;
    this.infoRef.on('value', function(dataSnapshot) {
      if (that.utility.now() < that.lockTime) return;

      that.info = dataSnapshot.val();
      console.log(that.info)
      if (typeof that.info.mainwindow == 'undefined')
        that.info.mainwindow = {}
      if (typeof that.info.mainwindow.tabs == 'undefined')
        that.info.mainwindow.tabs = [];
      // copy to local tab list
      for (var i = 0; i < that.info.mainwindow.tabs.length; i++) {
        that.localTabList.push({id: that.info.mainwindow.tabs[i].id});
      };
      
      if (that.info.mainwindow.tabs.length > 0) {
        that.active_id = that.info.mainwindow.tabs[0].id;
        // this line should be commented out. first activated page also needs resize.
        // that.info.mainwindow.tabs[0].resized = true;
      }
      for (var i = 0; i < that.info.mainwindow.tabs.length; i++) {
        that.rootRef.child('notes').child('users')
            .child(authData.uid).child('files')
            .child(that.info.mainwindow.tabs[i].id).child('meta')
            .on('value', function(metaSnapshot) {
              console.log(metaSnapshot.val())
              var meta = metaSnapshot.val();
              for (var i = 0; i < that.info.mainwindow.tabs.length; i++) {
                if (that.info.mainwindow.tabs[i].id == meta.id) {
                  if (that.info.mainwindow.tabs[i].type != meta.type)
                    that.info.mainwindow.tabs[i].type = meta.type;
                  if (that.info.mainwindow.tabs[i].name != meta.name)
                    that.info.mainwindow.tabs[i].name = meta.name;
                  break;
                }
              };

              for (var i = 0; i < that.localTabList.length; i++) {
                if (that.localTabList[i].id == meta.id) {
                  if (that.localTabList[i].type != meta.type)
                    that.localTabList[i].type = meta.type;
                  if (that.localTabList[i].name != meta.name)
                    that.localTabList[i].name = meta.name;
                  break;
                }
                
              };
            })
        that.info[i];
      };
    })
  }

  close(event) {
    var index = -1;
    for (var i = 0; i < this.info.mainwindow.tabs.length; i++) {
      if (this.info.mainwindow.tabs[i].id == event.target.file_id) {
        index = i;
        break;
      }
    };
    if (-1 != index) {
      this.info.mainwindow.tabs.splice(index,1);
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

  open(meta) {
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
    setTimeout(function() {
      that.active_id = meta.id;
    }, 10);

    this.setRemoteData();
  }

  toggleFileManager() {
    this.showFileManager = !this.showFileManager;
  }

  toggleTimeline() {
    this.showTimeline = !this.showTimeline;
  }

  onSwitchTab(event) {
    console.log(event)
    var id = event.target.file_id
    if (this.active_id != id) {
      this.active_id = id;
      console.log(id)
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

  resizeAllTextareas(id) {
    console.log("resizeAllTextareas")
    setTimeout(function() {
      var taList = $('#page-'+id).find("textarea");
      // console.log(taList)
      for (var i = 0; i < taList.length; i++) {
        taList[i].removeAttribute('data-autosize-on');
        if ($(taList).hasClass("tree-textarea-fold")) {
          // var evt = document.createEvent('Event');
          // evt.initEvent('autosize.destroy', true, false);
          // taList[i].dispatchEvent(evt);
          // autosize(taList[i]);
          taList[i].style.height = "24px";//taList[i].scrollHeight+"px";
        } else {
          autosize(taList[i]);
        }
      };
    }, 0);
  }

  setRemoteData() {
    var list = []
    for (var i = 0; i < this.info.mainwindow.tabs.length; i++) {
      var item = {
        id: this.info.mainwindow.tabs[i].id
      }
      list.push(item);
    };

    this.infoRef.child('mainwindow/tabs').set(list);
    this.lockTime = this.utility.now() + 5*1000;
  }

  showModalDialog() {
    
  }
}