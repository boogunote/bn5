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

    this.rootVM = this;
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

    this.selectedVMList = [];
    this.clippedVMList = [];
    this.clipping = false;
  }

  activate(params, queryString, routeConfig) {
    console.log('activate');
    var ref = new Firebase(this.common.firebase_url);
    var authData = ref.getAuth();
    if (!authData) {
      console.log("Please login!")
      return;
    }

    this.user_id = params.user_id;

    var filesPath = '/notes/users/' + this.utility.getRealUserId(this.user_id) + '/files';
    this.filesRef = ref.child(filesPath);

    var dirNodesPath = '/notes/users/' + this.utility.getRealUserId(this.user_id) + '/directories/nodes';
    this.dirNodesRef = ref.child(dirNodesPath);
    var that = this;
    this.dirNodesRef.child('root').on('value', function(dataSnapshot) {
      if (that.rootVM.editing) return;
      // console.log("dataSnapshot.val()")
      that.node = dataSnapshot.val();
      // console.log(that.node)
    });

    if (params.frameVM) {
      this.frameVM = params.frameVM;
    };
  }

  cut() {
    this.clipping = true;
    this.clippedVMList = [];
    var copiedFileList = [];
    for (var i = 0; i < this.selectedVMList.length; i++) {
      var file = {
        file_id: this.selectedVMList[i].node.id,
        node_id: "root",
      };
      copiedFileList.push(file);
      this.clippedVMList.push(this.selectedVMList[i])
    };
    this.selectedVMList = [];
    delete localStorage.clipboardData;
    localStorage.clipboardData = undefined;
    localStorage.clipboardData = JSON.stringify(copiedFileList);
    console.log(localStorage.clipboardData);
  }

  cleanStatus() {
    this.clipping = false;
  }

  newTemporaryMosaic() {
    window.open(window.location.origin + "#mosaic");
  }
}