document.addEventListener("DOMContentLoaded", Init);

var canvas;
var context;
var squares;

var sources =
  {
    hen:      './tex/hen.png',
    cock:     './tex/cock.png',
    wife:     './tex/wife.png',
  };

var images = {};

function Init() {
    //canvas
	  canvas = document.getElementById('myCanvas');
    context = canvas.getContext("2d");

    //squares
    squares = new Squares(canvas,10,256);

    //картинки
    for(var name in sources)
    {
      images[name] = new Image();
      images[name].src = sources[name];
    }

    squares.setOnClick(function clickAt(x,y) {
        console.log("clicked square " + x + "; " + y);
        if (x == hen.x && y == hen.y){
            chosen = hen;
        } else if (x == cock.x && y == cock.y) {
            chosen = cock;
        } else if (x == wife.x && y == wife.y) {
              chosen = wife;
        } else if (chosen != null && Math.abs(chosen.x - x) + Math.abs(chosen.y - y) < 2 && x > 0 && x < 9 && y > 0 && y < 9){
          chosen.x = x;
          chosen.y = y;
          chosen = null;
        }
    })
}

var hen = {
  x: 8,
  y: 4
};

var cock = {
  x: 1,
  y: 4
};

var wife = {
  x: 3,
  y: 6
}

var chosen = hen;

document.addEventListener("DOMContentLoaded", function ()
{

    setInterval(function()
    {
        squares.clearCanvas();
        if (chosen != null){
            drawSquaresAround(chosen.x,chosen.y,'#DED274');
            squares.underlineMouseSquare();
        }
        squares.drawImage(images.hen, hen.x, hen.y);
        squares.drawImage(images.cock, cock.x, cock.y - 0.5, 1, 1.5);
        squares.drawImage(images.wife, wife.x - 0.5, wife.y - 2, 2, 3);
    }, 100);
});

function drawSquaresAround(x,y,color) {
    if (x - 1 > 0)
        squares.underlineSquare(x - 1, y, color);
    if (x + 1 < 9)
        squares.underlineSquare(x + 1, y, color);
    if (y - 1 > 0)
        squares.underlineSquare(x, y - 1, color);
    if (y + 1 < 9)
        squares.underlineSquare(x, y + 1, color);
}

//SOME HELP FUNCTIONS

//случайное число от 0 до max
function getRandomInt(max)
{
  return Math.floor(Math.random() * Math.floor(max));
}

//чтобы находить направление к котлу
function getDirection(startX, startY, destX, destY)
{
  return {
    x: (destX - startX) / 10,
    y: (destY - startY) / 10
  };
}
