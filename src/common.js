export class Common {
  constructor(){
    this.firebase_url = "https://boogutest.firebaseio.com";

    this.new_tree_note_skeleton = {
        meta: {
          type: "tree",
          name: "New Tree Note"
        },
        nodes: {
          root: {
            id: "root",
            children: [
              "first_node"
            ]
          },
          first_node: {
            id: "first_node",
            content: "",
            collapsed: false,
            fold: false,
            icon: 0,
          }
        }
      };

    this.new_directory = {
      meta: {
        type: "directory",
        name: "New Directory",
        collapsed: false
      }
    }

    this.new_flat_note_skeleton = {
      meta: {
        type: "flat",
        name: "New Flat Note",
      },
      nodes: {
        root: {
          id: "root",
          children: [
            "first_node"
          ],
          height: 3000,
          width: 3000
        },
        first_node: {
          id: "first_node",
          content: "",
          collapsed: false,
          fold: false,
          icon: 0,
          x:100,
          y:30,
          width:400,
          height:247
        }
      }
    };

    this.new_flat
  }
}