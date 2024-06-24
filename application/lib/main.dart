import 'package:firebase_core/firebase_core.dart';
import './firebase_options.dart';
import 'package:flutter/material.dart';
import 'package:skedmeds/components/navbar.dart';
import 'package:skedmeds/screens/login.dart';
import 'package:skedmeds/screens/register.dart';

final Color primaryColor = Color(0xFF38B3CD);
final Color backgroundColor = Color(0xFFF5F5F5);

bool isLoggedIn = false;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Skedmeds',
      theme: ThemeData(
        primarySwatch: Colors.teal,
        primaryColor: primaryColor,
        scaffoldBackgroundColor: backgroundColor,
        appBarTheme: AppBarTheme(
          backgroundColor: primaryColor,
          titleTextStyle: TextStyle(color: Colors.white, fontSize: 21.0),
        ),
      ),
      initialRoute: isLoggedIn ? "/home" : "/login",
      routes: {
        "/login": (context) => LoginScreen(),
        "/register": (context) => RegisterScreen(),
        "/home": (context) => Navbar(),
      },
    );
  }
}
