import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class RegisterScreen extends StatefulWidget {
  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String _username = "";
  String _email = "";
  String _password = "";
  final FirebaseAuth _auth = FirebaseAuth.instance; // Initialize Firebase Auth

  void _toggleView(BuildContext context) {
    Navigator.pushNamed(context, "/login");
  }

  Future<void> _register() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      try {
        // Create a new user with email and password
        UserCredential userCredential = await _auth
            .createUserWithEmailAndPassword(email: _email, password: _password);

        // Handle successful registration (optional)
        print("User registered successfully: ${userCredential.user!.uid}");
        // You can navigate to another screen or show a success message here

        // Optionally send email verification (uncomment to enable)
        // await userCredential.user!.sendEmailVerification();
        // print("Email verification link sent");
      } on FirebaseAuthException catch (error) {
        if (error.code == 'weak-password') {
          print('The password provided is too weak.');
          // Show an error message to the user (e.g., using SnackBar)
        } else if (error.code == 'email-already-in-use') {
          print('The account already exists for that email.');
          // Show an error message to the user
        } else {
          print(error.code);
          // Handle other FirebaseAuthException errors (optional)
        }
      } catch (error) {
        print(error.toString());
        // Handle other errors (optional)
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Title (optional)
                Text(
                  "Skedmeds",
                  style: TextStyle(fontSize: 30.0),
                ),
                SizedBox(height: 20.0),

                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      // Username field - currently not used for registration with Firebase Auth
                      // TextFormField(
                      //   decoration: InputDecoration(
                      //     labelText: "Username",
                      //     floatingLabelStyle: TextStyle(color: Colors.teal),
                      //     enabledBorder: UnderlineInputBorder(
                      //       borderSide: BorderSide(
                      //         color: Theme.of(context).primaryColor,
                      //       ),
                      //     ),
                      //     focusedBorder: UnderlineInputBorder(
                      //       borderSide: BorderSide(
                      //         color: Theme.of(context).primaryColor,
                      //       ),
                      //     ),
                      //   ),
                      //   // Consider using username later for display purposes or other functionalities
                      //   // onSaved: (newValue) => _username = newValue!,
                      // ),
                      // SizedBox(height: 10.0),

                      // Email field
                      TextFormField(
                        decoration: InputDecoration(
                          labelText: "Email",
                          floatingLabelStyle: TextStyle(color: Colors.teal),
                          enabledBorder: UnderlineInputBorder(
                            borderSide: BorderSide(
                              color: Theme.of(context).primaryColor,
                            ),
                          ),
                          focusedBorder: UnderlineInputBorder(
                            borderSide: BorderSide(
                              color: Theme.of(context).primaryColor,
                            ),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return "Please enter your email";
                          } else if (!RegExp(
                                  r"^[a-zA-Z0-9.a-z.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$")
                              .hasMatch(value)) {
                            return "Please enter a valid email";
                          }
                          return null;
                        },
                        onSaved: (newValue) => _email = newValue!,
                      ),
                      SizedBox(height: 10.0),

                      TextFormField(
                        decoration: InputDecoration(
                          labelText: "Password",
                          floatingLabelStyle: TextStyle(color: Colors.teal),
                          enabledBorder: UnderlineInputBorder(
                            borderSide: BorderSide(
                              color: Theme.of(context).primaryColor,
                            ),
                          ),
                          focusedBorder: UnderlineInputBorder(
                            borderSide: BorderSide(
                              color: Theme.of(context).primaryColor,
                            ),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return "Please enter your password";
                          } else if (value.length < 6) {
                            return "Password must be at least 6 characters";
                          }
                          return null;
                        },
                        obscureText: true,
                        onSaved: (newValue) => _password = newValue!,
                      ),
                      SizedBox(height: 20.0),

                      // Register button
                      ElevatedButton(
                        onPressed: _register,
                        child: Text("Register"),
                        style: TextButton.styleFrom(
                          foregroundColor:
                              Colors.white, // Text color for button (optional)
                          backgroundColor: Color(0xFF38B3CD),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(
                                4.0), // Set rounded corners
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Text with clickable "Login"
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text("Already have an account? "),
                    TextButton(
                      onPressed: () => _toggleView(context),
                      child: Text(
                        "Login",
                        style: TextStyle(color: Theme.of(context).primaryColor),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
