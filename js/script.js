var computer; // X or X
var human; // X or O
var playerTurn; //Will be either X or O

$(document).ready(function() {

  /* The buttons click functions */
    /* Menu btns */
  $(".player").on("click", function() {
    $(".player").removeClass("active");

    if ($(this).attr("id") == "1player") {
      $(".side").css({"display": "initial"});
    }
    else {
      $(".active").removeClass("active"); //We dont want an active class out of display
      $(".side").css({"display": "none"});
    }
    $(this).addClass("active");
  });

  $(".side").on("click", function() {
    $(".side").removeClass("active");
    $(this).addClass("active");
  });

  $("#play").on("click", startGame);
    /* --- menu end */

  $(".square").click(function() {
    makeMove(this);
  });
  /* ------------- */
});

function startGame() {
  var choices = $(".active");
  playerTurn = "O";

  if (choices.length == 2) {
    //Has chosen to play one player mode
    for (var i = 0; i < 2; i++) {
      var id = choices[i].id;
      if (id == "x") {
        computer = "O";
        human = "X";
      }
      else if (id == "o") {
        computer = "X";
        human = "O";
      }
    }
  }

  //Next we enter the game mode
  $("#menu").fadeTo(300, 0, function() {
    $("#menu").css({"display": "none"});
    $("#game").css({
      "display": "-webkit-flex",
      "display": "flex"
    });
    $("#game").fadeTo(300, 1);
  });
}

function makeMove(square) {
  var content = $(square).text().split(/\s*/).join(""); //removes all whitespace
  if (content != "") {
    //There is already a x or an o in the square
    return;
  }

  $(square).html("<div class='xo'>" + playerTurn + "</div>");

  var board = getBoard();

  if (isWin(board, playerTurn)) {
    makeEndScreen(playerTurn);
    return;
  }
  else if(availableSquares(board).length == 0) {
    makeEndScreen("tie");
  }

  nextTurn();

  if (computer) {
    var bestMove = minimax(board, computer).index + 1; // Adds one since the index of squares starts on one
    $("#square" + bestMove).html("<div class='xo'>" + playerTurn + "</div>");

    board = getBoard();
    if (isWin(board, playerTurn)) {
      makeEndScreen(playerTurn);
      return;
    }
    else if(availableSquares(board).length == 0) {
      makeEndScreen("tie");
    }

    nextTurn();
  }
}

function nextTurn() {
  if (playerTurn == "O") {
    playerTurn = "X";
  }
  else {
    playerTurn = "O";
  }
}

function getBoard() {
  var board = [];
  for (var i = 1; i <= 9; i++) {
    var text = $("#square" + i).text();

    if (text == "X") {
      board.push("X");
    }
    else if(text == "O") {
      board.push("O");
    }
    else {
      board.push(i-1);
    }
  }

  return board;
}

function minimax(board, player) {
  let avail = availableSquares(board);
  if (isWin(board, human)) {
    return {
      score: -10
    };
  } else if (isWin(board, computer)) {
    return {
      score: 10
    };
  } else if (avail.length === 0) {
    return {
      score: 0
    };
  }

  var moves = [];
  for (var i = 0; i < avail.length; i++) {
    var move = {};
    move.index = board[avail[i]];
    board[avail[i]] = player;

    if (player == computer) {
      var g = minimax(board, human);
      move.score = g.score;
    } else {
      var g = minimax(board, computer);
      move.score = g.score;
    }
    board[avail[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player === computer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function availableSquares(board) {
  return board.filter(s => s != "O" && s != "X");
}

function isWin(board, player) {

  if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[4] == player && board[6] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player)
  ) {
    return true;
  }
  else {
    return false;
  }
}

function makeEndScreen(playerOrTie) {
  if (playerOrTie == "tie") {
    $("#end-text").text("It was a tie!");
  }
  else {
    $("#end-text").text(playerOrTie + " won the game!");
  }

  $("#game").fadeTo(300, 0, function() {
    $("#game").css({"display": "none"});
    $("#game-over-screen").css({
      "display": "-webkit-flex",
      "display": "flex"
    });
    $("#game-over-screen").fadeTo(300, 1);
  });
}
