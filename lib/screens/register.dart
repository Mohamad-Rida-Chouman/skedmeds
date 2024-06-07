import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:connectivity/connectivity.dart';
import 'package:skedmeds/components/navbar.dart';

class RegisterScreen extends StatefulWidget {
  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String _email = "";
  String _password = "";
  final FirebaseAuth _auth = FirebaseAuth.instance; // Initialize Firebase Auth

  void _toggleView(BuildContext context) {
    Navigator.pushNamed(context, "/login");
  }

  Future<void> _register() async {
    var connectivityResult = await (Connectivity().checkConnectivity());
    if (connectivityResult == ConnectivityResult.none) {
      // Show snackbar for no internet connection
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No internet connection. Please try again.'),
        ),
      );
      return;
    }
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      try {
        UserCredential userCredential = await _auth
            .createUserWithEmailAndPassword(email: _email, password: _password);

        // Show success snackbar
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Welcome to Skedmeds!'),
            duration: Duration(seconds: 2), // Set snackbar duration (optional)
          ),
        );

        // Navigate to main screen after a delay
        Future.delayed(Duration(seconds: 2), () {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => Navbar()),
          );
        });
      } on FirebaseAuthException catch (error) {
        if (error.code == 'weak-password') {
          print('The password provided is too weak.');
          // Show an error message to the user (e.g., using SnackBar)
        } else if (error.code == 'email-already-in-use') {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('User already exists!'),
            ),
          );

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
                            // Show snackbar for empty email
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Please enter your email'),
                              ),
                            );
                            return "Please enter your email";
                          } else if (!RegExp(
                                  r"^[a-zA-Z0-9.a-z.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$")
                              .hasMatch(value)) {
                            // Show snackbar for invalid email format
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Please enter a valid email'),
                              ),
                            );
                            return "Please enter a valid email";
                          }
                          return null;
                        },
                        onSaved: (newValue) => _email = newValue!,
                      ),

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
                            // Show snackbar for empty password
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Please enter your password'),
                              ),
                            );
                            return "Please enter your password";
                          } else if (value.length < 6) {
                            // Show snackbar for short password
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                    'Password must be at least 6 characters'),
                              ),
                            );
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
