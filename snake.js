/**
* snake.js Creates snake object that will grow when it eats an
* apple object. Snake game is over when snake eats itself or
* hits a boundary.
*
* @author Michelle Adea
* @version  05/18/2019
*/

// Draws the snake and apple objects
var draw = function(snakeToDraw, apple) {
  //  assign object with color and pixels to drawableSnake
  var drawableSnake = { color: "green", pixels: snakeToDraw };
  // apple object initialized in array
  var drawableApple = { color: "red", pixels: [apple] };
  var drawableObjects = [drawableSnake, drawableApple];
  // drawableObjects passed into Chunk library
  CHUNK.draw(drawableObjects);
}

/* Moves segment in a certain direction
@param  segment   piece of snake object
*/
var moveSegment = function(segment) {
  switch(segment.direction) {
    case "down":
      return { top: segment.top + 1, left: segment.left }
    case "up":
      return { top: segment.top - 1, left: segment.left }
    case "right":
      return { top: segment.top, left: segment.left + 1 }
    case "left":
      return { top: segment.top, left: segment.left - 1 }
    default:
      return segment;
  }
}

/* Moves secondary segments.
@param  index    index of snake object
@param  snake   snake object
*/
var segmentFurtherForwardThan = function(index, snake) {
  //return snake[index - 1] || snake[index];
  if (snake[index - 1] === undefined) {
    return snake[index]
  } else {
    return snake[index - 1]
  }
}

/* Moves snake object, updating the oldSegment and assigning direction
*/
var moveSnake = function(snake) {
  return snake.map(function(oldSegment, segmentIndex) {
    var newSegment = moveSegment(oldSegment);
    // Calls snake object
    newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
    return newSegment;
  });
}

var growSnake = function(snake) {
    //identifies last index in array snake
    var indexOfLastSegment = snake.length - 1
    var lastSegment = snake[indexOfLastSegment]
    // adds another segment to the snake at last value
    snake.push( { top: lastSegment.top, left: lastSegment.left } )
    return snake;
}

var ate = function(snake, otherThing) {
  var head = snake[0]
  return CHUNK.detectCollisionBetween([head], otherThing)
}

var advanceGame = function() {
  var newSnake = moveSnake(snake);

  // checks if snake eats itself
  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You ate yourself!");
  }

  // checks if snake eats apple
  if (ate(newSnake, [apple])) {
    newSnake = growSnake(newSnake);
    apple = CHUNK.randomLocation();
  }

  // checks if snake hits boundary
  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! you hit a wall!");
  }

  snake = newSnake;
  draw(snake, apple);

  /* Original Code */
  /*snake = moveSnake(snake)
  if (CHUNK.detectCollisionBetween([apple], snake)) {
    // snake grows by one segment
    snake = growSnake(snake)
    // apple is reproduced in a random location
    apple = CHUNK.randomLocation()
  }
  if (CHUNK.detectCollisionBetween(snake, CHUNK.gameBoundaries())) {
    CHUNK.endGame()
    CHUNK.flashMessage("Whoops! you hit a wall!")
  }
  // draws snake and apple objects
  draw(snake, apple);*/
}

// Changes the direction of the object
var changeDirection = function(direction) {
  snake[0].direction = direction;
}

// Declares apple and snake objects
var apple = CHUNK.randomLocation();
var snake = [{ top: 0, left: 0, direction: "down" }, { top: -1, left: 0, direction: "down" }];

/*
Executes a function certain number of times per second
@param   advanceGame calls function
@param  1   # of moves per second, the greater the # the faster the movement
*/
CHUNK.executeNTimesPerSecond(advanceGame, 1);
CHUNK.onArrowKey(changeDirection);
