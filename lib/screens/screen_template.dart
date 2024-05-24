import 'package:flutter/material.dart';

class ScreenTemplate extends StatelessWidget {
  final String title; // Title of the screen

  const ScreenTemplate({Key? key, required this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        centerTitle: true,
      ),
      body: Center(
        child: Text(title), // Display screen title
      ),
    );
  }
}
