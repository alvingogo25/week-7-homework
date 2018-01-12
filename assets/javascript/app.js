// Initialize Firebase
var config = {
  apiKey: "AIzaSyCaNTm2FFpVB7D6xzg6Mthrdbj_XU26dqk",
  authDomain: "alvin-train-schedule.firebaseapp.com",
  databaseURL: "https://alvin-train-schedule.firebaseio.com",
  projectId: "alvin-train-schedule",
  storageBucket: "",
  messagingSenderId: "269036602585"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function() {
  loadTrains();
  $('#currentTime').text("Current Time: " + moment(moment()).format("hh:mm"));
  setInterval(function() {
    $('#currentTime').text("Current Time: " + moment(moment()).format("hh:mm"))
  }, 1000 * 60);
});

var name = "";
var dest = "";
var frqncy = 0;
var firstTime = "";

$("#submit").on("click", function(event) {
  event.preventDefault();

  name = $("#name").val().trim();
  dest = $("#destination").val().trim();
  frqncy = $("#freq").val().trim();
  console.log(name, dest, frqncy);

  firstTime = $('#first-time').val().trim();
  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

  var difference = moment().diff(moment(firstTimeConverted), "minutes");

  var tRemainder = difference % frqncy;

  var minsAway = frqncy - tRemainder;
  // console.log("minutes away: " + minsAway)
  var nextArrival = moment().add(minsAway, "minutes");
  var nextArrivalTime = moment(nextArrival).format("hh:mm");
  // console.log("next train: "+ nextArrivalTime);

  // push data to firebase
  database.ref().push({
    name: name,
    dest: dest,
    frqncy: frqncy,
    nextArrivalTime: nextArrivalTime,
    minsAway: minsAway,
    firstTime: firstTime
  });

  loadTrains();

});

// loads train data from firebase
function loadTrains (){
  $('#schedule').empty();
  database.ref().on("child_added", function(childSnapshot){
    $("#schedule").append("<tr><td>" + childSnapshot.val().name + "</td>" +
    "<td>" + childSnapshot.val().dest + "</td>" +
    "<td>" + childSnapshot.val().frqncy + "</td>" +
    "<td>" + childSnapshot.val().nextArrivalTime + "</td>" +
    "<td>" + childSnapshot.val().minsAway + "</td>");
    $('td').attr('scope', 'col');
  });
}
