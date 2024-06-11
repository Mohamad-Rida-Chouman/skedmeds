import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:intl/intl.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:uuid/uuid.dart';

class AppointmentReminder {
  final String? id;
  final String appointmentName;
  final DateTime reminderDateTime;

  AppointmentReminder(this.appointmentName, this.reminderDateTime, {this.id});

  static String generateId() => Uuid().v4();

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
  List<AppointmentReminder> reminders = [];
  bool isLoading = false;

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
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                ),
                onChanged: (value) => setState(() => appointmentName = value),
              ),
              SizedBox(
                height: 24.0,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton(
                    onPressed: () => _showDatePicker(context),
                    child: Text("Set Date"),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.white,
                      backgroundColor: Color(0xFF38B3CD),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4.0),
                      ),
                    ),
                  ),
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
                ],
              ),
              SizedBox(
                height: 8.0,
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
                      ? Center(child: Text('No appointments yet'))
                      : ListView.builder(
                          shrinkWrap: true,
                          itemCount: reminders.length,
                          itemBuilder: (context, index) {
                            final reminder = reminders[index];
                            return ListTile(
                              title: Text(reminder.appointmentName),
                              subtitle: Text(DateFormat.yMd()
                                  .add_jm()
                                  .format(reminder.reminderDateTime)),
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
    _fetchReminders();
  }

  void _fetchReminders() async {
    setState(() => isLoading = true);
    final currentUserId = FirebaseAuth.instance.currentUser?.uid;

    if (currentUserId == null) return;

    try {
      final snapshot = await _firestore
          .collection('appointments_reminder')
          .where('userId', isEqualTo: currentUserId)
          .get();
      reminders.clear();
      for (final doc in snapshot.docs) {
        final reminderMap = doc.data() as Map<String, dynamic>;
        if (reminderMap != null && reminderMap.containsKey("dateTime")) {
          final reminderString = reminderMap["dateTime"];
          try {
            final reminderDateTime = DateFormat('yyyy-MM-ddTHH:mm:ss.SSS')
                .parseStrict(reminderString);
            final reminder = AppointmentReminder(
                reminderMap["name"], reminderDateTime,
                id: doc.id);
            reminders.add(reminder);
          } on FormatException catch (error) {
            print("Error parsing date/time for reminder ${doc.id}: $error");
          }
        } else {}
      }
      setState(() {});
    } catch (error) {
      print("Error fetching appointments: $error");
    } finally {
      setState(() => isLoading = false);
    }
  }

  void _saveReminder() async {
    final currentUserId = FirebaseAuth.instance.currentUser?.uid;
    if (currentUserId == null) return;

    try {
      final docRef = await FirebaseFirestore.instance
          .collection('appointments_reminder')
          .add({
        'name': appointmentName,
        'dateTime':
            DateFormat('yyyy-MM-ddTHH:mm:ss.SSS').format(reminderDateTime!),
        'userId': currentUserId,
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
    }
  }

  void _removeReminder(int index) async {
    final id = reminders[index].id;
    if (id == null) return;

    try {
      await FirebaseFirestore.instance
          .collection('appointments_reminder')
          .doc(id)
          .delete();

      setState(() {
        reminders.removeAt(index);
      });
    } catch (error) {
      print("Error removing reminder: $error");
    }
  }
}
