// Initialize Firebase
var config = {
  apiKey: "AIzaSyBmWaSz3X8vvWRFEgBKzWY1ogzfmcfwSuo",
  authDomain: "class-intro-d29fa.firebaseapp.com",
  databaseURL: "https://class-intro-d29fa.firebaseio.com",
  projectId: "class-intro-d29fa",
  storageBucket: "class-intro-d29fa.appspot.com",
  messagingSenderId: "264623590109"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function() {
  loadTrains();
  $('.current-time').text("Current Time: " + moment(moment()).format("hh:mm"));
  setInterval(function() {
    $('.current-time').text("Current Time: " + moment(moment()).format("hh:mm"))
  }, 1000 * 60);
});

var name = "";
var destination = "";
var startTime = "";
var frequency = 0;

$("#submit").on("click", function(event) {
    event.preventDefault();
    name = $("#name").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();
    startTime = $("#start-time").val().trim();

    var startTimeMoment = moment(startTime, "hh:mm").subtract(1, "years");

    var difference = moment().diff(moment(startTimeMoment), "minutes");

    var remainder = difference % frequency;

    var minutesAway = frequency - remainder;

    var nextArrival = moment().add(minutesAway, "minutes");

    var nextArrivalTime = moment(nextArrival).format("hh:mm")

    database.ref().push({
      name: name,
      destination: destination,
      startTime: startTime,
      frequency: frequency,
      minutesAway: minutesAway,
      nextArrivalTime: nextArrivalTime
    });

    loadTrains();
});
    //recover from firebase
    function loadTrains() {
      $('#records').empty();
      database.ref().on("child_added", function(childSnapshot) {
        $("#records").append("<tr><td>" + childSnapshot.val().name + "</td>" +
          "<td>" + childSnapshot.val().destination + "</td>" +
          "<td>" + childSnapshot.val().frequency + "</td>" +
          "<td>" + childSnapshot.val().nextArrivalTime + "</td>" +
          "<td>" + childSnapshot.val().minutesAway + "</td>");
      });
}
