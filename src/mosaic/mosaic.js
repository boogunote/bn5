import {Utility} from '../utility';
import {Common} from '../common';
import {Node} from './node';

export class Mosaic extends Node{
  static inject() { return [Common, Utility]; }
  constructor(common, utility){
    this.common = common;
    this.utility = utility;

    this.file = null;
    this.rootVM = this;

    this.editing = false;
    this.updating = false;
    this.localChangedTime = 0;
    this.setToRemoteTime = 0;
    this.receiveRemoteTime = 0;
    this.localChangeWaitTime = 2000;
    this.localChangeWaitEpsilon = 10;
    this.remoteChangeWaitTime = 1000;
    this.remoteChangeWaitEpsilon = 50;

    // this.file = {
    //   rows: [
    //     {
    //       id: "1",
    //       height: 500,
    //       tiles: [
    //         {
    //           id: "1",
    //           flex: 1,
    //           url: "http://www.baidu.com"
    //         },
    //         {
    //           id: "2",
    //           flex: 2,
    //           url: "http://www.sina.com.cn"
    //         },
    //         {
    //           id: "3",
    //           flex: 1,
    //           url: "http://www.aol.com"
    //         }
    //       ]
    //     }
    //   ]
    // }
  }

  activate(params){
    this.file_id = params.file_id;
    if ('online' == params.type) {
      this.rootRef = new Firebase(this.common.firebase_url);
      var authData = this.rootRef.getAuth();
      if (!authData) {
        console.log("Please login!")
        return;
      }
      this.fileRef = this.rootRef.child('/notes/users/' + authData.uid +
        '/files/' + this.file_id);

      var that = this;
      this.fileRef.on('value', function(dataSnapshot) {
         console.log("dataSnapshot.val() " + that.rootVM.editing)
        if (that.rootVM.editing) return;
        // console.log("dataSnapshot.val()")
        var file = dataSnapshot.val()
        // console.log(that.file);
        if (file) {
          if (!file.rows) file.rows = [];
          for (var i = 0; i < file.rows.length; i++) {
            if (!file.rows[i].tiles) file.rows[i].tiles = [];
            // for (var j = 0; j < that.file.rows[i].tiles.length; j++) {
            //   that.file.rows[i].tiles[j]
            // };
          };
          that.file = file;
        }
      });
    }
  }

  newRow() {
    var row = {
      height: 500,
      id: this.utility.getUniqueId(),
      tiles: [
        {
          id: this.utility.getUniqueId(),
          url:"",
          flex: 1
        }
      ]
    }
    this.file.rows.push(row);
    this.updateFile();
  }

  removeRow(id) {
    var position = -1;
    for (var i = 0; i < this.file.rows.length; i++) {
      if(id == this.file.rows[i].id) {
        position = i;
        break;
      }
    };
    this.file.rows.splice(position, 1);
    this.updateFile();
  }

  updateFile() {
    var that = this;
    this.doEdit(function() {
      that.fileRef.set(that.getCleanMosaic(that.file));
    })
  }
}