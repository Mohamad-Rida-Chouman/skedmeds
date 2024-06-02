import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import './login.dart';

void logout(BuildContext context) async {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  try {
    await _auth.signOut();
    // Navigate to LoginScreen after successful logout
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (context) => LoginScreen()),
    );
  } catch (error) {
    print(error.toString()); // Handle logout errors (optional)
    ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("An error occurred while logging out.")));
  }
}

class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment:
              MainAxisAlignment.center, // Center content vertically
          children: [
            Card(
              color: Color(0xFF38B3CD),
              elevation: 2.0, // Optional shadow effect
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8.0), // Rounded corners
              ),
              child: Padding(
                padding: EdgeInsets.all(16.0), // Add padding inside the card
                child: Column(
                  children: [
                    // Title
                    Text(
                      "SkedMeds",
                      style: TextStyle(
                        fontSize: 32.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.white, // White text color
                      ),
                    ),
                    SizedBox(
                      height:
                          8.0, // Add smaller spacing between title and slogan
                    ),

                    // Slogan
                    Text(
                      "SCHEDULING MEDICATIONS MADE SIMPLE!",
                      style: TextStyle(
                        fontSize: 16.0,
                        color: Colors.white, // White text color
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16.0), // Add spacing

            // Display user email directly in the "Email" field
            Text(
              "Email:",
              style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
            ),
            Text(
              FirebaseAuth.instance.currentUser?.email ??
                  "", // Get email from user object
            ),
            SizedBox(height: 16.0), // Add spacing

            ElevatedButton(
              onPressed: () {
                logout(context);
              },
              child: Text("Logout"),
              style: TextButton.styleFrom(
                foregroundColor:
                    Colors.white, // Text color for button (optional)
                backgroundColor: Color(0xFF38B3CD),
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(4.0), // Set rounded corners
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
