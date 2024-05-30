import 'package:flutter/material.dart';
import './login.dart';

// Replace with your actual navigation logic (e.g., using a navigation service)
void navigateToLogin(BuildContext context) {
  // Pop the current screen (profile)
  Navigator.of(context).pop();
  // Replace the following with your login screen navigation logic
  // Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => LoginScreen()));
}

void logout(BuildContext context) {
  // Clear user data or perform logout actions (optional)
}

class ProfileScreen extends StatelessWidget {
  final String username;
  final String email;

  const ProfileScreen({Key? key, required this.username, required this.email})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   title: Text("Profile"),
      // ),
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
                            8.0), // Add smaller spacing between title and slogan

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
            Text(
              "Username:",
              style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
            ),
            Text(username),
            SizedBox(height: 16.0), // Add spacing
            Text(
              "Email:",
              style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
            ),
            Text(email),
            SizedBox(height: 16.0), // Add spacing
            ElevatedButton(
              onPressed: () {
                logout(context); // Perform logout actions (optional)
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => LoginScreen()),
                );
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
