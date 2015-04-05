import {Common} from '../common';
import {Node} from '../node';
import {Utility} from '../utility';

export class Tree extends Node{
  static inject() { return [Common, Element, Utility]; }
  constructor(common, element, utility){
    this.common = common;
    this.element = element;
    this.utility = utility;

    this.treeVM = this;
    this.node = null;
    this.dirRootRef = null;
    this.filesRef = null;
  }

  activate(params, queryString, routeConfig) {
    console.log('activate');
    var ref = new Firebase(this.common.firebase_url);
    var authData = ref.getAuth();
    if (!authData) {
      console.log("Please login!")
      return;
    }

    var filesPath = '/notes/users/' + authData.uid + '/files';
    this.filesRef = ref.child(filesPath);

    var rootPath = '/notes/users/' + authData.uid + '/directories/root';
    this.dirRootRef = ref.child(rootPath);
    var that = this;
    this.dirRootRef.on('value', function(dataSnapshot) {
      // console.log("dataSnapshot.val()")
      that.node = dataSnapshot.val()
      // console.log(that.node)
    });
  }
}