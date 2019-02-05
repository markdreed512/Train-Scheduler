// Initialize Firebase
var config = {
    apiKey: "AIzaSyCi-b5OJYCAvaLnvTcaGhZbsfChTGirwTA",
    authDomain: "train-scheduler-e2094.firebaseapp.com",
    databaseURL: "https://train-scheduler-e2094.firebaseio.com",
    projectId: "train-scheduler-e2094",
    storageBucket: "train-scheduler-e2094.appspot.com",
    messagingSenderId: "533738691524"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submit").on("click", function (event) {
    event.preventDefault();
    var name = $('#name-input').val()
    var time = $('#time-input').val()
    //this! -> console.log("time: " , moment(time, "HH:mm").format('hh:mm A'))
    // var test = "15:30:00";
    // var formatted = moment(time, "HH:mm:ss").format("hh:mm A");
    // console.log(formatted);
    var destination = $('#destination-input').val()
    var frequency = $('#frequency-input').val()


    //push variables to database
    database.ref().push({
        name,
        time,
        destination,
        frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    })
    $('#name-input').val('')
    $('#time-input').val('')
    $('#destination-input').val('')
    $('#frequency-input').val('')




})
//update dom with data from database
database.ref().on("child_added", function (childSnap) {
    console.log("childSnap: ", childSnap.val())
    var row = $('<tr>');
    // var timeCell = $('<td>').text(childSnap.val().time)
    //instead of above(putting first train time in table), it should determine when next train will arrive
    //It should keep adding the frequency to the starting train time until is > current time
    //maybe:  time = moment(time).add(frequency, 'minutes').format('HH:mm')
    // while(var time < currentTime){
    //time = moment(time).add(frequency, 'minutes').format('HH:mm')
    //}
    //time = moment(time).add(frequency, 'minutes').format('HH:mm')
  
    // console.log("childSnap.frequency: ", childSnap.val().frequency);
    // console.log("duration: ", duration);
    var nameCell = $('<td>').text(childSnap.val().name);
    var destinationCell = $('<td>').text(childSnap.val().destination);
    var interval = childSnap.val().frequency
    var frequencyCell = $('<td>').text(interval);
    var nextCell = $('<td>');
    var minAwayCell = $('<td>');
    var firstTime = childSnap.val().time;
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var remainder = diffTime % interval
    var minAway = interval - remainder
    var nextTrain = moment().add(minAway, 'minutes').format('hh:mm')
    minAwayCell.append(minAway + " min")
    nextCell.append(nextTrain)
    row.append(nameCell);
    row.append(destinationCell);
    row.append(frequencyCell);
    row.append(nextCell)
    row.append(minAwayCell)
    $('#table-body').append(row);
})