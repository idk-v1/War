var can = document.getElementById("can");
var ctx = can.getContext("2d");

var tileNum = 15;
var tileSize = Math.floor(Math.min(window.innerWidth * 0.95, window.innerHeight * 0.95) / tileNum);

can.width = tileNum * tileSize;
can.height = tileNum * tileSize;

var ticks = 0;
var turns = 0;
var select = -1;

class Character
{
    constructor(posx, posy, team, type)
    {
        this.x = posx;
        this.y = posy;
        this.team = team;
        this.type = type;
        this.dead = false;
    }
}

var characters = 
[
    new Character( 0,  0, 0, 0),
    new Character( 1,  0, 0, 1),
    new Character( 2,  0, 0, 2),
    new Character( 0, 14, 1, 0),
    new Character( 1, 14, 1, 1),
    new Character( 2, 14, 1, 2),
];

var tiles = new Array(tileNum).fill(new Array(tileNum));
for (var x = 0; x < tileNum; x++)
    for (var y = 0; y < tileNum; y++)
        tiles[x][y] = false;

setInterval(render, 1000 / 60);

function move(posx, posy)
{
    x = Math.floor((posx - can.getBoundingClientRect().x) / tileSize);
    y = Math.floor((posy - can.getBoundingClientRect().y) / tileSize);
    if (select == -1)
    {
        for (var i = 0; i < characters.length; i++)
            if (characters[i].x == x && characters[i].y == y)
                select = i;
    }
    else
    {
        var ok = true;
        for (var i = 0; i < characters.length; i++)
            if (characters[i].x == x && characters[i].y == y)
                ok = false;
        if (characters[select].x == x && characters[select].y == y)
            select = -1;
        if (ok)
        {
            characters[select].x = x;
            characters[select].y = y;
            select = -1;
            turns++;
        }
    }
}

function render()
{
    for (var y = 0; y < tileNum; y++)
        for (var x = 0; x < tileNum; x++)
        {
            ctx.fillStyle = "#" + ((x + y * tileNum) % 2 ? "888" : "999");
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    if (select != -1)
    {
        ctx.fillStyle = "#ff8";
        ctx.fillRect(characters[select].x * tileSize, characters[select].y * tileSize, tileSize, tileSize);
    }
    for (var i = 0; i < characters.length; i++)
    {
        ctx.fillStyle = "#" + (characters[i].team ? "00f" : "f00");
        ctx.fillRect(characters[i].x * tileSize + tileSize * 0.1, characters[i].y * tileSize + tileSize *  0.1, tileSize * 0.8, tileSize * 0.8);
    }
}

function turn()
{

}