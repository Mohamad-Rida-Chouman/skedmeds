import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:skedmeds/components/navbar.dart';
import 'package:connectivity/connectivity.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String _username = "";
  String _password = "";
  final FirebaseAuth _auth = FirebaseAuth.instance; // Initialize Firebase Auth
  bool _isLoading = false; // Flag to indicate login in progress

  void _toggleView(BuildContext context) {
    Navigator.pushNamed(context, "/register");
  }

  Future<void> _login(BuildContext context) async {
    setState(() {
      _isLoading = true; // Show activity indicator on login attempt
    });

    var connectivityResult = await (Connectivity().checkConnectivity());
    if (connectivityResult == ConnectivityResult.none) {
      // Show snackbar for no internet connection
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No internet connection. Please try again.'),
        ),
      );
      setState(() {
        _isLoading = false; // Hide activity indicator
      });
      return;
    }

    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      try {
        UserCredential userCredential = await _auth.signInWithEmailAndPassword(
          email: _username,
          password: _password,
        );

        // Login successful
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Welcome Back!'),
            duration: Duration(seconds: 2),
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
        String errorMessage = "";
        switch (error.code) {
          case 'invalid-credential':
            errorMessage =
                'Login failed. Please check your email and password.';
            break;
          case 'too-many-requests':
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
          default:
            errorMessage = 'An error occurred. Please try again.';
        }

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(errorMessage),
          ),
        );
      } finally {
        setState(() {
          _isLoading = false; // Hide activity indicator after login attempt
        });
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
                      // validator: (value) {
                      //   if (value == null || value.isEmpty) {
                      //     return "Please enter your password";
                      //   }
                      //   return null;
                      // },
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
