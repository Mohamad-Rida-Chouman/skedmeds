import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:skedmeds/components/navbar.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String _username = "";
  String _password = "";
  final FirebaseAuth _auth = FirebaseAuth.instance; // Initialize Firebase Auth

  void _toggleView(BuildContext context) {
    Navigator.pushNamed(context, "/register");
  }

  Future<void> _login(BuildContext context) async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      try {
        // Attempt to sign in the user with email and password
        UserCredential userCredential = await _auth.signInWithEmailAndPassword(
            email: _username, password: _password);

        // User logged in successfully, navigate to RemindersScreen
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => Navbar()),
        );
      } on FirebaseAuthException catch (error) {
        if (error.code == 'user-not-found') {
          print('The user does not exist.');
          // Show an error message to the user (e.g., using SnackBar)
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text("User does not exist. Please register.")));
        } else if (error.code == 'wrong-password') {
          print('Wrong password provided for that user.');
          // Show an error message to the user (e.g., using SnackBar)
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text("Incorrect username or password.")));
        } else {
          print(error.code);
          // Handle other FirebaseAuthException errors (optional)
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Center(
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
                    // Username field
                    TextFormField(
                      decoration: InputDecoration(
                        labelText: "Email",
                        floatingLabelStyle: TextStyle(color: Colors.teal),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Theme.of(context)
                                .primaryColor, // Use theme's blue color
                          ),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Theme.of(context)
                                .primaryColor, // Use theme's blue color
                          ),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Please enter your email";
                        }
                        return null;
                      },
                      onSaved: (newValue) => _username = newValue!,
                    ),
                    SizedBox(height: 10.0),

                    // Password field
                    TextFormField(
                      decoration: InputDecoration(
                        labelText: "Password",
                        floatingLabelStyle: TextStyle(color: Colors.teal),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Theme.of(context)
                                .primaryColor, // Use theme's blue color
                          ),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Theme.of(context)
                                .primaryColor, // Use theme's blue color
                          ),
                        ),
                      ),
                      obscureText: true,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Please enter your password";
                        }
                        return null;
                      },
                      onSaved: (newValue) => _password = newValue!,
                    ),
                    SizedBox(height: 20.0),

                    // Login button
                    ElevatedButton(
                      onPressed: () =>
                          _login(context), // Call _login with context
                      child: Text("Login"),
                      style: TextButton.styleFrom(
                        foregroundColor:
                            Colors.white, // Text color for button (optional)
                        backgroundColor: Color(0xFF38B3CD),
                        shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(4.0), // Set rounded corners
                        ),
                      ),
                    )
                  ],
                ),
              ),

              // Text with clickable "Register"
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text("Don't have an account? "),
                  TextButton(
                    onPressed: () => _toggleView(context),
                    child: Text(
                      "Register",
                      style: TextStyle(color: Theme.of(context).primaryColor),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
