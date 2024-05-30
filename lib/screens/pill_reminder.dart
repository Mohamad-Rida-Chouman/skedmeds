import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Optional for date formatting

class PillReminder {
  final String medicationName;
  final TimeOfDay reminderTime;
  final int frequency; // Number of times to take the medication per day

  PillReminder(this.medicationName, this.reminderTime, this.frequency);

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
  String medicationName = "";
  TimeOfDay? reminderTime;
  int frequency = 1; // Default frequency is 1 (once a day)
  List<PillReminder> reminders = []; // List to store reminders

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
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("Frequency:"),
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
                onPressed: () => _saveReminder(),
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
                shrinkWrap: true,
                itemCount: reminders.length,
                itemBuilder: (context, index) {
                  final reminder = reminders[index];
                  return ReminderCard(
                    reminder: reminder,
                    onRemove:
                        _removeReminder, // Pass the _removeReminder function
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
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

  void _saveReminder() {
    if (medicationName.isEmpty || reminderTime == null) {
      return; // Handle empty medication name or missing reminder time
    }

    final reminder = PillReminder(medicationName, reminderTime!, frequency);
    reminders.add(reminder);

    setState(() {
      medicationName = "";
      reminderTime = null;
      frequency = 1; // Reset frequency for next reminder
    });
  }

  void _removeReminder(PillReminder reminder) {
    final index = reminders.indexOf(reminder);
    if (index == -1) return;

    setState(() {
      reminders.removeAt(index);
    });
  }
}
