var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var bedRoom, garden, washRoom, gamestate, readState;

function preload(){
sadDog=loadImage("images/dogImg.png");
happyDog=loadImage("images/dogImg1.png");
bedRoom = loadImage('images/Bed Room.png');
washRoom = loadImage('images/Wash Room.png');
garden = loadImage('images/Garden.png');

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  readState = database.ref('gameState');
  readState.on('value', function(data){
    gameState = data.val();
  })
  
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
}

function draw() {
  currentTime = hour();
  
  if(currentTime==(lastFed+1)){
    update('playing')
    foodObj.Garden();
  }
  else if(currentTime==(lastFed+2)){
    update('sleeping')
    foodObj.BedRoom();
  }
  else if(currentTime>(lastFed+2) && currentTime <= (lastFed + 4)){
    update('bathing');
    foodObj.WashRoom();
  }
  else{
    update('Hungry');
    foodObj.display();
  }

  if(gameState != 'Hungry'){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

 

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  })
}



