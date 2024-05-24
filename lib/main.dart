// ignore_for_file: use_key_in_widget_constructors

import 'package:flutter/material.dart';
import 'package:skedmeds/screens/login.dart';
import 'package:skedmeds/screens/register.dart';

bool isLoggedIn =
    false; // Flag to track login status (replace with actual logic)
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Skedmeds',
      theme: ThemeData(
        primarySwatch: Colors.lightBlue, // Calming blue as primary color
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      initialRoute: "/login", // Set initial route to login screen
      routes: {
        "/login": (context) => LoginScreen(),
        "/register": (context) => RegisterScreen(),
      },
    );
  }
}
