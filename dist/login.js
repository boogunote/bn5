System.register(["firebase", "./common", "./utility"], function (_export) {
  var Common, Utility, _createClass, _classCallCheck, Login;

  return {
    setters: [function (_firebase) {}, function (_common) {
      Common = _common.Common;
    }, function (_utility) {
      Utility = _utility.Utility;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Login = _export("Login", (function () {
        function Login(common, utility) {
          _classCallCheck(this, Login);

          this.common = common;
          this.utility = utility;
        }

        _createClass(Login, {
          login: {
            value: function login() {
              console.log("login");
              // var hash = window.location.hash;
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
                  // if (hash.length > 2) {
                  //     window.location.replace("index.html" + hash);
                  // } else {
                  //     window.location.replace("list.html");
                  // }
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
                              children: [{
                                id: file_id }]
                            }
                          }
                        },
                        files: {}
                      };
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
                    }
                  });
                }
              });
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [Common, Utility];
            }
          }
        });

        return Login;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7TUFDUSxNQUFNLEVBQ04sT0FBTyxpQ0FFRixLQUFLOzs7O0FBSFYsWUFBTSxXQUFOLE1BQU07O0FBQ04sYUFBTyxZQUFQLE9BQU87Ozs7Ozs7OztBQUVGLFdBQUs7QUFFTCxpQkFGQSxLQUFLLENBRUosTUFBTSxFQUFFLE9BQU8sRUFBQztnQ0FGakIsS0FBSzs7QUFHZCxjQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixjQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUN4Qjs7cUJBTFUsS0FBSztBQU9oQixlQUFLO21CQUFBLGlCQUFHO0FBQ04scUJBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXJCLGtCQUFJLEdBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2pELGlCQUFHLENBQUMsZ0JBQWdCLENBQUM7QUFDbkIscUJBQUssRUFBTSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLEVBQUU7QUFDckMsd0JBQVEsRUFBRyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLEVBQUU7ZUFDdEMsRUFBRSxVQUFTLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDekIsdUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakIsb0JBQUksR0FBRyxFQUFFO0FBQ1AsdUJBQUssQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNuQyxNQUFNLElBQUksUUFBUSxFQUFFOztBQUVuQix5QkFBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7Ozs7OztpQkFNcEQ7ZUFDRixDQUFDLENBQUM7YUFDSjs7QUFFRCxnQkFBTTttQkFBQSxrQkFBRztBQUNQLGtCQUFJLEdBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2pELGtCQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDckMsa0JBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzNDLGtCQUFJLElBQUksR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkMsa0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixpQkFBRyxDQUFDLFVBQVUsQ0FBQztBQUNiLHFCQUFLLEVBQU0sS0FBSztBQUNoQix3QkFBUSxFQUFHLFFBQVE7ZUFDcEIsRUFBRSxVQUFTLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDM0Isb0JBQUksS0FBSyxFQUFFO0FBQ1QseUJBQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQzVDLE1BQU07QUFDTCx5QkFBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekUscUJBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNuQix5QkFBSyxFQUFNLEtBQUs7QUFDaEIsNEJBQVEsRUFBRyxRQUFRO21CQUNwQixFQUFFLFVBQVMsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUN6QiwyQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQix3QkFBSSxHQUFHLEVBQUU7QUFDUCwyQkFBSyxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ25DLE1BQU0sSUFBSSxRQUFRLEVBQUU7QUFDbkIsNkJBQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25ELDBCQUFJLFlBQVksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pFLDBCQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3pDLDBCQUFJLG1CQUFtQixHQUFHO0FBQ3hCLG1DQUFXLEVBQUU7QUFDWCwrQkFBSyxFQUFFO0FBQ0wsZ0NBQUksRUFBRTtBQUNKLGdDQUFFLEVBQUUsTUFBTTtBQUNWLHNDQUFRLEVBQUUsQ0FDUjtBQUNFLGtDQUFFLEVBQUUsT0FBTyxFQUNaLENBQ0Y7NkJBQ0Y7MkJBQ0Y7eUJBQ0Y7QUFDRCw2QkFBSyxFQUFFLEVBQUU7dUJBQ1YsQ0FBQztBQUNGLDBCQUFJLHNCQUFzQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtBQUNuRiw0Q0FBc0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO0FBQ3pFLHlDQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxzQkFBc0IsQ0FBQztBQUM1RCxrQ0FBWSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3RDLDBCQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZFLDBCQUFJLFNBQVMsR0FBRztBQUNkLDZCQUFLLEVBQUUsS0FBSztBQUNaLDRCQUFJLEVBQUUsSUFBSTtBQUNWLDRCQUFJLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTO0FBQ3BDLDBCQUFFLEVBQUUsT0FBTzt1QkFDWixDQUFDO0FBQ0YsaUNBQVcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQzVCO21CQUNGLENBQUMsQ0FBQztpQkFDSjtlQUNGLENBQUMsQ0FBQzthQUNKOzs7QUFyRk0sZ0JBQU07bUJBQUEsa0JBQUc7QUFBRSxxQkFBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzthQUFFOzs7O2VBRGxDLEtBQUsiLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==