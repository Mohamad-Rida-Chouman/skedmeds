import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // For handling platform (Android/iOS) differences
import './appoinment_reminder.dart'; // Import sub-screens (if applicable)
import './pill_reminder.dart'; // Import sub-screens (if applicable)

class RemindersScreen extends StatefulWidget {
  // Remove TabController parameter

  RemindersScreen({Key? key}) : super(key: key); // Update constructor

  @override
  _RemindersScreenState createState() => _RemindersScreenState();
}

class _RemindersScreenState extends State<RemindersScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController; // Access controller from parent

  @override
  Widget build(BuildContext context) {
    _tabController =
        DefaultTabController.of(context); // Get controller in build
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: TabBar(
          controller: _tabController, // Use accessed controller
          tabs: const [
            Tab(text: "Pills"),
            Tab(text: "Appointments"),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          PillReminderScreen(), // Replace with your PillReminderScreen widget
          AppointmentReminderScreen(), // Replace with your AppointmentReminderScreen widget
        ],
      ),
    );
  }
}
