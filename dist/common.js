System.register([], function (_export) {
  var _classCallCheck, Common;

  return {
    setters: [],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Common = _export("Common", function Common() {
        _classCallCheck(this, Common);

        this.firebase_url = "https://boogutest.firebaseio.com";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO3VCQUFhLE1BQU07Ozs7Ozs7OztBQUFOLFlBQU0scUJBQ04sU0FEQSxNQUFNLEdBQ0o7OEJBREYsTUFBTTs7QUFFZixZQUFJLENBQUMsWUFBWSxHQUFHLGtDQUFrQyxDQUFDOztBQUV2RCxZQUFJLENBQUMsc0JBQXNCLEdBQUc7QUFDMUIsY0FBSSxFQUFFO0FBQ0osZ0JBQUksRUFBRSxNQUFNO0FBQ1osZ0JBQUksRUFBRSxlQUFlO1dBQ3RCO0FBQ0QsZUFBSyxFQUFFO0FBQ0wsZ0JBQUksRUFBRTtBQUNKLGdCQUFFLEVBQUUsTUFBTTtBQUNWLHNCQUFRLEVBQUUsQ0FDUixZQUFZLENBQ2I7YUFDRjtBQUNELHNCQUFVLEVBQUU7QUFDVixnQkFBRSxFQUFFLFlBQVk7QUFDaEIscUJBQU8sRUFBRSxFQUFFO0FBQ1gsdUJBQVMsRUFBRSxLQUFLO0FBQ2hCLGtCQUFJLEVBQUUsS0FBSztBQUNYLGtCQUFJLEVBQUUsQ0FBQyxFQUNSO1dBQ0Y7U0FDRixDQUFDOztBQUVKLFlBQUksQ0FBQyxhQUFhLEdBQUc7QUFDbkIsY0FBSSxFQUFFO0FBQ0osZ0JBQUksRUFBRSxXQUFXO0FBQ2pCLGdCQUFJLEVBQUUsZUFBZTtBQUNyQixxQkFBUyxFQUFFLEtBQUs7V0FDakI7U0FDRixDQUFBOztBQUVELFlBQUksQ0FBQyxzQkFBc0IsR0FBRztBQUM1QixjQUFJLEVBQUU7QUFDSixnQkFBSSxFQUFFLE1BQU07QUFDWixnQkFBSSxFQUFFLGVBQWUsRUFDdEI7QUFDRCxlQUFLLEVBQUU7QUFDTCxnQkFBSSxFQUFFO0FBQ0osZ0JBQUUsRUFBRSxNQUFNO0FBQ1Ysc0JBQVEsRUFBRSxDQUNSLFlBQVksQ0FDYjtBQUNELG9CQUFNLEVBQUUsSUFBSTtBQUNaLG1CQUFLLEVBQUUsSUFBSTthQUNaO0FBQ0Qsc0JBQVUsRUFBRTtBQUNWLGdCQUFFLEVBQUUsWUFBWTtBQUNoQixxQkFBTyxFQUFFLEVBQUU7QUFDWCx1QkFBUyxFQUFFLEtBQUs7QUFDaEIsa0JBQUksRUFBRSxLQUFLO0FBQ1gsa0JBQUksRUFBRSxDQUFDO0FBQ1AsZUFBQyxFQUFDLEdBQUc7QUFDTCxlQUFDLEVBQUMsRUFBRTtBQUNKLG1CQUFLLEVBQUMsR0FBRztBQUNULG9CQUFNLEVBQUMsR0FBRzthQUNYO1dBQ0Y7U0FDRixDQUFDOztBQUVGLFlBQUksQ0FBQyxtQkFBbUIsR0FBRztBQUN6QixjQUFJLEVBQUU7QUFDSixnQkFBSSxFQUFFLFFBQVE7QUFDZCxnQkFBSSxFQUFFLFlBQVk7V0FDbkI7QUFDRCxjQUFJLEVBQUUsQ0FDSjtBQUNFLGNBQUUsRUFBRSxHQUFHO0FBQ1Asa0JBQU0sRUFBRSxHQUFHO0FBQ1gsaUJBQUssRUFBRSxDQUNMO0FBQ0UsZ0JBQUUsRUFBRSxHQUFHO0FBQ1Asa0JBQUksRUFBRSxDQUFDO0FBQ1AsaUJBQUcsRUFBRSxFQUFFO2FBQ1IsQ0FDRjtXQUNGLENBQ0Y7U0FDRixDQUFBO09BQ0YiLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIn0=