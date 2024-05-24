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

  void _toggleView(BuildContext context) {
    Navigator.pushNamed(context, "/login");
  }

  void _register() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      print("Username: $_username");
      print("Email: $_email");
      print("Password: $_password");
      // Implement actual registration logic here (e.g., call an API)
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text("Register"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Center(
          child: SingleChildScrollView(
            // Allow scrolling if content overflows
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
                        decoration: InputDecoration(labelText: "Username"),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return "Please enter your username";
                          }
                          return null;
                        },
                        onSaved: (newValue) => _username = newValue!,
                      ),
                      SizedBox(height: 10.0),

                      // Email field
                      TextFormField(
                        decoration: InputDecoration(labelText: "Email"),
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

                      // Password field
                      TextFormField(
                        decoration: InputDecoration(labelText: "Password"),
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

                      // Register button
                      ElevatedButton(
                        onPressed: _register,
                        child: Text("Register"),
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
