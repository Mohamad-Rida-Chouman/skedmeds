import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Optional for date formatting
import 'package:uuid/uuid.dart'; // For generating unique IDs

class PillReminder {
  final String medicationName;
  final TimeOfDay reminderTime;
  final int frequency;
  final String? id;

  PillReminder(this.medicationName, this.reminderTime, this.frequency,
      {this.id});

  // Function to calculate the next alarm time for today
  DateTime getNextAlarmToday() {
    final now = DateTime.now();
    final scheduledTime = DateTime(
        now.year, now.month, now.day, reminderTime.hour, reminderTime.minute);

    // Check if scheduled time has already passed for today
    if (scheduledTime.isBefore(now)) {
      // If yes, calculate next occurrence based on frequency
      final timeDifference = Duration(hours: 24 ~/ frequency);
      return scheduledTime.add(timeDifference);
    } else {
      // Otherwise, return the scheduled time for today
      return scheduledTime;
    }
  }

  static String generateId() => Uuid().v4();

  // Added copyWith method
  PillReminder copyWith({
    String? medicationName,
    TimeOfDay? reminderTime,
    int? frequency,
    String? id,
  }) {
    return PillReminder(medicationName ?? this.medicationName,
        reminderTime ?? this.reminderTime, frequency ?? this.frequency,
        id: id ?? this.id);
  }
}

class ReminderCard extends StatelessWidget {
  final PillReminder reminder;
  final Function(PillReminder) onRemove;

  const ReminderCard({required this.reminder, required this.onRemove});

  String _getNextAlarmText() {
    final nextAlarm = reminder.getNextAlarmToday();
    return DateFormat.jm().format(nextAlarm);
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(reminder.medicationName),
                Text("Take ${reminder.frequency} times a day"),
                Text("Next alarm: ${_getNextAlarmText()}"),
              ],
            ),
            IconButton(
              icon: Icon(Icons.delete),
              onPressed: () => onRemove(reminder),
            ),
          ],
        ),
      ),
    );
  }
}

class PillReminderScreen extends StatefulWidget {
  @override
  _PillReminderScreenState createState() => _PillReminderScreenState();
}

class _PillReminderScreenState extends State<PillReminderScreen> {
  final CollectionReference<Map<String, dynamic>> remindersCollection =
      FirebaseFirestore.instance.collection('pill_reminders');

  String medicationName = "";
  TimeOfDay? reminderTime;
  int frequency = 1;
  List<PillReminder> reminders = [];
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchReminders();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _fetchReminders(); // Fetch again on screen activation
  }

  // Get the current user ID from Firebase Authentication
  String get currentUserId => FirebaseAuth.instance.currentUser!.uid;

  Query<Map<String, dynamic>> getUserRemindersCollection() {
    // Add the where clause to filter by current user ID
    return remindersCollection.where('userId', isEqualTo: currentUserId);
  }

  void _fetchReminders() async {
    setState(() => isLoading = true);
    try {
      final snapshot =
          await getUserRemindersCollection().get(); // Get documents
      reminders.clear();
      for (final doc in snapshot.docs) {
        // Loop through documents
        final reminderMap = doc.data() as Map<String, dynamic>; // Extract data
        final reminderTime = DateTime.parse(reminderMap["reminderTime"]);
        final reminder = PillReminder(
          reminderMap["medicationName"],
          TimeOfDay.fromDateTime(reminderTime),
          reminderMap["frequency"],
          id: doc.id,
        );
        reminders.add(reminder);
      }
    } catch (error) {
      print("Error fetching reminders: $error");
      // Handle error
    } finally {
      setState(() => isLoading = false);
    }
  }

  void _showTimePicker(BuildContext context) async {
    final selectedTime = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );

    if (selectedTime != null) {
      setState(() => reminderTime = selectedTime);
    }
  }

  void _saveReminder() async {
    if (medicationName.isEmpty || reminderTime == null) {
      return; // Handle empty fields
    }

    final reminder = PillReminder(medicationName, reminderTime!, frequency);
    final now = DateTime.now();
    final reminderTimeToSave = DateTime(
        now.year, now.month, now.day, reminderTime!.hour, reminderTime!.minute);

    final id = PillReminder.generateId();
    try {
      // Use add method on CollectionReference
      await FirebaseFirestore.instance
          .collection('pill_reminders') // Access the collection directly
          .add({
        'userId': currentUserId, // Include user ID
        "medicationName": reminder.medicationName,
        "reminderTime": reminderTimeToSave.toString(),
        "frequency": reminder.frequency,
      });
      reminders.add(reminder.copyWith(id: id)); // Update local list
      setState(() {
        medicationName = "";
        reminderTime = null;
        frequency = 1;
      });
    } catch (error) {
      print("Error saving reminder: $error");
      // Handle error (e.g., snackbar)
    }
  }

  void _removeReminder(PillReminder reminder) async {
    final docId = reminder.id;
    if (docId == null) return;

    // Access collection directly and use doc with ID
    try {
      await FirebaseFirestore.instance
          .collection('pill_reminders')
          .doc(docId)
          .delete()
          .then((_) {
        reminders.remove(reminder); // Remove by object reference
        setState(() {});
      }).catchError((error) => print("Error removing reminder: $error"));
    } catch (error) {
      // Handle potential errors (e.g., network issues)
      print("Error removing reminder: $error");
    }
  }

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
                  labelText: "Medication Name",
                  floatingLabelStyle: TextStyle(color: Colors.teal),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                ),
                onChanged: (value) => setState(() => medicationName = value),
              ),
              SizedBox(height: 16.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton(
                    onPressed: () => _showTimePicker(context),
                    child: Text("Set Time"),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.white,
                      backgroundColor: Color(0xFF38B3CD),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4.0),
                      ),
                    ),
                  ),
                  DropdownButton<int>(
                    value: frequency,
                    items: [
                      DropdownMenuItem(value: 1, child: Text("Once")),
                      DropdownMenuItem(value: 2, child: Text("Twice")),
                      DropdownMenuItem(value: 3, child: Text("Three times")),
                      // ... add more options for higher frequencies
                    ],
                    onChanged: (value) => setState(() => frequency = value!),
                  ),
                ],
              ),
              ElevatedButton(
                onPressed: _saveReminder,
                child: Text("Save Reminder"),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.white,
                  backgroundColor: Color(0xFF38B3CD),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(4.0),
                  ),
                ),
              ),
              SizedBox(height: 16.0),
              isLoading
                  ? Center(child: CircularProgressIndicator())
                  : reminders.isEmpty
                      ? Center(child: Text('No reminders yet'))
                      : ListView.builder(
                          shrinkWrap: true,
                          itemCount: reminders.length,
                          itemBuilder: (context, index) {
                            final reminder = reminders[index];
                            return ReminderCard(
                              reminder: reminder,
                              onRemove: _removeReminder,
                            );
                          },
                        ),
            ],
          ),
        ),
      ),
    );
  }
}
