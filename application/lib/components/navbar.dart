import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:speech_to_text/speech_to_text.dart'; // Import speech_to_text
import 'package:speech_to_text/speech_recognition_result.dart';
import '../screens/appointment_reminder.dart';
import '../screens/pill_reminder.dart';
import '../screens/pharmacy.dart';
import '../screens/entertainment.dart';
import '../screens/emergency.dart';
import '../screens/profile.dart';

class Navbar extends StatefulWidget {
  @override
  _NavbarState createState() => _NavbarState();
}

class _NavbarState extends State<Navbar> {
  int _selectedIndex = 0; // Track selected index
  final List<Widget> _screens = []; // List of screens to navigate to
  final SpeechToText _speech = SpeechToText(); // Create SpeechToText object
  bool _isListening = false; // Flag to track listening state
  String _recognizedText = ""; // Stores the recognized text

  @override
  void initState() {
    super.initState();
    _screens.addAll([
      PillReminderScreen(),
      AppointmentReminderScreen(),
      PharmacyScreen(),
      EntertainmentScreen(),
      EmergencyScreen(),
      ProfileScreen(),
    ]);
  }

  @override
  void dispose() {
    _speech.stop(); // Use stop instead of cancel
    super.dispose();
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _handleListen() async {
    if (!_isListening) {
      final status = await Permission.microphone.request();
      if (status == PermissionStatus.granted) {
        setState(() {
          _isListening = true;
          _recognizedText = ""; // Clear previous text
        });

        bool available = await _speech.initialize();
        print("Speech recognition initialized: $available");

        if (available) {
          _speech.listen(
            onResult: (SpeechRecognitionResult result) {
              setState(() {
                _recognizedText = result.recognizedWords;
                print("Recognized text: $_recognizedText");
              });
              _recognizeSpeech(_recognizedText);
            },
            listenOptions: SpeechListenOptions(
              cancelOnError: true, // Stop listening on errors
            ),
          );
        } else {
          print("Speech recognition initialization failed");
        }
      } else if (status == PermissionStatus.permanentlyDenied) {
        openAppSettings(); // Open app settings
      }
    } else {
      setState(() {
        _isListening = false;
        _speech.stop();
      });
    }
  }

  void _recognizeSpeech(String recognizedWords) {
    String voiceCommand =
        recognizedWords.toLowerCase(); // No join needed for a String
    switch (voiceCommand) {
      case 'show me the pills screen':
        _onItemTapped(0);
        break;
      case 'view the appointments screen':
        _onItemTapped(1);
        break;
      case 'view the pharmacy screen':
        _onItemTapped(2);
        break;
      case 'view the entertainment screen':
        _onItemTapped(3);
        break;
      case 'view the emergency screen':
        _onItemTapped(4);
        break;
      case 'view the profile screen':
        _onItemTapped(5);
        break;
      default:
        print("Unrecognized voice command: $recognizedWords");
    }
  }

  void showAndHidePopup(String text) {
    Future.delayed(Duration(seconds: 2), () {
      setState(() {
        _recognizedText = "";
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text("SkedMeds"),
        centerTitle: true,
      ),
      body: Stack(
        // Use Stack widget to show popup on top of body
        children: [
          _screens[_selectedIndex],
          _recognizedText.isNotEmpty
              ? Center(
                  child: Container(
                    padding: EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                    child: Text(
                      _recognizedText,
                      style: TextStyle(fontSize: 18.0),
                    ),
                  ),
                )
              : SizedBox(), // Empty widget when no text recognized
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _handleListen, // Call _handleListen on button press
        child: Icon(_isListening
            ? Icons.mic
            : Icons.mic_off), // Change icon based on listening state
      ),
      bottomNavigationBar: BottomNavigationBar(
        selectedItemColor: Colors.lightBlue,
        unselectedItemColor: Colors.grey,
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.medication),
            label: 'Pills',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today),
            label: 'Appointments',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart),
            label: 'Pharmacy',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.movie),
            label: 'Entertainment',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.emergency),
            label: 'Emergency',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
