import 'package:flutter/material.dart';
import '../screens/reminder.dart'; // Import RemindersScreen
import '../screens/pharmacy.dart';
import '../screens/entertainment.dart';
import '../screens/emergency.dart';
import '../screens/profile.dart';

class Navbar extends StatefulWidget {
  @override
  _NavbarState createState() => _NavbarState();
}

class _NavbarState extends State<Navbar> {
  int _selectedIndex = 0; // Track selected index for navigation bar

  final List<Widget> _screens = []; // List of screens to navigate to

  @override
  void initState() {
    super.initState();
    _screens.addAll([
      // Create screens with TabController (assuming 2 tabs for reminders)
      DefaultTabController(
        length: 2,
        child: RemindersScreen(),
      ),
      PharmacyScreen(),
      EntertainmentScreen(),
      EmergencyScreen(),
      ProfileScreen(),
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
            icon: Icon(Icons.calendar_today),
            label: 'Reminders',
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
