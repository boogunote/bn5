System.register(["firebase", "./common", "./utility", "aurelia-framework", "aurelia-router"], function (_export) {
  var Common, Utility, Parent, Router, _createClass, _classCallCheck, Login;

  return {
    setters: [function (_firebase) {}, function (_common) {
      Common = _common.Common;
    }, function (_utility) {
      Utility = _utility.Utility;
    }, function (_aureliaFramework) {
      Parent = _aureliaFramework.Parent;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Login = _export("Login", (function () {
        function Login(common, utility, router) {
          _classCallCheck(this, Login);

          this.common = common;
          this.utility = utility;
          this.router = router;
        }

        _createClass(Login, {
          login: {
            value: function login() {
              console.log("login");
              // window.location.href = "/#fm";
              // var hash = window.location.hash;
              var that = this;
              var ref = new Firebase(this.common.firebase_url);
              ref.authWithPassword({
                email: $("#login-username").val(),
                password: $("#login-password").val()
              }, function (err, authData) {
                console.log(err);
                if (err) {
                  alert("Login Error: " + err.code);
                } else if (authData) {
                  // user authenticated with Firebase
                  console.log("Logged In! User ID: " + authData.uid);
                  // window.location.href = "/#fm";
                  // window.location.href = window.location.origin + "/#fm";
                  that.router.navigate("fm");
                }
              });
            }
          },
          signUp: {
            value: function signUp() {
              var ref = new Firebase(this.common.firebase_url);
              var email = $("#signup-email").val();
              var password = $("#signup-password").val();
              var name = $("#signup-name").val();
              var that = this;
              ref.createUser({
                email: email,
                password: password
              }, function (error, userData) {
                if (error) {
                  console.log("Error creating user:", error);
                } else {
                  console.log("Successfully created user account with uid:", userData.uid);
                  ref.authWithPassword({
                    email: email,
                    password: password
                  }, function (err, authData) {
                    console.log(err);
                    if (err) {
                      alert("Login Error: " + err.code);
                    } else if (authData) {
                      console.log("Logged In! User ID: " + authData.uid);
                      var userNotesRef = ref.child("notes").child("users").child(userData.uid);
                      var file_id = that.utility.getUniqueId();
                      var user_notes_skeleton = {
                        directories: {
                          nodes: {
                            root: {
                              id: "root",
                              children: [file_id]
                            }
                          }
                        },
                        files: {}
                      };
                      var file_item = {
                        id: file_id
                      };
                      user_notes_skeleton.directories.nodes[file_id] = file_item;
                      var new_tree_note_skeleton = that.utility.clone(that.common.new_tree_note_skeleton);
                      new_tree_note_skeleton.meta.create_time = Firebase.ServerValue.TIMESTAMP;
                      user_notes_skeleton.files[file_id] = new_tree_note_skeleton;
                      userNotesRef.set(user_notes_skeleton);
                      var userInfoRef = ref.child("info").child("users").child(userData.uid);
                      var user_info = {
                        email: email,
                        name: name,
                        time: Firebase.ServerValue.TIMESTAMP,
                        id: file_id
                      };
                      userInfoRef.set(user_info);
                      window.location.href = window.location.origin + "/#fm";
                      // window.location.href = window.location.origin + "/#fm";
                      // that.router.navigate("fm")
                    }
                  });
                }
              });
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [Common, Utility, Router];
            }
          }
        });

        return Login;
      })());
    }
  };
});
// if (hash.length > 2) {
//     window.location.replace("index.html" + hash);
// } else {
//     window.location.replace("list.html");
// }
//# sourceMappingURL=data:application/json;base64,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QUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkUsMEJBQUksU0FBUyxHQUFHO0FBQ2QsNkJBQUssRUFBRSxLQUFLO0FBQ1osNEJBQUksRUFBRSxJQUFJO0FBQ1YsNEJBQUksRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLFNBQVM7QUFDcEMsMEJBQUUsRUFBRSxPQUFPO3VCQUNaLENBQUM7QUFDRixpQ0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzQiw0QkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUMsTUFBTSxDQUFDOzs7cUJBR3REO21CQUNGLENBQUMsQ0FBQztpQkFDSjtlQUNGLENBQUMsQ0FBQzthQUNKOzs7QUFoR00sZ0JBQU07bUJBQUEsa0JBQUc7QUFBRSxxQkFBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFBRTs7OztlQUQxQyxLQUFLIiwiZmlsZSI6ImxvZ2luLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIn0=