$(document).ready(function () {
    // Your web app's Firebase configuration
    let firebaseConfig = {
        apiKey: "AIzaSyAyr8Cd8NFxtYSMmnuqFHxD0MZ8bX3JCnE",
        authDomain: "train-scheduler-30dc8.firebaseapp.com",
        databaseURL: "https://train-scheduler-30dc8.firebaseio.com",
        projectId: "train-scheduler-30dc8",
        storageBucket: "train-scheduler-30dc8.appspot.com",
        messagingSenderId: "138478697246",
        appId: "1:138478697246:web:1063834ec6387dddc5270f"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    let database = firebase.database();

    let name;
    let destination;
    let train;
    let frequency = 0;

    document.querySelector("body > div:nth-child(4) > button").addEventListener("click", addTrain);

    function addTrain() {
        name = document.querySelector("#trainName").value.val().trim();;
        destination = document.querySelector("#Destination").value.val().trim();;
        train = document.querySelector("#firstTraintime").value.val().trim();;
        frequency = document.querySelector("#frequency").value.val().trim();;
        database.ref().push({
            name: name,
            destination: destination,
            train: train,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    }

    database.ref().on("child_added", function(childSnapshot) {
        var firstTrainNew = moment(childSnapshot.val().train, "hh:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        var minAway = childSnapshot.val().frequency - remainder;
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#table").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");

            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
        document.querySelector("#trainName").html(snapshot.val().name);
        document.querySelector("#Destination").html(snapshot.val().destination);
        document.querySelector("#firstTraintime").html(snapshot.val().train);
        document.querySelector("#frequency").html(snapshot.val().frequency);
    });
});