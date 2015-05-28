import 'firebase';
import 'jquery';
import autosize from 'jquery-autosize';
import 'bootstrap/css/bootstrap.css!';


import {Common} from './common';
import {Utility} from './utility';
import {Router} from 'aurelia-router';

export class MainWindow {
  static inject() { return [Common, Utility, Router]; }
  constructor(common, utility, router){
    this.common = common;
    this.utility = utility;
    this.router = router;

    this.frameVM = this;

    this.active_id = "";
    this.showFileManager = false;
  }

  activate(model){
    this.rootRef = new Firebase(this.common.firebase_url);
    var authData = this.rootRef.getAuth();
    if (!authData) {
      console.log("Please login!")
      return;
    }

    this.infoRef = this.groupsRef = this.rootRef.child('/info/users/' + authData.uid);

    var that = this;
    this.infoRef.on('value', function(dataSnapshot) {
      that.info = dataSnapshot.val();
      console.log(that.info)
      if (typeof that.info.mainwindow.tabs == 'undefined')
        that.info.mainwindow.tabs = [];
      var tabs = that.info.mainwindow.tabs
      console.log(tabs)
      if (that.info.mainwindow.tabs.length > 0)
        that.active_id = that.info.mainwindow.tabs[0].id;
      for (var i = 0; i < that.info.mainwindow.tabs.length; i++) {
        that.rootRef.child('notes').child('users')
            .child(authData.uid).child('files')
            .child(that.info.mainwindow.tabs[i].id).child('meta')
            .on('value', function(metaSnapshot) {
              console.log(metaSnapshot.val())
              for (var i = 0; i < that.info.mainwindow.tabs.length; i++) {
                var meta = metaSnapshot.val();
                if (that.info.mainwindow.tabs[i].id == meta.id) {
                  if (that.info.mainwindow.tabs[i].type != meta.type)
                    that.info.mainwindow.tabs[i].type = meta.type;
                  if (that.info.mainwindow.tabs[i].name != meta.name)
                    that.info.mainwindow.tabs[i].name = meta.name;
                  break;
                }
              };
            })
        that.info[i];
      };
    })
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
      this.info.mainwindow.tabs.push(meta);
    }
    this.active_id = meta.id;
  }

  openFileManager() {
    this.showFileManager = !this.showFileManager;
  }

  onSwitchTab(event) {
    console.log(event)
    var id = event.target.id.slice(4)
    if (this.active_id != id) {
      this.active_id = id;
      console.log(id)
      setTimeout(function() {
        var taList = $('#page-'+id).find("textarea");
        console.log(taList)
        for (var i = 0; i < taList.length; i++) {
          taList[i].removeAttribute('data-autosize-on');
          autosize(taList[i]);
        };
      }, 10);
    }
    
  }
}