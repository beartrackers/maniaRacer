console.log("init");
var game = new Phaser.Game(1600, 900, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.image('carSprite', 'img/car90.png');
    game.load.image('pointSprite', 'img/point.jpg');
    game.load.image('finishSprite', 'img/finish.png');

    //  Load our physics data exported from PhysicsEditor
    game.load.physics('physicsData', 'sprites.json');

}

var checkTimer = false;

var car,finishLine,text, timeScore,counter = 0, compte, isMove = false;
/***/
var blocks = [];
/***/
var cent=0 // initialise les dixtièmes
var sec=0 //initialise les secondes
var min=0 //initialise les minutes
/***/
var timeArray = [];
timeArray.push({min:99,sec:99,cent:999});
var time = {
    cent:0,
    sec:0,
    min:0
};



var cursors;
var start = false;

function create() {
    
    game.stage.backgroundColor = '#ACACAC';

    // Enable Box2D physics
    game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.box2d.setBoundsToWorld();
    cursors = game.input.keyboard.createCursorKeys();
    game.add.text(225, 650, 'MANIA RACER', { font: "70px Arial", fill: "#ffffff" });
    text = game.add.text(450, 450, 'Counter: 0', { font: "64px Arial", fill: "#ffffff"});
    text.anchor.setTo(0.5, 0.5);

    timeScore = game.add.text(450, 500, 'best time', { font: "25px Arial", fill: "#ffffff"});
    timeScore.anchor.setTo(0.5, 0.5);

    finishLine = game.add.sprite(150-576, 150, 'finishSprite');

    car = game.add.sprite(100, 160, 'carSprite');

    for (var i = 0; i < 6; i++) {
       blocks[i] = game.add.sprite(0, 0, 'pointSprite');
    }

    // Enable the physics bodies on all the sprites
    game.physics.box2d.enable([car]);
    for (var i = 0; i < blocks.length; i++) {
        game.physics.box2d.enable([blocks[i]]);
    }

    // Clear the shapes
    car.body.clearFixtures();
    for (var i = 0; i < blocks.length; i++) {
        blocks[i].body.clearFixtures();
        blocks[i].body.static = true;
    }
    
    // Load polygons from the physicsData JSON file in the cache
    car.body.loadPolygon('physicsData', 'car', car);
    //f.body.loadPolygon('physicsData', 'finish', f);
    for (var i = 0; i < blocks.length; i++) {
        blocks[i].body.loadPolygon('physicsData', 'block'+i, blocks[i]);
    }
}


function update() {
    detect(car.body);
    text.setText(min +":"+ sec +":"+ cent);
    for (var i = 0; i < timeArray.length; i++) {
        timeScore.setText("Best time : "+ timeArray[i].min +":"+ timeArray[i].sec +":"+ timeArray[i].cent);
    }

    if (cursors.left.isDown){
        car.body.rotateLeft(300);
    }else if (cursors.right.isDown){
        car.body.rotateRight(300);
    }else{
        car.body.setZeroRotation();
    }

    if (cursors.up.isDown){
        if(!isMove){
            isMove = true;
            chrono();
        }
        car.body.thrust(200);
    }else if (cursors.down.isDown){
        car.body.reverse(100);
    }
}

function detect(body) {
    if(body.x > 1450 && body.x < 1600 && body.y > 750 && body.y < 900){
        checkTimer = true;
    }

    if(body.y > 86 && body.y < 150 && body.x < 150 && checkTimer){
        timeArray.push({min:min,sec:sec,cent:cent});
        if(timeCompare(timeArray[1],timeArray[0])){
            timeArray.shift();
        }else{
            timeArray.pop();
        }
        resetTime();
    }
}


function chrono(){
    cent++; //incrémentation des dixièmes de 1
    if (cent>9){cent=0;sec++} //si les dixièmes > 9, 
    //on les réinitialise à 0 et on incrémente les secondes de 1
    if (sec>59){sec=0;min++} //si les secondes > 59, 
    //on les réinitialise à 0 et on incrémente les minutes de 1
    compte=setTimeout(chrono,100) //la fonction est relancée 
    //tous les 10° de secondes
}
function resetTime(){
    clearTimeout(compte); //arrête la fonction chrono()
    cent = 0;
    sec = 0;
    min = 0;
    checkTimer = false;
    chrono();
}
function timeCompare(time1,time2) {
    if(time1.min<=time2.min){
        if(time1.sec<=time2.sec){
            if(time1.cent<time2.sec){
                return true;
            }
        }
    }return false;

}
function render() {
    //game.debug.spriteInfo(car, 32, 32);
    for (var i = 0; i < 6; i++) {
       game.debug.body(blocks[i], 'rgb(36,137,25)');
    }
    //game.debug.box2dWorld();
}