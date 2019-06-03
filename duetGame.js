// console.log("Javascript connected..");

var myGamePiece; var myObstacles=[]; var myScore1; var myScore2;
var play=1; var v_speed=3; var pause=false;
var GameArea; var interval;

document.getElementById('myCanvas').style.display='none';

document.getElementById("PlayGame1").onclick = function() {

    GameArea.start();

     document.getElementById('loadtext').style.display='none';
     document.getElementById('PlayGame1').style.display='none';
     document.getElementById('inst').style.display='none';
     document.getElementById('myCanvas').style.display='block';
     document.getElementById('screen1').style.display='none';
     document.getElementById('Restart').style.display='block';

     v_speed=3;
     myObstacles=[];

};


GameArea= {
   canvas : document.getElementById("myCanvas"),
   start : function()
   {
    myGamePiece= new ControllerWheel(225,500,70,10,0,"#fabc41","#00bd56");
    myScore= new Score(340,550);


    this.canvas.width= 450;
    this.canvas.height=580;
    this.context=this.canvas.getContext("2d");
    this.frameNo=0;
    interval=setInterval(updateGameArea,20);

    window.addEventListener('keydown', function (e) {
           GameArea.key = e.keyCode;
       });
       window.addEventListener('keyup', function (e) {
           GameArea.key = false;
       });
    },
  clear: function()
  {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
  },
  resume: function()
  {
    interval=setInterval(updateGameArea,20);
  },
  stop: function()
  {
    clearInterval(interval);

  }
};

//-------------------- Obstacle -------------------------//
function Obstacle(width, height, color, X, Y)
{

  this.width=width;
  this.height=height;
  this.X=X;
  this.Y=Y;
    this.speedY = 0;
  this.color=color;

  this.update=function()
  {
    ctx=GameArea.context;
           ctx.fillStyle = color;
           ctx.fillRect(this.X, this.Y, this.width, this.height);
  };

  this.newPos=function()
  {

    this.Y+=this.speedY;
  };

}
//-------------------- Controller Wheel -------------------------//
function ControllerWheel(X,Y,orbitRadius,radius,theta,color1,color2)
{
  this.X=X;
  this.Y=Y;
  this.theta=theta;
  this.orbitRadius=orbitRadius;
  this.radius=radius;
  this.color1=color1;
  this.color2=color2;
  this.turn = 0;



  this.update=function()
  {
  this.x1=this.X+this.orbitRadius*Math.cos(this.theta);
  this.y1=this.Y+this.orbitRadius*Math.sin(this.theta);

  this.x2=this.X+this.orbitRadius*Math.cos(Math.PI+this.theta);
  this.y2=this.Y+this.orbitRadius*Math.sin(Math.PI+this.theta);

  ctx=GameArea.context;

  ctx.strokeStyle="white";
  ctx.beginPath();
  ctx.arc(this.X,this.Y,this.orbitRadius,0,Math.PI*2,true);
  ctx.stroke();

  ctx.fillStyle=this.color1;
  ctx.beginPath();
  ctx.arc(this.x1, this.y1,this.radius,0,Math.PI*2,true);
  ctx.fill();

  ctx.fillStyle=this.color2;
  ctx.beginPath();
  ctx.arc(this.x2, this.y2,this.radius,0,Math.PI*2,true);
  ctx.fill();
 };

 this.newPos=function()
 {
   this.theta+=this.turn;
};
 this.crashWith=function(object)
 {
   var crash=false;

   if(this.x1 < object.X + object.width + this.radius && this.x1 > object.X - this.radius  &&
      this.y1 < object.Y + object.height + this.radius && this.y1 > object.Y - this.radius)
     crash=true;

   else if(this.x2 < object.X + object.width + this.radius && this.x2 > object.X - this.radius  &&
             this.y2 < object.Y + object.height + this.radius && this.y2 > object.Y - this.radius)
     crash=true;

   return crash;
 };
}

//-------------------- Score -------------------------//
function Score(x,y)
{
  this.x=x;
  this.y=y;
  this.update=function()
  {
    ctx=GameArea.context;
    ctx.font = "20px Calibri";
    ctx.fillStyle = "white";
    ctx.fillText(this.text, this.x, this.y);
  };
}

//-------------------- Game Updater -------------------------//
function updateGameArea()
{
  //checking for Crashes
  for(var i=0;i<myObstacles.length;i++)
  {
    if(myGamePiece.crashWith(myObstacles[i]))
    {
      GameArea.stop();
      return;
    }
  }
  GameArea.clear();
  GameArea.frameNo += 1;

   myGamePiece.turn=0;

   if (GameArea.key && GameArea.key == 37) {turnleft(); }
   if (GameArea.key && GameArea.key == 39) {turnright(); }



   if (GameArea.frameNo == 1 || GameArea.frameNo%80==1) {
   v_speed+=0.2;
   var w=Math.floor(Math.random()*(GameArea.canvas.width-80));
       myObstacles.push(new Obstacle(myGamePiece.orbitRadius, 20, "#c10000", w,0));
   }

   for (i = 0; i < myObstacles.length; i += 1) {
       myObstacles[i].speedY =v_speed;
   myObstacles[i].newPos();
       myObstacles[i].update();
   }
  //score

  myScore.text="SCORE: " + Math.floor(GameArea.frameNo/40);
   myScore.update();


   myGamePiece.newPos();
   myGamePiece.update();

 myMenuButton.update();

 if(myGamePiece.Y==myGamePiece.orbitRadius)
 {
   GameArea.stop();
   myScore.win(0,0);

 }

}

function turnleft()
{
  myGamePiece.turn=-0.1;
}

 function turnright()
{
  myGamePiece.turn=+0.1;
}

function clearmove()
{
  myGamePiece.turn=0;
}
