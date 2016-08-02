//variables
//////////////////////////////////
var canvas, context;
var bodySnake = [];
var direction;
var imgFood;
var food;
var imgSnake;
var lengthSnake = 3;
var pause;
var score;
//////////////////////////////////
function Section(x, y, turn, dir)
{
    this.x = x;
    this.y = y;
	this.turn = turn;
	this.dir = dir;
}

function MoveSnake()
{
	var nextPos = [];
	var nextSection;
	var prev = bodySnake[0];
	var mark = 100;

	switch(direction)
	{
		case 0://move right
			nextSection = new Section(prev.x+16, prev.y, prev.turn, direction);
			if(nextSection.x+16>640)
			{
				GameOver();
				return;
			}
			break;
		case 2://move left
			nextSection = new Section(prev.x-16, prev.y, prev.turn, direction);
			if(nextSection.x<0)
			{
				GameOver();
				return;
			}
			break;
		case 3://move up
			nextSection = new Section(prev.x, prev.y-16, prev.turn, direction);
			if(nextSection.y<0)
			{
				GameOver();
				return;
			}
			break;
		case 1://move down
			nextSection = new Section(prev.x, prev.y+16, prev.turn, direction);
			if(nextSection.y+16>480)
			{
				GameOver();
				return;
			}
			break;
	}
	nextPos.push(nextSection);
	
	for(var i=1; i<bodySnake.length; i++)
	{
		if(prev.dir == direction && mark>i)
		{
			if(direction == 0 | direction == 2) { prev.turn = 64; }
			if(direction == 1 | direction == 3) { prev.turn = 80; }
		}
		if(bodySnake[i].turn < 50) { mark = i; }
		
		nextPos.push(prev);
		prev = bodySnake[i];
	}
	
	if(nextSection.x == food.x && nextSection.y == food.y)
	{
		score+=40;
		nextPos.push(nextPos[nextPos.length-1]);
		NewFood();
		Info();
	}
	
	if(ControlCrashSnake(nextSection))
	{
		GameOver();
		return;
	}
	bodySnake = nextPos;
}

function NewFood()
{
	food = new Section();
	do {
		food.x = (Math.floor((Math.random()*38)+1))*16;
		food.y = (Math.floor((Math.random()*28)+1))*16;
	} 
	while(ControlCrashSnake(food));
}

function ControlCrashSnake(point)
{
	for(var i=0;i<bodySnake.length;i++)
	{
		if(bodySnake[i].x == point.x && bodySnake[i].y == point.y)
			return true;
	}
	return false;
}

function Info(id)
{
	document.getElementById('score').innerHTML = 'Очки: '+score;
	document.getElementById('length').innerHTML = 'Довжина: '+(bodySnake.length+1);
}

function GameOver()
{Info();
	bodySnake.length = 0;
	for(var i=lengthSnake; i > 0 ;i--)
	{
		bodySnake.push(new Section(lengthSnake+13, 64, 64, direction));
	}
	direction = 0;
	score = 0;
	Food();
	//Info();
}

//functions drawind
/////////////////////////////////////////////
function clear() 
{
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function drawScene() 
{ 
    clear();

    context.beginPath();
	//context.fillStyle = 'yellow';
	context.drawImage(imgFood, food.x-3,food.y-3);
	
	for(var i=1; i<bodySnake.length-1;i++)
	{
	
		context.drawImage(imgSnake,  bodySnake[i].turn, 80, 16, 16, bodySnake[i].x, bodySnake[i].y, 16, 16);
		context.drawImage(imgSnake, bodySnake[bodySnake.length-2].dir*16, 64, 16, 16, bodySnake[bodySnake.length-1].x, bodySnake[bodySnake.length-1].y, 16, 16);
	
		//context.rect(bodySnake[i].x, bodySnake[i].y, 10,10);
		if(direction == 0)
			context.drawImage(imgSnake, direction*64, 0, 64, 64, bodySnake[0].x, bodySnake[0].y-24, 64, 64);
		if(direction == 1)
			context.drawImage(imgSnake, direction*64, 0, 64, 64, bodySnake[0].x-24, bodySnake[0].y, 64, 64);
		if(direction == 3)
			context.drawImage(imgSnake, direction*64, 0, 64, 64, bodySnake[0].x-24, bodySnake[0].y-48, 64, 64);
		if(direction == 2)
			context.drawImage(imgSnake, direction*64, 0, 64, 64, bodySnake[0].x-48, bodySnake[0].y-24, 64, 64);

	}
	//context.fillText("Game Over!!!", 170,220);
	
	context.closePath();
    //context.fill();
    //context.lineWidth = 1;
    context.strokeStyle = 'gray';
    context.stroke();
	
	if(!pause)
		MoveSnake();
}

//Initilizing
//////////////////////////////////////////////////
$(function()
{
	canvas = document.getElementById('scene');
    context = canvas.getContext('2d');
	
	context.font = '40pt arial';
	pause = false;
	imgSnake = new Image();
	imgSnake.src = "image/txsnake.png";
	imgFood = new Image();
	imgFood.src = "image/burger.png";
	
	NewFood();
	score = 0;
	direction = 0;
	
	for(var i=lengthSnake; i > 0 ;i--)
	{
		bodySnake.push(new Section(lengthSnake+13, 64, 64, direction));
	}
	
	$(window).keydown(function(event)
	{
		switch(event.keyCode)
		{
			case 38://Up key
				if(direction == 1)
					break;
				if(direction == 2) { bodySnake[0].turn = 32; }
				if(direction == 0) { bodySnake[0].turn = 16; }
				direction = 3;
				break;
			case 40://Down key
				if(direction == 3)
					break;
				if(direction == 0) { bodySnake[0].turn = 0; }
				if(direction == 2) { bodySnake[0].turn = 48; }
				direction = 1;
				break;
			case 37://Left key
				if(direction == 0)
					break;
				if(direction == 3) { bodySnake[0].turn = 0; }
				if(direction == 1) { bodySnake[0].turn = 16; }
				direction = 2;
				break;
			case 39://Right key
				if(direction == 2)
					break;
				if(direction == 3) { bodySnake[0].turn = 48; }
				if(direction == 1) { bodySnake[0].turn = 32; }
				direction = 0;
				break;
			case 32:
				if(pause)
					pause = false;
				else
					pause = true;
				break;
		}		
	});
	setInterval(drawScene, 80);
});

