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
      // console.log("dataSnapshot.val()")
      that.node = dataSnapshot.val();
      // console.log(that.node)
    });
  }
}