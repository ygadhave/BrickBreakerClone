let playerScore=0;
let paddle;
let ball;
let colors;
let gameState;
let bricks = [];
let timer = 300;
var i = 0;

let backgroundIMG;
let backgroundIMGURL = "https://thumbs.dreamstime.com/b/forest-game-background-d-application-vector-design-tileable-horizontally-size-ready-parallax-effect-73706218.jpg";

function preload() {
   backgroundIMG = loadImage(backgroundIMGURL);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  breakAudio = createAudio("pop.wav");
  winAudio = createAudio("victory.wav");
  lostAudio = createAudio("defeat.wav");
  
  colors = createColors();
  gameState = "game";
  paddle = new Paddle();
  ball = new Ball();
  bricks = createBricks(colors);
  
}

function draw() {
  backgroundIMG.resize(windowWidth, windowHeight);
  if(gameState === "game") {
  
  image(backgroundIMG, 0, 0);
  textSize(150);
  textFont("Trattatello");
  text('🦖',width-400,height-120);
  
  textSize(200);
  textFont("Trattatello");
  text('🦕',width-800,height-120);
  
  textSize(100);
  textFont("Trattatello");
  text('🦕',width-900,height-120);
  
  textSize(150);
  textFont("Trattatello");
  text('🦕',width-850,height-120);
  
  textSize(300);
  textFont("Trattatello");
  text('🦖',width-350,height-120);

  ball.bounceEdge();
  ball.bouncePaddle();
  
  if(ball.offScreen()) {
  gameState = "Lost!!🦖";
  lostAudio.play();
  drawBackButton();
  drawReplayButton();
}
  
  ball.update();
 
  if (keyIsDown(LEFT_ARROW)) {
  paddle.move("left");}
  else if (keyIsDown(RIGHT_ARROW)) {
  paddle.move("right");}
  
  paddle.display();
  ball.display(paddle.location);
  
  for(let i = bricks.length-1; i >= 0;i--){
    const brick = bricks[i];
    brick.display();
  if(brick.isColliding(ball)){
    ball.reverse("y");
    breakAudio.play();
    bricks.splice(i, 1);
    playerScore += brick.points;
    }
  }
  textSize(50);
  textFont("Trattatello");
  fill(255);
  text('Score: '+playerScore, width-200,height-120);
  
  doTimer();
    if(bricks.length == 0){
      gameState = "Won!!🦖";
      winAudio.play();
      drawBackButton();
      drawReplayButton();
      }
    if(timer==-1){
    gameState = "Lost!!🦖";
    lostAudio.play();
    drawBackButton();
    drawReplayButton();
    }
}
   else{
      textSize(100);
      textFont("Algerian")
      i = i + 1

      if (i % 10 === 0){
  	  fill("yellow");
      text('🦖!!You '+gameState, width/2-350,height/2);
    } 
   else if(i%20===0) {
      fill("blue");
      text('🦖!!You '+gameState, width/2-350,height/2);
    }
   else{
      fill("red");
      text('🦖!!You '+gameState, width/2-350,height/2);
    }
  }
}

function createColors() {
  const colors = [];
  colors.push(color("yellow"));
  colors.push(color("red"));
  colors.push(color("green"));
  colors.push(color("blue"));
  for(let i = 0; i<10; i++){   colors.push(color(random(0,255),random(0,255),random(0,255)))
  }
  return colors;
}

function createBricks(colors){
  const bricks = [];
  const rows = 7;
  const bricksPerRow = 10;
  const brickWidth = width/bricksPerRow;
  for(let row = 0; row < rows; row++){
  for(let i = 0;i < bricksPerRow; i++){
  brick = new Brick(createVector(brickWidth*i,25*row), brickWidth, 25, colors[floor(random(0, colors.length))]);
  bricks.push(brick);
   }
  }
  return bricks; 
}

class Paddle {
    constructor() {
    this.width = 150;
    this.height = 25;
    this.color = color("green");
    this.location = createVector(width/2 - this.width/2, height-35);
    const speed = 10;
    this.speed = {
    right: createVector(speed,0),
    left:  createVector(speed*-1,0)};
  }
    
  display(){
  fill(this.color);
  rect(this.location.x, this.location.y, this.width, this.height);
  }
  
  move(direction){
    this.location.add(this.speed[direction]);
    
    if(this.location.x <0){
      this.location.x = 0;
    }else if(this.location.x+this.width > width){
      this.location.x = width-this.width
    }
  }
}

class Ball {
    constructor(paddlelocation) {
    this.radius = 15;
    this.size = this.radius*2;
    this.location = createVector(paddle.location.x + (paddle.width/2), paddle.location.y - this.radius-5);
    this.color = color(255);
    this.velocity = createVector(7,-7);
  }
  
bouncePaddle(){
  if(this.location.x + this.radius >= paddle.location.x && this.location.x - this.radius <= paddle.location.x + paddle.width){
      if(this.location.y + this.radius > paddle.location.y){
        this.reverse("y");
        this.location.y = paddle.location.y - this.radius -1;
      }
    }
  }
  bounceEdge(){
    if(this.location.x + this.radius >= width) {
      this.reverse("x");
    } else if(this.location.x - this.radius <= 0){
      this.reverse("x");
    }else if(this.location.y - this.radius <= 0){
      this.reverse("y");
    }
  }
  
  display() {
    fill(this.color);
    ellipse(this.location.x,this.location.y,this.size,this.size);
  }
  
  update() {
    this.location.add(this.velocity);
  }
  
  reverse(coord) {
    this.velocity[coord] *= -1;
  }
  
  offScreen() {
    return this.location.y - this.radius > height;
  }
}

class Brick {
  constructor(location, width, height, color) {
    this.location = location;
    this.width = width;
    this.height = height;
    this.color = color;
    this.points = 5;
  }
  
  display() {
    fill(this.color);
    rect(this.location.x, this.location.y, this.width, this.height);
  }
  
  isColliding(ball) {
    if(ball.location.y - ball.radius <= this.location.y + this.height &&
       ball.location.y + ball.radius >= this.location.y &&
       ball.location.x + ball.radius >= this.location.x &&
       ball.location.x - ball.radius <= this.location.x + this.width){
       return true;
    }
  }
}

function doTimer() {
  text("Time: "+timer,width-200,height-50);
  if (frameCount % 60 === 0 && timer >= 0) {
  timer --;
  }
}

function drawReplayButton() {
  replayButton = createImg("replay.png",'the p5 magenta asterisk');
  replayButton.position( (width/2)-100,(height/2)+25);
  replayButton.size(200, 80);
  replayButton.mousePressed(replayFunction);
}

function replayFunction() {
  window.open("https://editor.p5js.org/ygadhave/full/1qujD2woA")
}

function drawBackButton() {
  backButton = createImg("backarrow.png",'the p5 magenta asterisk');
  backButton.position((width+20)-width,height-80);
  backButton.size(200, 80);
  backButton.mousePressed(backFunction);
}

function backFunction() {
  window.open("https://editor.p5js.org/jjliu3/full/_2Z1_ic9A")
}





 



