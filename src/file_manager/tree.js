import {Common} from '../common';
import {Node} from './node';
import {Utility} from '../utility';

export class Tree extends Node{
  static inject() { return [Common, Element, Utility]; }
  constructor(common, element, utility){
    super();
    this.common = common;
    this.element = element;
    this.utility = utility;

    this.treeVM = this;
    this.node = null;
    this.dirNodesRef = null;
    this.filesRef = null;

    this.editing = false;
    this.updating = false;
    this.localChangedTime = 0;
    this.setToRemoteTime = 0;
    this.receiveRemoteTime = 0;
    this.localChangeWaitTime = 200;
    this.localChangeWaitEpsilon = 10;
    this.remoteChangeWaitTime = 1000;
    this.remoteChangeWaitEpsilon = 50;
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

    var dirNodesPath = '/notes/users/' + authData.uid + '/directories/nodes';
    this.dirNodesRef = ref.child(dirNodesPath);
    var that = this;
    this.dirNodesRef.child('root').on('value', function(dataSnapshot) {
      if (that.treeVM.editing) return;
      // console.log("dataSnapshot.val()")
      that.node = dataSnapshot.val();
      // console.log(that.node)
    });
  }
}