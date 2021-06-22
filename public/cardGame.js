var timeStop = false;
var scores = [];
$("#submit").prop("disabled", true);
function playGame() {
  timeStop = false;
    //card options
    const  cardArray = [
      {
        name: 'fries',
        img: '/images/fries.png'
      },
      {
        name: 'cheeseburger',
        img: '/images/cheeseburger.png'
      },
      {
        name: 'ice-cream',
        img: '/images/ice-cream.png'
      },
      {
        name: 'pizza',
        img: '/images/pizza.png'
      },
      {
        name: 'milkshake',
        img: '/images/milkshake.png'
      },
      {
        name: 'hotdog',
        img: '/images/hotdog.png'
      },
      {
        name: 'fries',
        img: '/images/fries.png'
      },
      {
        name: 'cheeseburger',
        img: '/images/cheeseburger.png'
      },
      {
        name: 'ice-cream',
        img: '/images/ice-cream.png'
      },
      {
        name: 'pizza',
        img: '/images/pizza.png'
      },
      {
        name: 'milkshake',
        img: '/images/milkshake.png'
      },
      {
        name: 'hotdog',
        img: '/images/hotdog.png'
      }
    ]
  
    cardArray.sort(() => 0.5 - Math.random())
  
    const grid = document.querySelector('.grid')
    const resultDisplay = document.querySelector('#result')
    let cardsChosen = []
    let cardsChosenId = []
    let cardsWon = []
  
    //create your board
    function createBoard() {
      for (let i = 0; i < cardArray.length; i++) {
        const card = document.createElement('img')
        card.classList.add("card");
        card.setAttribute('src', '/images/blank.png')
        card.setAttribute('data-id', i)
        card.addEventListener('click', flipCard)
        grid.appendChild(card)
      }
    }

    var time = 0;
  
    //check for matches
    function checkForMatch() {
      const cards = document.querySelectorAll('.card')
      const optionOneId = cardsChosenId[0]
      const optionTwoId = cardsChosenId[1]
      
      if(optionOneId == optionTwoId) {
        cards[optionOneId].setAttribute('src', '/images/blank.png')
        cards[optionTwoId].setAttribute('src', '/images/blank.png')
        alert('You have clicked the same image!')
      }
      else if (cardsChosen[0] === cardsChosen[1]) {
        alert('You found a match')
        cards[optionOneId].setAttribute('src', '/images/white.png')
        cards[optionTwoId].setAttribute('src', '/images/white.png')
        cards[optionOneId].removeEventListener('click', flipCard)
        cards[optionTwoId].removeEventListener('click', flipCard)
        cardsWon.push(cardsChosen);
        checkFoundAll(cardsWon);

      } else {
        cards[optionOneId].setAttribute('src', '/images/blank.png')
        cards[optionTwoId].setAttribute('src', '/images/blank.png')
        alert('Sorry, try again')
        time +=2;
      }
      cardsChosen = []
      cardsChosenId = []
    }
  
    //flip your card
    function flipCard() {
      let cardId = this.getAttribute('data-id')
      cardsChosen.push(cardArray[cardId].name)
      cardsChosenId.push(cardId)
      this.setAttribute('src', cardArray[cardId].img)
      if (cardsChosen.length ===2) {
        setTimeout(checkForMatch, 100)
      }
    }
  
    createBoard()
  }

function checkFoundAll(cardsWon) {
  if  (cardsWon.length === 6) {
    alert("You found themn all");
    timeStop = true;

  }
}
time = 0;
document.getElementById("time").innerHTML = "Time : " + time;

$("#start-btn").click(function() {
    playGame();
    $("#start-btn").prop('disabled', true);
    $("#start-btn").addClass("disabled-sart-btn");
    runTime();

});

function runTime() {
  var x = setInterval(function() {
    if (time > 90) {
      document.getElementById("time").innerHTML = "EXPIRED";
      $("#start-btn").prop('disabled', false);
      $("#start-btn").removeClass("disabled-sart-btn");
      clearInterval(x);
    }else if(timeStop) {
      scores.push(90-time);
      console.log("time = " + time);
      document.getElementById("time").innerHTML = "You found them all, click start to play again.";
      $("#start-btn").prop('disabled', false);
      $("#start-btn").removeClass("disabled-sart-btn");
      console.log(scores);
      destroyBoard();
      clearInterval(x);
      giveScore();
      time = 0;
    }else {
      document.getElementById("time").innerHTML = "Time : " + time + " seconds";
      time++;
    }
  }, 1000);
  
}

function giveScore() {
  var len = scores.length;
  var avg = 0;
  if(len >=3) {
    for(var i=0; i<len; i++) {
      avg += scores[i];
    }
    avg /= len;
    console.log(avg + " " + len);
    avg = Math.round(avg * 100) / 100 ;
    document.getElementById("avgScore").value = avg;
    $("#submit").removeClass("disabled");
    $("#submit").prop("disabled", false);
  }
}

function destroyBoard() {
  for(var i=0; i<12; i++) {
    $("img[data-id = " + i + "]").remove();
  }
}

$("#drop-button").click(function() {
    $("#myDropdown").toggleClass("hidden");
});