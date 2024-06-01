import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Optional for date formatting
import 'package:uuid/uuid.dart'; // For generating unique IDs

class PillReminder {
  final String medicationName;
  final TimeOfDay reminderTime;
  final int frequency;
  final String? id; // Optional ID field (can be null)

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

  static String generateId() => Uuid().v4(); // Static method to generate ID

  // Added copyWith method
  PillReminder copyWith({
    String? medicationName,
    TimeOfDay? reminderTime,
    int? frequency,
    String? id,
  }) {
    return PillReminder(
      medicationName ?? this.medicationName,
      reminderTime ?? this.reminderTime,
      frequency ?? this.frequency,
      id: id ?? this.id,
    );
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
  final CollectionReference remindersCollection = FirebaseFirestore.instance
      .collection('pill_reminders'); // Reference to reminders collection
  String medicationName = "";
  TimeOfDay? reminderTime;
  int frequency = 1; // Default frequency is 1 (once a day)
  List<PillReminder> reminders = [];
  bool isLoading = false; // Flag to indicate data loading state

  @override
  void initState() {
    super.initState();
    _fetchReminders();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _fetchReminders(); // Fetch reminders again when the screen becomes active
  }

  void _fetchReminders() async {
    setState(() => isLoading = true);
    try {
      final snapshot = await remindersCollection.get();
      reminders.clear();
      for (final doc in snapshot.docs) {
        final reminderMap = doc.data() as Map<String, dynamic>;
        final reminderTime =
            DateTime.parse(reminderMap["reminderTime"]); // Parse time string
        final reminder = PillReminder(
          reminderMap["medicationName"],
          TimeOfDay.fromDateTime(reminderTime),
          reminderMap["frequency"],
        );
        reminders.add(reminder);
      }
    } catch (error) {
      print("Error fetching reminders: $error");
      // ... handle error
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
      return; // Handle empty medication name or missing reminder time
    }

    final reminder = PillReminder(
        medicationName, reminderTime!, frequency); // Create reminder object
    final now = DateTime.now();
    final reminderTimeToSave = DateTime(
        now.year, now.month, now.day, reminderTime!.hour, reminderTime!.minute);

    final id = PillReminder.generateId(); // Generate unique ID

    try {
      final docRef = await remindersCollection.doc(id).set({
        // Use generated ID
        "medicationName": reminder.medicationName,
        "reminderTime": reminderTimeToSave.toString(),
        "frequency": reminder.frequency,
      });
      reminders.add(
          reminder.copyWith(id: id)); // Update reminder with ID for local list
      setState(() {
        medicationName = "";
        reminderTime = null;
        frequency = 1; // Reset frequency for next reminder
      });
    } catch (error) {
      print("Error saving reminder: $error");
      // Display user-friendly error message here (e.g., snackbar)
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving reminder'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _removeReminder(PillReminder reminder) {
    final docId = reminder.id;
    if (docId == null) return;

    // Remove the reminder from Firestore
    remindersCollection.doc(docId).delete().then((_) {
      reminders.remove(reminder); // Remove by object reference
      setState(() {});
    }).catchError(
        (error) => print("Error removing reminder: $error")); // Handle errors
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
