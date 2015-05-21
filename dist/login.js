System.register(["firebase", "jquery", "./common", "./utility", "aurelia-framework", "aurelia-router"], function (_export) {
  var Common, Utility, Parent, Router, _prototypeProperties, _classCallCheck, Login;

  return {
    setters: [function (_firebase) {}, function (_jquery) {}, function (_common) {
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

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Login = _export("Login", (function () {
        function Login(common, utility, router) {
          _classCallCheck(this, Login);

          this.common = common;
          this.utility = utility;
          this.router = router;
        }

        _prototypeProperties(Login, {
          inject: {
            value: function inject() {
              return [Common, Utility, Router];
            },
            writable: true,
            configurable: true
          }
        }, {
          login: {
            value: function login() {
              console.log("login");
              $("#btn-login").text("Waiting...");
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
            },
            writable: true,
            configurable: true
          },
          onKeyDown: {
            value: function onKeyDown(event) {
              console.log(event);
              if (13 == event.keyCode) {
                this.login();
              };
              return true;
            },
            writable: true,
            configurable: true
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
            },
            writable: true,
            configurable: true
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
//# sourceMappingURL=data:application/json;base64,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