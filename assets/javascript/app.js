$(document).ready(function () {
    var config = {
            apiKey: "AIzaSyDUP4t71sx6GQVrYxhmadIEHMyuK01uOsI",
            authDomain: "schedule-that-train.firebaseapp.com",
            databaseURL: "https://schedule-that-train.firebaseio.com",
            projectId: "schedule-that-train",
            storageBucket: "schedule-that-train.appspot.com",
            messagingSenderId: "400969810920"
    };
    firebase.initializeApp(config);

    // A variable to reference the database.
    var database = firebase.database();

    // Variables for the onClick event
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function () {
        event.preventDefault();
        // Storing and retreiving new train data
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        // Pushing to database
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function (childSnapshot) {
        var minAway;
        // Chang year so first train comes before now
        // Difference between the current and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        // Minutes until next train
        var minAway = childSnapshot.val().frequency - remainder;
        // Next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
            "</td><td>" + childSnapshot.val().destination +
            "</td><td>" + childSnapshot.val().frequency +
            "</td><td>" + nextTrain +
            "</td><td>" + minAway + "</td></tr>");

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").on("child_added", function (snapshot) {
        // Change the HTML to reflect
        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });
});