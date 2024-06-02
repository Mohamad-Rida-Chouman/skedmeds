import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:intl/intl.dart'; // Optional for date formatting
import 'package:cloud_firestore/cloud_firestore.dart'; // Firestore dependency
import 'package:uuid/uuid.dart'; // For generating unique IDs

class AppointmentReminder {
  final String? id; // Added ID field
  final String appointmentName;
  final DateTime reminderDateTime;

  AppointmentReminder(this.appointmentName, this.reminderDateTime, {this.id});

  static String generateId() => Uuid().v4(); // Static method to generate ID

  AppointmentReminder copyWith(
      {String? id, String? appointmentName, DateTime? reminderDateTime}) {
    return AppointmentReminder(
      appointmentName ?? this.appointmentName,
      reminderDateTime ?? this.reminderDateTime,
      id: id ?? this.id,
    );
  }
}

class AppointmentReminderScreen extends StatefulWidget {
  @override
  _AppointmentReminderScreenState createState() =>
      _AppointmentReminderScreenState();
}

class _AppointmentReminderScreenState extends State<AppointmentReminderScreen> {
  String appointmentName = "";
  DateTime? reminderDateTime;
  List<AppointmentReminder> reminders = []; // List to store reminders

  // Add a reference to Firestore
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              TextField(
                decoration: InputDecoration(
                  labelText: "Appointment Title",
                  floatingLabelStyle: TextStyle(color: Colors.teal),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(
                      color: Theme.of(context)
                          .primaryColor, // Use theme's blue color
                    ),
                  ),
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(
                      color: Theme.of(context)
                          .primaryColor, // Use theme's blue color
                    ),
                  ),
                ),
                onChanged: (value) => setState(() => appointmentName = value),
              ),
              SizedBox(
                height: 16.0,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton(
                    onPressed: () => _showDatePicker(context),
                    child: Text("Set Date"),
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
                  TextButton(
                    onPressed: () => _showTimePicker(context),
                    child: Text("Set Time"),
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
              ElevatedButton(
                onPressed: _saveReminder,
                child: Text("Save Reminder"),
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
              SizedBox(height: 16.0), // Add spacing
              Text(
                "Reminders:",
                style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
              ),
              ListView.builder(
                // Display reminders using ListView.builder
                shrinkWrap: true, // Prevent list from expanding unnecessarily
                itemCount: reminders.length,
                itemBuilder: (context, index) {
                  final reminder = reminders[index];
                  return ListTile(
                    title: Text(reminder.appointmentName),
                    subtitle: Text(DateFormat.yMd()
                        .add_jm()
                        .format(reminder.reminderDateTime)),
                    // Use DateFormat for user-friendly date/time formatting (optional)
                    trailing: IconButton(
                      icon: Icon(Icons.delete),
                      onPressed: () => _removeReminder(index),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showDatePicker(BuildContext context) async {
    final selectedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime(DateTime.now().year + 5),
    );

    if (selectedDate != null) {
      setState(() => reminderDateTime = selectedDate);
    }
  }

  void _showTimePicker(BuildContext context) async {
    final selectedTime = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );

    if (selectedTime != null) {
      final selectedDateTime = DateTime(
        reminderDateTime?.year ?? DateTime.now().year,
        reminderDateTime?.month ?? DateTime.now().month,
        reminderDateTime?.day ?? DateTime.now().day,
        selectedTime.hour,
        selectedTime.minute,
      );
      setState(() => reminderDateTime = selectedDateTime);
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchReminders(); // Fetch reminders on app launch
  }

  void _fetchReminders() async {
    final currentUserId =
        FirebaseAuth.instance.currentUser?.uid; // Get current user ID

    if (currentUserId == null) return; // Handle no logged-in user

    try {
      final snapshot = await _firestore
          .collection('appointments_reminder')
          .where('userId', isEqualTo: currentUserId) // Filter by user ID
          .get();
      reminders.clear();
      for (final doc in snapshot.docs) {
        final reminderMap = doc.data() as Map<String, dynamic>;
        if (reminderMap != null && reminderMap.containsKey("dateTime")) {
          final reminderString = reminderMap["dateTime"];
          try {
            // Parse using ISO 8601 format (same as before)
            final reminderDateTime = DateFormat('yyyy-MM-ddTHH:mm:ss.SSS')
                .parseStrict(reminderString);
            final reminder = AppointmentReminder(
                reminderMap["name"], reminderDateTime,
                id: doc.id);
            reminders.add(reminder);
          } on FormatException catch (error) {
            print("Error parsing date/time for reminder ${doc.id}: $error");
            // Handle parsing errors (optional)
          }
        } else {
          // Handle cases where data is missing (optional)
        }
      }
      setState(() {});
    } catch (error) {
      print("Error fetching appointments: $error");
      // Handle errors (e.g., snackbar)
    }
  }

  void _saveReminder() async {
    final currentUserId = FirebaseAuth.instance.currentUser?.uid;
    if (currentUserId == null) return; // Handle no logged-in user

    try {
      final docRef = await FirebaseFirestore.instance
          .collection('appointments_reminder')
          .add({
        'name': appointmentName,
        'dateTime': DateFormat('yyyy-MM-ddTHH:mm:ss.SSS')
            .format(reminderDateTime!), // Use ISO 8601 format
        'userId': currentUserId, // Add userID field
      });

      setState(() {
        reminders.add(AppointmentReminder(
          appointmentName,
          reminderDateTime!,
          id: docRef.id,
        ));
        appointmentName = "";
        reminderDateTime = null;
      });
    } catch (error) {
      print("Error saving reminder: $error");
      // Handle errors (e.g., snackbar)
    }
  }

  void _removeReminder(int index) async {
    setState(() {
      reminders.removeAt(index);
    });

    final id = reminders[index].id;
    if (id != null) {
      try {
        await FirebaseFirestore.instance
            .collection('appointments_reminder')
            .doc(id)
            .delete();
      } catch (error) {
        print("Error removing reminder: $error");
        // Handle errors (e.g., snackbar)
      }
    }
  }
}
