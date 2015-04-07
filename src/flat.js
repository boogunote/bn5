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
      var that = this;
      this.fileRef.once('value', function(dataSnapshot) {
        console.log("1111111111111dataSnapshot.val()")
        that.file = dataSnapshot.val()
        console.log(that.file);
        if (that.file) {
          that.root = that.file.nodes.root;
          that.file_id = that.file.meta.id;
          console.log(that.root)
          console.log(that.file_id)
          // that.loadNodeFromLocalCache(that.root_id);
          // that.loadTitle(that.root_id);
          setTimeout(function() {
            for (var i = 0; i < that.root.children.length; i++) {
              that.initInteract(that.root.children[i]);
            };
          }, 10);
        }
      });

      // this.loadNodeDataById(this.file_id, this.root_id);
    }
  }

  initInteract(id) {
    // interact('#'+id)
    //   .draggable({
    //     // enable inertial throwing
    //     inertia: true,
    //     // keep the element within the area of it's parent
    //     restrict: {
    //       restriction: "parent",
    //       endOnly: true,
    //       elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    //     },

    //     // call this function on every dragmove event
    //     onmove: function (event) {
    //       var target = event.target,
    //           // keep the dragged position in the data-x/data-y attributes
    //           x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    //           y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    //       // translate the element
    //       target.style.webkitTransform =
    //       target.style.transform =
    //         'translate(' + x + 'px, ' + y + 'px)';

    //       // update the posiion attributes
    //       target.setAttribute('data-x', x);
    //       target.setAttribute('data-y', y);
    //       console.log(x + " " + y)
    //     },
    //     // call this function on every dragend event
    //     onend: function (event) {
    //       var textEl = event.target.querySelector('p');

    //       textEl && (textEl.textContent =
    //         'moved a distance of '
    //         + (Math.sqrt(event.dx * event.dx +
    //                      event.dy * event.dy)|0) + 'px');
    //     }
    //   });
    interact('#'+id+" .flat-body")
      .resizable({
        edges: {
          left: true,
          right: true,
          bottom: true,
          top: false
        },
        square: true
      })
      .on("resizemove", function(event) {
        var target = event.target.parentElement;
        var dRect = event.deltaRect;
        var newWidth  = parseFloat(target.style.width ) + dRect.width;
        var newHeight = parseFloat(target.style.height) + dRect.height;
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + dRect.left;
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + dRect.top;
        // update the element's style
        target.style.width  = newWidth + 'px';
        target.style.height = newHeight + 'px';
        target.style.transform = "translate(" + x + "px, " + y + "px)";
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      })
    // interact('#'+id+" .flat-window")
    interact('#'+id)
      .draggable({})
      .allowFrom(".flat-titlebar")
      .on("dragmove", function(event) {
        var target = event.target;
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        target.style.transform = "translate(" + x + "px, " + y + "px)";
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      })
  }
}