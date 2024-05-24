import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class AppointmentReminderScreen extends StatefulWidget {
  @override
  _AppointmentReminderScreenState createState() => _AppointmentReminderScreenState();
}

class Appointment {
  final String title;
  final DateTime from;
  final DateTime to;
  final String note;

  Appointment({
    required this.title,
    required this.from,
    required this.to,
    required this.note,
  });
}

class AppointmentDataSource extends CalendarDataSource<Appointment> {
  final List<Appointment> appointments;

  AppointmentDataSource(this.appointments);

  @override
  DateTime getStartTime(int index) => appointments[index].from;

  @override
  DateTime getEndTime(int index) => appointments[index].to;

  @override
  String getSubject(int index) => appointments[index].title;

  @override
  Color getColor(int index) => Colors.blue; // Set a default color

  @override
  bool isAllDay(int index) => false; // Assume appointments have specific times
}

class _AppointmentReminderScreenState extends State<AppointmentReminderScreen> {
  FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();
  List<Appointment> appointments = [];
  DateTime? selectedDate;
  String appointmentTitle = ""; // Track appointment title
  String appointmentNote = "";  // Track appointment note

  @override
  void initState() {
    super.initState();
    // Initialize flutter_local_notifications plugin
    flutterLocalNotificationsPlugin.initialize(
      InitializationSettings(
        android: AndroidInitializationSettings('@drawable/ic_launcher'), // Replace with your icon
        IOSInitializationSettings(), // Add iOS initialization if needed
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Appointment Reminders"),
      ),
      body: Column(
        children: [
          SfCalendar(
            view: CalendarView.month,
            dataSource: AppointmentDataSource(appointments), // Provide appointments list
            selectionChanged: (calendarSelectionDetails) =>
              setState(() => selectedDate = calendarSelectionDetails.date),
          ),
          if (selectedDate != null)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                children: [
                  Text("Selected Date: ${selectedDate!.toIso8601String()}"),
                  TextField(
                    decoration: InputDecoration(labelText: "Appointment Title"),
                    onChanged: (value) => setState(() => appointmentTitle = value),
                  ),
                  TextField(
                    decoration: InputDecoration(labelText: "Appointment Note"),
                    onChanged: (value) => setState(() => appointmentNote = value),
                  ),
                  ElevatedButton(
                    onPressed: () => _addAppointmentReminder(),
                    child: Text("Add Reminder"),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  void _addAppointmentReminder() async {
    if (selectedDate == null || appointmentTitle.isEmpty) {
      // Handle missing selection or title
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Please select a date and enter a title."),
        ),
      );
      return;
    }

    // Schedule notification using flutter_local_notifications plugin
    final now = DateTime.now();
    final notificationDetails = NotificationDetails(
      android: AndroidNotificationDetails(
        'channel_id',
        'channel_name',
        importance: Importance.Max,
        priority: Priority.High,
      ),
      iOS: IOSNotificationDetails(),
    );

    // Assuming you want the reminder at the appointment time (prompt for time?)
    await flutterLocalNotificationsPlugin.schedule(
      0,
      "Appointment Reminder",
      appointmentNote,
      DateTimeRange(
        start: DateTime(selectedDate!.year, selectedDate!.month, selectedDate!.day, now.hour, now.minute),
        end: DateTime(selectedDate!.year, selectedDate!.month, selectedDate!.day, now.hour, now.minute),
      ),
      notificationDetails,
    );

    // Add the appointment to the data source (update UI and potentially persist data)
appointments.add(
      Appointment(
        title: appointmentTitle,
        from: DateTime(selectedDate!.year, selectedDate!.month, selectedDate!.day,
          // Use a TimePicker to get the chosen time
          hour: /* Get hour from TimePicker */,
          minute: /* Get minute from TimePicker */),
        to: DateTime(selectedDate!.year, selectedDate!.month, selectedDate!.day,
          // Use a TimePicker to get the chosen time
          hour: /* Get hour from TimePicker */,
          minute: /* Get minute from TimePicker */),
        note: appointmentNote,
      ),
    );

    // Update UI to reflect the new appointment (optional)
    setState(() {
      // Update appointments list
    });

    // Persist data (optional) - Implement logic to save appointments to a database or file
  }

  // Add a method to display a TimePicker and update appointment time
  Future<void> _showTimePicker(BuildContext context) async {
    final pickedTime = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );

    if (pickedTime != null && selectedDate != null) {
      setState(() {
        // Update appointment time based on selected date and picked time
      });
    }
  }
}