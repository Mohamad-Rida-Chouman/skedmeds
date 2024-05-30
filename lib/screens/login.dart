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

  void _toggleView(BuildContext context) {
    Navigator.pushNamed(context, "/register");
  }

  void _login(BuildContext context) {
    // Pass context as argument
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      print("Username: $_username");
      print("Password: $_password");
      // Implement actual registration logic here (e.g., call an API)

      // Navigate to RemindersScreen after successful login
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => Navbar()),
      );
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
                        labelText: "Username",
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
                          return "Please enter your username";
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
