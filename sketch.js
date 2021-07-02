const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
//need an array to store mutliple boats created
var boats = [];

//class Boat created in Boat.js 

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
}

function setup() {
  canvas = createCanvas(windowWidth - 200, windowHeight);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(width / 2 - 550, height - 290, 250, 580);
  cannon = new Cannon(width / 2 - 500, height / 2 - 220, 120, 40, angle);

  //making single boat for trial
  //boat = new Boat(width, height - 100, 200, 200, -100);
  
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
  ground.display();

  /* 
  Matter.Body.setVelocity( boat.body , 
      {
        x: -0.9,
        y: 0
      }
     );
     
  boat.display();
  */
  
  //displaying and pushing new boats to boats array
  showBoats();

  //checking collision between each ball and boat pair
  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    
    //checking entire boats array for ball i
    for (var j = 0; j < boats.length; j++) {
      
        if (balls[i] !== undefined && boats[j] !== undefined) {
          var collision = Matter.SAT.collides(balls[i].body, boats[j].body);
          if (collision.collided) {
            boats[j].remove(j);

            Matter.World.remove(world, balls[i].body);
            balls.splice(i, 1);
            i--;    
          }
        } 
    }
  }

  cannon.display();
  tower.display();
}


//creating the cannon ball on key press
function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

// function to show the ball.
function showCannonBalls(ball, index) {
  ball.display();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    Matter.World.remove(world, ball.body);
    balls.splice(index, 1);
  }
}


//function to show the boats and create a new boat if there are less than 4 boats on the screen
function showBoats() {
  if (boats.length > 0) {
    //create a new boat if there are less than 4 boats on the screen and the last boat has crossed a little distance
    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-130, -100, -120, -80];
      var position = random(positions);
      var boat = new Boat(width,height - 100, 200, 200, position);
      boats.push(boat);
    }
    
    
    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
    }
  } 
  //create first boat when boats array is empty
  else 
  {
    //create first boat when boats array is empty
    var boat = new Boat(width, height - 100, 200, 200, -100);
    boats.push(boat);
  }
}


//releasing the cannonball on key release
function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }
}


