import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Optional for date formatting

class PillReminder {
  final String medicationName;
  final DateTime reminderDateTime;

  PillReminder(this.medicationName, this.reminderDateTime);
}

class PillReminderScreen extends StatefulWidget {
  @override
  _PillReminderScreenState createState() => _PillReminderScreenState();
}

class _PillReminderScreenState extends State<PillReminderScreen> {
  String medicationName = "";
  DateTime? reminderDateTime;
  List<PillReminder> reminders = []; // List to store reminders

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   title: Text("Pill Reminders"),
      // ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              TextField(
                decoration: InputDecoration(labelText: "Medication Name"),
                onChanged: (value) => setState(() => medicationName = value),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton(
                    onPressed: () => _showDatePicker(context),
                    child: Text("Set Date"),
                  ),
                  TextButton(
                    onPressed: () => _showTimePicker(context),
                    child: Text("Set Time"),
                  ),
                ],
              ),
              ElevatedButton(
                onPressed: () => _saveReminder(),
                child: Text("Save Reminder"),
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
                    title: Text(reminder.medicationName),
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

  void _saveReminder() {
    if (medicationName.isEmpty || reminderDateTime == null) {
      return; // Handle empty medication name or missing reminder time (optional)
    }

    final reminder = PillReminder(medicationName, reminderDateTime!);

    setState(() {
      reminders.add(reminder);
      medicationName = ""; // Reset medication name for next reminder
      reminderDateTime = null; // Reset reminder DateTime for next reminder
    });
  }

  void _removeReminder(int index) {
    setState(() {
      reminders.removeAt(index);
    });
  }
}
