// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart'; // For handling platform (Android/iOS) differences
// import 'appointment_reminder.dart'; // Import sub-screens (if applicable)
// import './pill_reminder.dart'; // Import sub-screens (if applicable)

// class RemindersScreen extends StatefulWidget {
//   // Remove TabController parameter

//   RemindersScreen({Key? key}) : super(key: key); // Update constructor

//   @override
//   _RemindersScreenState createState() => _RemindersScreenState();
// }

// class _RemindersScreenState extends State<RemindersScreen>
//     with SingleTickerProviderStateMixin {
//   late TabController _tabController; // Access controller from parent

//   @override
//   void initState() {
//     super.initState();
//     _tabController =
//         DefaultTabController.of(context)!; // Initialize in initState
//   }

//   @override
//   void dispose() {
//     _tabController.dispose(); // Dispose controller when widget is disposed
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         automaticallyImplyLeading: false,
//         title: TabBar(
//           controller: _tabController, // Use accessed controller
//           tabs: const [
//             Tab(text: "Appointments"),
//             Tab(text: "Pills"),
//           ],
//         ),
//       ),
//       body: TabBarView(
//         controller: _tabController,
//         children: [
//           AppointmentReminderScreen(), // Replace with your AppointmentReminderScreen widget
//           PillReminderScreen(), // Pass controller
//         ],
//       ),
//     );
//   }
// }
