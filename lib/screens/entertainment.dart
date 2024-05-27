import 'package:flutter/material.dart';
import 'dart:math'; // Import the math library for Random

class EntertainmentScreen extends StatelessWidget {
  final List<Map<String, String>> posts = [
    {
      "title": "Did you know?",
      "content": "The population of the Earth is about 8 billion people.",
    },
    {
      "title": "Short Story: The Lost Key",
      "content":
          "Once upon a time, a young boy named Alex was playing in the park when he lost his favorite key. He searched high and low, but couldn't find it anywhere. Feeling discouraged, he sat on a bench, about to give up. Suddenly, a friendly dog approached him with the key in its mouth! Alex was overjoyed and thanked the dog profusely. He learned that day to never give up hope, even when things seem lost.",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final randomIndex = Random().nextInt(posts.length); // Generate random index
    final randomPost = posts[randomIndex]; // Get post at random index

    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment:
                MainAxisAlignment.center, // Center content vertically
            children: [
              Text(
                randomPost[
                    "title"]!, // Access title using null-safe operator (!)
                style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 16.0), // Add spacing
              Text(randomPost[
                  "content"]!), // Access content using null-safe operator (!)
            ],
          ),
        ),
      ),
    );
  }
}
