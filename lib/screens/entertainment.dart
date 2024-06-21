import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'dart:math';

class EntertainmentScreen extends StatefulWidget {
  @override
  _EntertainmentScreenState createState() => _EntertainmentScreenState();
}

class _EntertainmentScreenState extends State<EntertainmentScreen> {
  Map<String, dynamic>? post;

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
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: post == null
              ? Text(
                  'Loading...',
                  style: TextStyle(fontSize: 16.0),
                )
              : Center(
                  child: post == null
                      ? CircularProgressIndicator()
                      : Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8.0),
                              child: Image.network(
                                post!['imageUrl']!,
                                width: 100.0,
                                height: 100.0,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) =>
                                    Icon(Icons.error), // Display error icon
                              ),
                            ),
                            Text(
                              post!['title']!,
                              style: TextStyle(
                                  fontSize: 20.0, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(height: 16.0),
                            Text(post!['content']!),
                          ],
                        ),
                ),
        ),
      ),
    );
  }
}
