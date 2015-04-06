import {Utility} from './utility';
import {Common} from './common'

export class Tree{
  static inject() { return [Common, Utility]; }
  constructor(common, utility){
    this.common = common;
    this.utility = utility;

    this.file_id = null;
    this.root_id = null;
    this.file = null;
    this.title = null;
    this.fileRef = null;
    this.nodesRef = null;

    this.filePath = null;
  }

  activate(params, queryString, routeConfig) {
    console.log('activate');
    this.file_id = params.file_id;
    this.root_id = params.root_id;
    this.rootRef = new Firebase(this.common.firebase_url);
    var authData = this.rootRef.getAuth();
    if (!authData) {
      console.log("Please login!")
      return;
    }
    this.fileRef = this.rootRef.child('/notes/users/' + authData.uid +
      '/files/' + this.file_id);
    this.nodesRef = this.fileRef.child("nodes");

    // console.log("params")
    // console.log(params)
    if ('online' == params.type) {
      var ref = new Firebase(this.common.firebase_url);
      var authData = ref.getAuth();
      if (!authData) {
        console.log("Please login!")
        return;
      }
      var filePath = '/notes/users/' + authData.uid +
          '/files/' + this.file_id;
      var fileRef = ref.child(filePath);
      var that = this;
      fileRef.once('value', function(dataSnapshot) {
        // console.log("dataSnapshot.val()")
        that.file = dataSnapshot.val()
        // console.log(that.file);
        if (that.file) {
          that.root = that.file.nodes.root;
          that.file_id = that.file.meta.id;
          console.log(that.root)
          console.log(that.file_id)
          // that.loadNodeFromLocalCache(that.root_id);
          // that.loadTitle(that.root_id);
        }
      });
      // this.loadNodeDataById(this.file_id, this.root_id);
    }
  }
}