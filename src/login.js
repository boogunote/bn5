import 'firebase';
import {Common} from './common';
import {Utility} from './utility';

export class Login {
  static inject() { return [Common, Utility]; }
  constructor(common, utility){
    this.common = common;
    this.utility = utility;
  }

  login() {
    console.log("login");
    // var hash = window.location.hash;
    var ref = new Firebase(this.common.firebase_url);
    ref.authWithPassword({
      email    : $("#login-username").val(),
      password : $("#login-password").val()
    }, function(err, authData) {
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

  signUp() {
    var ref = new Firebase(this.common.firebase_url);
    var email = $("#signup-email").val();
    var password = $("#signup-password").val();
    var name = $("#signup-name").val();
    var that = this;
    ref.createUser({
      email    : email,
      password : password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        ref.authWithPassword({
          email    : email,
          password : password
        }, function(err, authData) {
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
                    children: [
                      {
                        id: file_id,
                      }
                    ]
                  }
                }
              },
              files: {}
            };
            var new_tree_note_skeleton = that.utility.clone(that.common.new_tree_note_skeleton)
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