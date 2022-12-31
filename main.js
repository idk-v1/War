var can = document.getElementById("can");
var ctx = can.getContext("2d");

var tileNum;
var tileSize;

can.width = Math.min(window.innerWidth * 0.95, window.innerHeight * 0.95);
can.height = can.width;

var ticks = 0;
var turns = 0;
var select = -1;
var activeMap = -1;

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

ctx.font = can.width / ctx.measureText("PLAY").width * 3 + "px 'Sans-serif'";
setInterval(render, 1000 / 30);

function start(map)
{
    activeMap = map;
    tileNum = maps[activeMap][0];
    tileSize = Math.floor(Math.min(window.innerWidth * 0.95, window.innerHeight * 0.95) / tileNum);
    can.width = tileNum * tileSize;
    can.height = can.width;
}

function input(posx, posy)
{
    if (activeMap != -1)
    {
        move(posx, posy);
    }
    else
    {
        x = (posx - can.getBoundingClientRect().x);
        y = (posy - can.getBoundingClientRect().y);
        if (x > can.width * 0.25 && y > can.height / 2 - can.height / 16 &&
            x < can.width * 0.75 && y < can.height / 2 + can.height / 16)
        {
            start(Math.floor(Math.random() * maps.length));
        }
    }
}

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
        if (maps[activeMap][y + 1][x])
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
    if (activeMap != -1)
    {
        for (var y = 0; y < tileNum; y++)
            for (var x = 0; x < tileNum; x++)
            {
                if (maps[activeMap][y + 1][x])
                {
                    ctx.fillStyle = "#2224";
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
                ctx.fillStyle = "#" + ((x + y * tileNum) % 2 ? "8884" : "90909044");
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
    else
    {
        renderMenu(ticks);
    }
    ticks++;
}

function renderMenu(ticks)
{
    var pxSize = 5;
    var dist = ticks % can.width * 4 - can.width / 2;
    for (var y = 0; y < can.height; y += pxSize)
        for (var x = 0; x < can.width; x += pxSize)
        {
            if (x / 3 + y >= dist && (x - 200) / 3 + (y - 200) <= dist)
            {
                ctx.fillStyle = "rgb(" + Math.floor(255 * ((x + (x + y / 2) % 50) / can.width)) + ", 0," + Math.floor(255 - 255 * ((y + (x + y / 2) % 50) / can.height)) + ")";
                if (255 * (x / can.width) == 255 * ((x + (x + y / 2) % 50) / can.width) && (x - 200) / 3 + (y - 200) - 8 <= dist && (x - 200) / 3 + (y - 200) + 8 >= dist)
                {
                    ctx.fillRect(x, y, pxSize, pxSize);  
                    ctx.fillStyle = "#0004";
                    ctx.fillRect(x, y, pxSize, pxSize);
                }
                else
                {
                    ctx.fillRect(x, y, pxSize, pxSize);
                }
            }
            else
            {
                ctx.fillStyle = "rgb(" + (255 * (x / can.width)) + ", 0," + (255 - 255 * (y / can.height)) + ")";
                ctx.fillRect(x, y, pxSize, pxSize);
            }
        }
    ctx.fillStyle = "#fff2";
    ctx.fillRect(can.width / 2 - can.width / 4, can.height / 2 - can.height / 16, can.width / 2, can.height / 8);
    ctx.fillStyle = "#fff4";
    ctx.fillText(" PLAY ", can.width * 0.33 - can.width / ctx.measureText("|PLAY|").width, can.height * 0.54);
    ctx.strokeStyle = "#fff4";
    ctx.strokeRect(can.width / 2 - can.width / 4, can.height / 2 - can.height / 16, can.width / 2, can.height / 8);
}

function turn()
{

}