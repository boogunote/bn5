System.register([], function (_export) {
  var _classCallCheck, Common;

  return {
    setters: [],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Common = _export("Common", function Common() {
        _classCallCheck(this, Common);

        this.firebase_url = "https://bn.firebaseio.com";

        this.new_tree_note_skeleton = {
          meta: {
            type: "tree",
            name: "New Tree Note"
          },
          nodes: {
            root: {
              id: "root",
              children: ["first_node"]
            },
            first_node: {
              id: "first_node",
              content: "",
              collapsed: false,
              fold: false,
              icon: 0 }
          }
        };

        this.new_directory = {
          meta: {
            type: "directory",
            name: "New Directory",
            collapsed: false
          }
        };

        this.new_flat_note_skeleton = {
          meta: {
            type: "flat",
            name: "New Flat Note" },
          nodes: {
            root: {
              id: "root",
              children: ["first_node"],
              height: 2000,
              width: 2000
            },
            first_node: {
              id: "first_node",
              content: "",
              collapsed: false,
              fold: false,
              icon: 0,
              x: 100,
              y: 30,
              width: 400,
              height: 247
            }
          }
        };

        this.new_mosaic_skeleton = {
          meta: {
            type: "mosaic",
            name: "New Mosaic"
          },
          rows: [{
            id: "1",
            height: 500,
            tiles: [{
              id: "1",
              flex: 1,
              url: ""
            }]
          }]
        };
      });
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO3VCQUFhLE1BQU07Ozs7Ozs7OztBQUFOLFlBQU0scUJBQ04sU0FEQSxNQUFNOzhCQUFOLE1BQU07O0FBRWYsWUFBSSxDQUFDLFlBQVksR0FBRywyQkFBMkIsQ0FBQzs7QUFFaEQsWUFBSSxDQUFDLHNCQUFzQixHQUFHO0FBQzFCLGNBQUksRUFBRTtBQUNKLGdCQUFJLEVBQUUsTUFBTTtBQUNaLGdCQUFJLEVBQUUsZUFBZTtXQUN0QjtBQUNELGVBQUssRUFBRTtBQUNMLGdCQUFJLEVBQUU7QUFDSixnQkFBRSxFQUFFLE1BQU07QUFDVixzQkFBUSxFQUFFLENBQ1IsWUFBWSxDQUNiO2FBQ0Y7QUFDRCxzQkFBVSxFQUFFO0FBQ1YsZ0JBQUUsRUFBRSxZQUFZO0FBQ2hCLHFCQUFPLEVBQUUsRUFBRTtBQUNYLHVCQUFTLEVBQUUsS0FBSztBQUNoQixrQkFBSSxFQUFFLEtBQUs7QUFDWCxrQkFBSSxFQUFFLENBQUMsRUFDUjtXQUNGO1NBQ0YsQ0FBQzs7QUFFSixZQUFJLENBQUMsYUFBYSxHQUFHO0FBQ25CLGNBQUksRUFBRTtBQUNKLGdCQUFJLEVBQUUsV0FBVztBQUNqQixnQkFBSSxFQUFFLGVBQWU7QUFDckIscUJBQVMsRUFBRSxLQUFLO1dBQ2pCO1NBQ0YsQ0FBQTs7QUFFRCxZQUFJLENBQUMsc0JBQXNCLEdBQUc7QUFDNUIsY0FBSSxFQUFFO0FBQ0osZ0JBQUksRUFBRSxNQUFNO0FBQ1osZ0JBQUksRUFBRSxlQUFlLEVBQ3RCO0FBQ0QsZUFBSyxFQUFFO0FBQ0wsZ0JBQUksRUFBRTtBQUNKLGdCQUFFLEVBQUUsTUFBTTtBQUNWLHNCQUFRLEVBQUUsQ0FDUixZQUFZLENBQ2I7QUFDRCxvQkFBTSxFQUFFLElBQUk7QUFDWixtQkFBSyxFQUFFLElBQUk7YUFDWjtBQUNELHNCQUFVLEVBQUU7QUFDVixnQkFBRSxFQUFFLFlBQVk7QUFDaEIscUJBQU8sRUFBRSxFQUFFO0FBQ1gsdUJBQVMsRUFBRSxLQUFLO0FBQ2hCLGtCQUFJLEVBQUUsS0FBSztBQUNYLGtCQUFJLEVBQUUsQ0FBQztBQUNQLGVBQUMsRUFBQyxHQUFHO0FBQ0wsZUFBQyxFQUFDLEVBQUU7QUFDSixtQkFBSyxFQUFDLEdBQUc7QUFDVCxvQkFBTSxFQUFDLEdBQUc7YUFDWDtXQUNGO1NBQ0YsQ0FBQzs7QUFFRixZQUFJLENBQUMsbUJBQW1CLEdBQUc7QUFDekIsY0FBSSxFQUFFO0FBQ0osZ0JBQUksRUFBRSxRQUFRO0FBQ2QsZ0JBQUksRUFBRSxZQUFZO1dBQ25CO0FBQ0QsY0FBSSxFQUFFLENBQ0o7QUFDRSxjQUFFLEVBQUUsR0FBRztBQUNQLGtCQUFNLEVBQUUsR0FBRztBQUNYLGlCQUFLLEVBQUUsQ0FDTDtBQUNFLGdCQUFFLEVBQUUsR0FBRztBQUNQLGtCQUFJLEVBQUUsQ0FBQztBQUNQLGlCQUFHLEVBQUUsRUFBRTthQUNSLENBQ0Y7V0FDRixDQUNGO1NBQ0YsQ0FBQTtPQUNGIiwiZmlsZSI6ImNvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9