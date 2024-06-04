import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'dart:math'; // Import the math library for Random

class EntertainmentScreen extends StatefulWidget {
  @override
  _EntertainmentScreenState createState() => _EntertainmentScreenState();
}

class _EntertainmentScreenState extends State<EntertainmentScreen> {
  Map<String, dynamic>? post; // Store the fetched random post

  final firestoreInstance = FirebaseFirestore.instance;
  final postsCollection = FirebaseFirestore.instance.collection("posts");

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  void fetchData() async {
    try {
      final querySnapshot = await postsCollection.get();
      if (querySnapshot.docs.isNotEmpty) {
        final randomIndex = Random().nextInt(querySnapshot.docs.length);
        final randomDoc = querySnapshot.docs[randomIndex];
        setState(() {
          post = randomDoc.data();
        });
      } else {
        print("No posts found in the collection.");
      }
    } catch (error) {
      print("Error fetching data: $error");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        // Center the entire Scaffold content
        child: Padding(
          padding: const EdgeInsets.all(16.0), // Maintain some padding
          child: post == null
              ? Text(
                  'Loading...',
                  style:
                      TextStyle(fontSize: 16.0), // Adjust loading message style
                ) // Display loading message while fetching data
              : Center(
                  // Center the Column containing the post
                  child: Column(
                    mainAxisSize: MainAxisSize.min, // Avoid unnecessary space
                    children: [
                      Text(
                        post!['title']!,
                        style: TextStyle(
                            fontSize: 20.0, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 16.0), // Add spacing
                      Text(post!['content']!),
                      Divider(), // Add divider between posts (optional)
                    ],
                  ),
                ),
        ),
      ),
    );
  }
}
