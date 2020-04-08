function Squares(sqCanvas, sqSize, sqImageScale) {

    var canvas = sqCanvas;
    var context = canvas.getContext("2d");
    var scaleItem = sqImageScale;

    var currentSquare = {
      x: 0,
      y: 0
    }

    this.mousePos = function() {
      return {
        x: currentSquare.x,
        y: currentSquare.y
      }
    }

    var click = function(x,y){
      console.log("click from s.js");
    };

    this.setOnClick = function(clickfunc){
      click = clickfunc;
    }

    var size = scaleItem * sqSize;
    var pxScale = canvas.offsetWidth / size;
    context.canvas.width  = size;
    context.canvas.height = size;

    //шрифты
    context.font = "10px Arial";
    context.fillStyle = "#84ffff";
    context.textAlign = "center";

    //координаты квадрата, в котором находится курсор
    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      var cellSize = rect.width / sqSize;
      return {
          x: Math.trunc((evt.clientX - rect.left) / cellSize),
          y: Math.trunc((evt.clientY - rect.top) / cellSize)
        }
    };

    canvas.onclick = function(e) {
        click(getMousePos(canvas, e).x, getMousePos(canvas, e).y);
    };

    canvas.onmousemove = function (e) {
      currentSquare.x = getMousePos(canvas, e).x * scaleItem
      currentSquare.y = getMousePos(canvas, e).y * scaleItem;
    }

    this.drawImage = function(image, x, y, width = 1, height = 1){
        context.drawImage(image, x * scaleItem, y * scaleItem, width * scaleItem, height * scaleItem);
    }

    this.underlineMouseSquare = function(){
        context.beginPath();
        context.rect(currentSquare.x, currentSquare.y, sqImageScale, sqImageScale);
        context.lineWidth = 8;
        context.strokeStyle = 'black';
        context.stroke();
    }

    this.underlineSquare = function(x,y,color = 'black') {
        context.beginPath();
        context.rect(x * sqImageScale, y * sqImageScale, sqImageScale, sqImageScale);
        context.lineWidth = 8;
        context.strokeStyle = color;
        context.stroke();
    }

    this.clearCanvas = function(){
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
};
