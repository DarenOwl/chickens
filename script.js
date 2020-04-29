document.addEventListener("DOMContentLoaded", Init);

var canvas;
var context;
var squares;

var sources =
  {
    hen:      './tex/hen.png',
    cock:     './tex/cock.png',
    wife:     './tex/wife.png',
    farmer:   './tex/farmer.png',
    chickensButton:   './tex/chickensButton.png',
    farmersButton:   './tex/farmersButton.png',
    confirmButton:   './tex/someButton.png'
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
        if (player.chickens == turn.chickens && game){
          onMapClick(x,y);
        }
        if (!game){
          onUIClick(x,y);
        }
    });
}
//------------------------------------------------------------------



//---------------------------Game-Objects----------------------------
//UI
var chickensButton = {x:3,y:5};
var farmersButton = {x:6,y:5};
var confirmButton = {x:9,y:5};
var teamImage = {x:4,y:5, source: null}

//CHICKENS
var hen = {  x: 8,  y: 4, canMove: true, active: true};
var cock = {  x: 1,  y: 4, canMove: true, active: true};

//FARMERS
var wife = {  x: 6,  y: 4, canMove: true, active: true};
var farmer = {  x: 3,  y: 4, canMove: true, active: true};

//------------------------------OnClick------------------------------

//--обработчик-во-время-игры
function onMapClick(x,y){
    //если в данный момент ходит не игрок, клики не обрабатываются
    if (player.chickens != turn.chickens){
      return;
    }

    //если игрок за курочек
    if (player.chickens){
      if (x == hen.x && y == hen.y){ //при клике курицу
        onCharacterClick(hen);
        return;
      } else if (x == cock.x && y == cock.y) { //при клике петуха
        onCharacterClick(cock);
        return;
      }
    }

    //если игрок за фермеров
    if (player.farmers){
      if (x == wife.x && y == wife.y) {
        onCharacterClick(wife);
        return;
      } else if (x == farmer.x && y == farmer.y) {
        onCharacterClick(farmer);
        return;
      }
    }

    //если клик не по персонажу, а по клетке поля
    //если "в руке" игрока есть персонаж
    if (chosen != null){
        move(x,y,chosen);
        chosen = null;
    }
}

//простая функция обработки клика на персонажа
function onCharacterClick(character){
  if (character.canMove){
     chosen = character;
  }
}

//--обработчик-меню-выбора-персонажей
function onUIClick(x,y){
  //клик на кнопку "выбрать курочек"
  if (x == chickensButton.x && y == chickensButton.y){
    //переключение роли
    player.chickens = true;
    player.farmers = false;
    //замена картинки команды
    teamImage.source = images.chickensButton;
  }

  //клик на кнопку "выбрать  фермеров"
  else if (x == farmersButton.x && y == farmersButton.y){
    //переключение роли
    player.chickens = false;
    player.farmers = true;
    //замена картинки команды
    teamImage.source = images.farmersButton;
  }

  //клик на кнопку "начать игру"
  else if (x >= teamImage.x && x <= teamImage.x + 1
          && y >= teamImage.y && y <= teamImage.y + 1){
      game = true;
  }
}


//----------------------------Frames-----------------------------

document.addEventListener("DOMContentLoaded", function ()
{
    setInterval(function()
    {
        squares.clearCanvas();

        //если запущена сама игра
        if (game){
            runGame();
        }
        //если мы находимся в меню
        else {
            drawCharacters();
            drawUI();
        }
    }, 100); // TODO: интервал млжно сделать в разы больше.
    //Здесь мало что анимируется.
    //Но может возникнуть задержка при отрисовке клеток вокруг chosen
});


//----------------------------ЛОГИКА-----------------------------
var game = false; //состояние игры
var chosen = null; //выбранный персонаж
var player = {  farmers: true,  chickens: false} //игрок
var turn = {  farmers: false,  chickens: true} //очередь

function runGame(){
    if (wife.x == cock.x && wife.y == cock.y || farmer.x == cock.x && farmer.y == cock.y){
      cock.active = false;
      cock.x = 5;
      cock.y = 9;
    }
    if (wife.x == hen.x && wife.y == hen.y  || farmer.x == hen.x && farmer.y == hen.y){
      hen.active = false;
      hen.x = 4;
      hen.y = 9;
    }

    if (hen.active == false && cock.active == false){
      game = false;
      resetField();
    }
    //ходит тот, чья очередь наступила
    if (turn.chickens){
      playChickenTurn();
    } else {
      playFarmersTurn();
    }

    if (chosen != null){
        drawSquaresAround(chosen.x,chosen.y,'#DED274');
    }
    squares.underlineMouseSquare();
    drawCharacters();
}

function resetField(){
  hen = {  x: 8,  y: 4, canMove: true, active: true};
  cock = {  x: 1,  y: 4, canMove: true, active: true};
  wife = {  x: 6,  y: 4, canMove: true, active: true};
  farmer = {  x: 3,  y: 4, canMove: true, active: true};
  chosen = null;
  turn = {  farmers: false,  chickens: true}
}

//переключение очереди
function switchTurn(){
    //переключение очереди
    turn.farmers = !turn.farmers;
    turn.chickens = !turn.chickens;
    if (turn.farmers) {
        //теперь эти персонажи могут ходить!
        farmer.canMove = true;
        wife.canMove = true;
    } else {
        //теперь эти персонажи могут ходить!
        hen.canMove = hen.active;
        cock.canMove = cock.active;
    }
    console.log('next turn: ' + ((turn.chickens) ? 'chickens' : 'farmers'));
}

