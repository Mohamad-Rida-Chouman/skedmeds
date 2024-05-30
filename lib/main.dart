// ignore_for_file: use_key_in_widget_constructors

import 'package:flutter/material.dart';
import 'package:skedmeds/components/navbar.dart';
import 'package:skedmeds/screens/login.dart';
import 'package:skedmeds/screens/register.dart';

// Define calming theme colors (replace with hex codes if needed)
final Color primaryColor = Color(0xFF38B3CD); // Sea Blue
final Color backgroundColor = Color(0xFFF5F5F5); // Soft Beige

bool isLoggedIn =
    false; // Flag to track login status (replace with actual logic)

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Skedmeds',
      theme: ThemeData(
        primarySwatch:
            Colors.teal, // Replace with primaryColor for better control
        primaryColor: primaryColor, // Set primary color explicitly
        scaffoldBackgroundColor: backgroundColor, // Set background color
        appBarTheme: AppBarTheme(
          backgroundColor: primaryColor, // Sea Blue app bar background
          titleTextStyle: TextStyle(
              color: Colors.white, fontSize: 21.0), // Light text for app bar
        ),
        // ... add styles for buttons, cards, etc. (optional)
      ),
      initialRoute: isLoggedIn ? "/home" : "/login", // Set initial route
      routes: {
        "/login": (context) => LoginScreen(),
        "/register": (context) => RegisterScreen(),
        "/home": (context) => Navbar(),
      },
    );
  }
}
