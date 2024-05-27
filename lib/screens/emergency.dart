import 'package:flutter/material.dart';

class EmergencyScreen extends StatelessWidget {
  final Map<String, String> emergencyNumbers = {
    "Ambulance": "tel:112", // Replace with your local ambulance number
    "Police": "tel:100", // Replace with your local police number
    "Firefighters": "tel:110", // Replace with your local firefighter number
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   title: Text("Emergency Contacts"),
      // ),
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
                    title: Text(emergencyType,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            fontSize: 16.0, fontWeight: FontWeight.bold)),
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
