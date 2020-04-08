document.addEventListener("DOMContentLoaded", Init);

var canvas;
var context;
var squares;

var sources =
  {
    hen:      './tex/hen.png',
    cock:      './tex/cock.png'
  };

var images = {};

function Init() {
    //canvas
	  canvas = document.getElementById('myCanvas');
    context = canvas.getContext("2d");

    //squares
    squares = new Squares(canvas,8,256);

    //картинки
    for(var name in sources)
    {
      images[name] = new Image();
      images[name].src = sources[name];
    }

    squares.setOnClick(function clickAt(x,y) {
        console.log("click from script.js");
        if (x == hen.x && y == hen.y){
            chosen = hen;
        } else if (x == cock.x && y == cock.y) {
            chosen = cock;
        } else if (chosen != null && Math.abs(chosen.x - x) + Math.abs(chosen.y - y) < 2){
          chosen.x = x;
          chosen.y = y;
          chosen = null;
        }
    })
}

var hen = {
  x: 0,
  y: 0
};

var cock = {
  x: 3,
  y: 2
};

var chosen = hen;

document.addEventListener("DOMContentLoaded", function ()
{

    setInterval(function()
    {
        squares.clearCanvas();
        if (chosen != null){
            squares.underlineSquare(chosen.x, chosen.y);
            squares.underlineSquare(chosen.x - 1, chosen.y, 'yellow');
            squares.underlineSquare(chosen.x + 1, chosen.y, 'yellow');
            squares.underlineSquare(chosen.x, chosen.y - 1, 'yellow');
            squares.underlineSquare(chosen.x, chosen.y + 1, 'yellow');
            squares.underlineMouseSquare();
        }
        squares.drawImage(images.hen, hen.x, hen.y);
        squares.drawImage(images.cock, cock.x, cock.y - 0.5, 1, 1.5);
    }, 100);
});


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
