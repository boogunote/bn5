export class Common {
  constructor(){
    this.firebase_url = "https://boogutest.firebaseio.com";
    this.new_tree_note_skeleton = {
        meta: {
          type: "tree",
          title: "New Tree Note"
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
  }
}