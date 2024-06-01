import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class EmergencyScreen extends StatefulWidget {
  @override
  _EmergencyScreenState createState() => _EmergencyScreenState();
}

class _EmergencyScreenState extends State<EmergencyScreen> {
  final Map<String, String> emergencyNumbers = {};

  final firestoreInstance = FirebaseFirestore.instance;
  final emergencyNumbersCollection =
      FirebaseFirestore.instance.collection("emergency_numbers");

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  void fetchData() async {
    try {
      final querySnapshot = await emergencyNumbersCollection.get();
      if (querySnapshot.docs.isNotEmpty) {
        for (var doc in querySnapshot.docs) {
          final emergencyType = doc.data()["type"]; // Assuming a "type" field
          final phoneNumber =
              doc.data()["phone_number"]; // Assuming a "phone_number" field
          emergencyNumbers[emergencyType] = phoneNumber;
        }
      } else {
        // Handle empty data case
        emergencyNumbers["Numbers will be added soon!"] = "stay tuned";
      }
      setState(() {});
    } catch (error) {
      print("Error fetching data: $error");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0), // Add some padding
              child: ListView.builder(
                shrinkWrap: true, // Prevent excessive list expansion
                itemCount: emergencyNumbers.length,
                itemBuilder: (context, index) {
                  final emergencyType = emergencyNumbers.keys.elementAt(index);
                  final phoneNumber = emergencyNumbers.values.elementAt(index);
                  return ListTile(
                    title: Text(
                      emergencyType,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    subtitle: Text(phoneNumber, textAlign: TextAlign.center),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