function playChickenTurn(){
    if (!player.chickens){
        programPlays(hen,cock);
    }
    if (!hen.canMove && !cock.canMove){
        switchTurn();
    }
}

function playFarmersTurn(){
    if (!player.farmers){
        programPlays(wife,farmer);
    }
    if (!farmer.canMove && !wife.canMove){
        switchTurn();
    }
}

//PROGRAM PLAYS
delay = 0;

//ход программы имитирует ход игрока с задержками на "мыслительный процесс"
function programPlays(wom,man){
    if (delay < 5){
        drawSquaresAround(wom.x,wom.y,'#DED274');
    } else if (delay == 5) {
      if (wom == hen) playChicken(hen);
      else playFarmer(wom);
    } else if (delay < 10) {
        drawSquaresAround(man.x,man.y,'#DED274');
    } else if (delay == 10) {
      if (man == cock) playChicken(cock);
      else playFarmer(man);
    } else{
        delay = 0;
        return;
    }
    delay+=1;
}

//глупенькая функция, выбирающая первую попавшуюся свободную клетку рядом с персонажем
function playCharacterStupid(character){
    var d = [0,1,0,-1,0];
    for (var i = 0; i < 4; i++) {
        move(character.x+d[i], character.y+d[i+1], character);
        if (!character.canMove)
          break;
    }
}

function playChicken(chicken){
  var next = getSortedNext(chicken,wife,farmer);
  for (var i = 3; i >= 0; i--) {
      move(next[i].x, next[i].y, chicken);
      if (!chicken.canMove)
        break;
  }
}

function playFarmer(character){
  var next = getSortedNext(character,hen,cock);
  for (var i = 0; i < 4; i++) {
      move(next[i].x, next[i].y, character);
      if (!character.canMove)
        break;
  }
}

function getSortedNext(character, other1, other2){
  var d = [0,1,0,-1,0];
  //здесь будут отсортированные по расстоянию до other1 и other2 клетки
  var next = [null,null,null,null];
  /* обходим клетки вокруг character [C] в следующем порядке:
    [ ][3][ ]
    [4][C][2]
    [ ][1][ ]*/
  for (var i = 0; i < 4; i++) {
    next[i] = {x: character.x+d[i], y: character.y+d[i+1]};
  }

  //сортировка
  for (var i = 0; i < 4; i++) {
    var min = 100;
    for (var j = i; j < 4; j++) {
      //следующая координата
      var x = next[j].x;
      var y = next[j].y;
      //количество шагов до ближайшего врага
      var steps = Math.min(Math.abs(x - other1.x),Math.abs(x - other2.x))
                  + Math.min(Math.abs(y - other1.y),Math.abs(y - other2.y));
      if (steps < min){
        min = steps;
        var temp = next[i];
        next[i] = next[j];
        next[j] = temp;
      }
    }
  }
  return next;
}


//передвигает персонажа по полю
function move(x, y, character){
    if (//у персонажа есть свободный ход
        character.canMove
        //персонаж может двигаться только на 1 клетку вверх/вниз/вправо/влево
        && Math.abs(character.x - x) + Math.abs(character.y - y) < 2
        //персонаж не выйдет за пределы поля
        && x > 0 && x < 9 && y > 0 && y < 9
        && !inOneTeam(character, whoStayAt(x,y))){
        character.x = x;
        character.y = y;
        character.canMove = false;
    }
}

//проверка, что клетка не занята другим персонажем
// TODO: эта функция мешает фермерам ловить куриц >:(
function isEmpty(x,y){
  return !((x == hen.x && y == hen.y) ||
          (x == cock.x && y == cock.y) ||
          (x == farmer.x && y == farmer.y) ||
          (x == wife.x && y == wife.y));
}

function whoStayAt(x,y){
  if (x == hen.x && y == hen.y) return hen;
  else if (x == cock.x && y == cock.y) return cock;
  else if (x == farmer.x && y == farmer.y) return farmer;
  else if (x == wife.x && y == wife.y) return wife;
  else return null;
}

function inOneTeam(character1, character2){
  return ((character1 == hen || character2 == hen) && (character1 == cock || character2 == cock))
        || ((character1 == farmer || character2 == farmer) && (character1 == wife || character2 == wife));
}

//---------------------------Draw-----------------------------

//отрисовка персонажей
function drawCharacters(){
  //отрисовка доступных клеток вокруг выбранного персонажа
  if (chosen != null){
      drawSquaresAround(chosen.x,chosen.y,'#DED274');
  }

  squares.drawImage(images.hen, hen.x, hen.y);
  squares.drawImage(images.cock, cock.x, cock.y - 0.5, 1, 1.5);
  squares.drawImage(images.wife, wife.x - 0.5, wife.y - 2, 2, 3);
  squares.drawImage(images.farmer, farmer.x - 0.5, farmer.y - 2, 2, 3);
}

//отрисовка UI
function drawUI(){
    squares.drawImage(images.chickensButton, chickensButton.x, chickensButton.y);
    squares.drawImage(images.farmersButton, farmersButton.x, farmersButton.y);
    if (teamImage.source != null)
      squares.drawImage(teamImage.source, teamImage.x, teamImage.y, 2,2)
}

//отрисовка клеток вокруг заданной клетки x y
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

/* TODO:
дабавить возможность фермерам ловить куриц
*/
