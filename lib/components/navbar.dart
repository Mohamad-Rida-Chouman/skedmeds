import 'package:flutter/material.dart';
import '../screens/appointment_reminder.dart';
import '../screens/pill_reminder.dart'; // Existing import
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

  @override
  void initState() {
    super.initState();
    _screens.addAll([
      PillReminderScreen(), // Separate screen for Pill Reminders
      AppointmentReminderScreen(), // Separate screen for Appointment Reminders (new)
      PharmacyScreen(),
      EntertainmentScreen(),
      EmergencyScreen(),
      ProfileScreen(
        username: "Mohamad",
        email: "mohamad@test.com",
      ),
    ]);
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text('SkedMeds'),
        centerTitle: true,
      ),
      body: _screens[_selectedIndex], // Display current selected screen
      bottomNavigationBar: BottomNavigationBar(
        selectedItemColor: Colors.lightBlue,
        unselectedItemColor: Colors.grey,
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.medication), // Changed icon for clarity
            label: 'Pill Reminders',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today),
            label: 'Appointment Reminders',
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
            icon: Icon(Icons.person),
            label: 'Emergency',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
