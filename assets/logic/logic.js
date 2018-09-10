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
var userName = [];
var userAttackDecision = '';
var opponentAttackDecision = '';
var userWinsAndLoses = '';
var opponentWinsAndLoses = '';
var wins = 0;
var loses = 0;
var database = firebase.database();
var connection = database.ref("/users");

// functions
// =======================================================

// Function to create a user into the database
function addUser2database(users, wins, loses) {
    users = userName;
    var userData = {
        username: users,
        wins: wins,
        loses: loses,
        attack: ""
    };
    database.ref('/users').push(userData);
};


// game fucntionality
// =======================================================


$(".btn").on("click", function (event) {
    event.preventDefault();
    if ($(this).val() === "rock") {
        userAttackDecision = "rock";
    };
    if ($(this).val() === "scissor") {
        userAttackDecision = "scissor";
    };
    if ($(this).val() === "paper") {
        userAttackDecision = "paper";
    };
    console.log(userAttackDecision);
});


// this should actually be something that looks at the batabases stuff
$(".btn").on("click", function (event) {
    event.preventDefault();

    // if for game logic
    //      on click of both action buttons, chekc through this stuff. maybe if both players choices return true and theyre originally set to false?

    if (((userAttackDecision === "rock") && (opponentAttackDecision === "rock")) || ((userAttackDecision === "paper") && (opponentAttackDecision === "paper")) || ((userAttackDecision === "scissor") && (opponentAttackDecision === "scissor"))) {
        //  no score to either party
        console.log("neither party recieves a point");
    };
    if ((userAttackDecision === "rock" && opponentAttackDecision === "scissor") || (userAttackDecision === "scissor" && opponentAttackDecision === "paper") || (userAttackDecision === "paper" && opponentAttackDecision === "rock")) {
        //  score 1 to your player score
        console.log("the user received a point");
        wins++;
    };
    if ((userAttackDecision === "rock" && opponentAttackDecision === "paper") || (userAttackDecision === "scissor" && opponentAttackDecision === "rock") || (userAttackDecision === "paper" && opponentAttackDecision === "scissor")) {
        //  score 1 to your oppenonent score
        console.log("the opponent received a point");
        loses++;
    };

    // end of game logic
});

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
    event.preventDefault();
    console.log(userName);
    $("section#startScreen").hide();
    $("section#gameScreen").show();
    $("#holdsUserName").text(userName);
    addUser2database(userName, wins, loses);
    
    
    // sends user names to data base
    
}); // end of start game function

// sends the last added player info to the page, this of course requires the players to be on at the same time
database.ref('/users').on("child_added", function(childSnapshot) {
    console.log(childSnapshot);
    var player2Name = childSnapshot.val().username;
    var player2 = childSnapshot.node_.children_.root_.value.value_;

    if (player2Name === userName){
        // if one player
        console.log("butttttt");
        // console.log(childSnapshot.node_.children_.root_.value.value_);

    } else{
        // if two players
        console.log(player2Name);
        $("#holdsOpponentUserName").text(player2);
    }

    // childSnapshot.onDisconnect().remove();       // attempt at removing this child node from data base
});

connection.on("value", function (snap) {
    
    // If they are connected..
    var randKEY = snap.node_.children_.root_.key;
    console.log(randKEY);
    
    if (snap.val()) {
        // Remove user from the connection list when they disconnect.
        // 
        database.ref(randKEY).onDisconnect().remove();
    }
    
    // makes sure there are only two players
    console.log(snap.numChildren());
    if (snap.numChildren() === 3){
        alert("too many users, try again later");
    }
});




/*
at this point I have the users that go into the page to show up in the firebase as a connected and as users. at this point however I am unable to get the second user to appear on in the opponent div in the html file. I also have not set up the rock paper scissor logic portion of the file, where rock > scissor > paper > rock . . . etc.
I was also intially going to have the opponents choice appear in a hidden object in the console log so the other player could look an win that way as said in the rules "use any means necessary". I also didnt figure out a way to make it so either the game was only ever limited to two players or have every two player can start a match and so on. As well I didnt make it so the chosen attack method was displayed on the userDiv. And I didn't create a way to track wins loses and so forth in the data base or the actual javascript file itself. I will be revising this file obviously in the next few weeks, but this is as far as I got until the due date.

*/

// when ever the wins, loses, and of course people online change, then update wins, loses, and next player and so on
// database.ref("/playerData").on("value"), function(snapshot) {
    //     if (snapshot.child("userName").exists()){
        
//     }
// };  // end of data gatherer