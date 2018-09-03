// stuff i want happening before the user does anything
// =======================================================

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD9zPUMkjWSqkmmiVpBin-yKlPEyMK0xJg",
    authDomain: "not-firefox.firebaseapp.com",
    databaseURL: "https://not-firefox.firebaseio.com",
    projectId: "not-firefox",
    storageBucket: "not-firefox.appspot.com",
    messagingSenderId: "602317407996"
};
firebase.initializeApp(config);

// Shows the background for and slowly shows the jumbotron
$('#gameScreen').hide();
$('.jumbotron').hide();
$('.jumbotron').fadeIn(3000, function () {
    $('.jumbotron').show();
});


// variable declarations
// =======================================================
var userName = '';
var opponentName = '';
var userAttackDecision = '';
var opponentAttackDecision = '';
var userWinsAndLoses = '';
var opponentWinsAndLoses = '';
var numberOfUsers = 0;
var database = firebase.database();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

// functions
// =======================================================

// Function to create a user into the database
function addUser2database (id, user) {
    user = userName;
    database.ref('/users' + id).set({
        username: user,
    });
};


// game fucntionality
// =======================================================

// validates that the user has a name
$("button#submit2Start").on("click", function (event) {
    event.preventDefault();
    userName = $("input#userName").val().trim();
    var x = userName;
    if (x == '') {
        console.log("working");
        alert("need name please and thank you. . ."); // use modal look in browser bakayaro
        return false; // meaning you left the input box empty
    } else {
        // ensures that only name is recorded
        $("div#startButton").empty();
        var submit = $("<input id='startGame' class='btn btn-secondary btn-lg btn-block mb-2' type='button'></input>");
        submit.attr('value', userName + " now that you have input your name, click to start the match");
        $("div#startButton").append(submit);
        $("input#userName").val('');
        // to prevent from refreshing the page
        return false;
    } // meaning that you input a string into the box
}); // end of submit thing

// when starting the game this is what you press to get into the game
$(document.body).on("click", "#startGame", function (event) {
    numberOfUsers++;
    event.preventDefault();
    console.log(userName);
    $("#intermissionMessage").hide();
    $("section#startScreen").hide();
    $("section#gameScreen").show();
    $("#holdsUserName").text(userName);

    // sends user names to data base

    connectedRef.on("value", function (snap) {
    
        // If they are connected..
        if (snap.val()) {
            
            // Add user to the connections list.
            var con = connectionsRef.push(true);
            console.log(con);
            var userId = con.path.pieces_[1];
            connectionsRef.push(addUser2database(userId, userName));
    
            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });     // end of connected
}); // end of start game function


// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snap) {
    $("#intermissionOpponentMessage").hide();
    console.log("this is working");
    $("#holdsOpponentUserName").text(snap.userName);
    
});     // end of connections

/*
at this point I have the users that go into the page to show up in the firebase as a connected and as users. at this point however I am unable to get the second user to appear on in the opponent div in the html file. I also have not set up the rock paper scissor logic portion of the file, where rock > scissor > paper > rock . . . etc.
I was also intially going to have the opponents choice appear in a hidden object in the console log so the other player could look an win that way as said in the rules "use any means necessary". I also didnt figure out a way to make it so either the game was only ever limited to two players or have every two player can start a match and so on. As well I didnt make it so the chosen attack method was displayed on the userDiv. And I didn't create a way to track wins loses and so forth in the data base or the actual javascript file itself. I will be revising this file obviously in the next few weeks, but this is as far as I got until the due date.

*/

// when ever the wins, loses, and of course people online change, then update wins, loses, and next player and so on
// database.ref("/playerData").on("value"), function(snapshot) {
//     if (snapshot.child("userName").exists()){

//     }
// };  // end of data gatherer
