var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var lastScores = [];

var started = false;
var level = 0;

$("#submit").prop('disabled', true);

$(document).keypress(function() {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

$(".btn").click(function() {

  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length-1);
});

function checkAnswer(currentLevel) {

    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
      if (userClickedPattern.length === gamePattern.length){
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
    } else {
      playSound("wrong");
      $("body").addClass("game-over");
      $("#level-title").text("Game Over, Press Any Key to Restart");

      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 200);

      startOver();
    }
}


function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  animatePress(randomChosenColour);
  playSound(randomChosenColour);
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 200);
}

function playSound(name) {
  var audio = new Audio("/sounds/" + name + ".mp3");
  audio.play();
}

var avgScore =0

function startOver() {
  lastScores.push(level);
  console.log(lastScores);
  
  
  for(var i=0; i<lastScores.length; i++) {
    avgScore +=lastScores[i];
  }
  avgScore = avgScore/lastScores.length;
  avgScore = Math.round(avgScore * 100) / 100 ;
  if (lastScores.length >3) {
    $("#submit").prop('disabled', false);
    $("#submit").removeClass("disabled");
  }
  $("#avgScore").val(avgScore);
  avgScore = 0;

  level = 0;
  gamePattern = [];
  started = false;
}

$("#drop-button").click(function() {
  console.log("i am clicked");
  $("#myDropdown").toggleClass("hidden");
});
