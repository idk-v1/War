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

        switch (type)
        {
        case 0:
            this.moveDist = 4;
            this.health = 2;
            break;
        case 1:
            this.moveDist = 3;
            this.health = 2;
            break;
        case 2:
            this.moveDist = 3;
            this.health = 3;
            break;
        }
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
    turns = 0;
    select = -1;
    document.querySelector("body").style.backgroundColor = "#f88";
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
            if (characters[i].x == x && characters[i].y == y && characters[i].team == turns % 2)
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
            document.querySelector("body").style.backgroundColor = "#" + (turns % 2 ? "88f" : "f88");
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
            for (var i = 0; i < characters.length; i++)
                if (characters[i].team != characters[select].team)
                {
                    raytrace(characters[i].x + 0.5, characters[i].y + 0.5, characters[select].x + 0.5, characters[select].y + 0.5);
                }
        }
        for (var i = 0; i < characters.length; i++)
        {
            if (characters[i].team == turns % 2)
            {
                ctx.fillStyle = "#fff4";
                ctx.fillRect(characters[i].x * tileSize, characters[i].y * tileSize, tileSize, tileSize);
            }
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

function raytrace(x0, y0, x1, y1)
{
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var x = Math.floor(x0);
    var y = Math.floor(y0);
    var n = 1;
    var xInc;
    var yInc;
    var error;
    var ok = true;

    if (dx == 0)
    {
        xInc = 0;
        error = Infinity;
    }
    else if (x1 > x0)
    {
        xInc = 1;
        n += Math.floor(x1) - x;
        error = (Math.floor(x0) + 1 - x0) * dy;
    }
    else
    {
        xInc = -1;
        n += x - Math.floor(x1);
        error = (x0 - Math.floor(x0)) * dy;
    }

    if (dy == 0)
    {
        yInc = 0;
        error -= Infinity;
    }
    else if (y1 > y0)
    {
        yInc = 1;
        n += Math.floor(y1) - y;
        error -= (Math.floor(y0) + 1 - y0) * dx;
    }
    else
    {
        yInc = -1;
        n += y - Math.floor(y1);
        error -= (y0 - Math.floor(y0)) * dx;
    }

    for (; n > 0; n--)
    {
        if (maps[activeMap][y][x])
            ok = false;

        if (error > 0)
        {
            y += yInc;
            error -= dx;
        }
        else
        {
            x += xInc;
            error += dy;
        }
    }

    if (ok)
    {
        ctx.strokeStyle = "#ff8";
        ctx.lineWidth = tileSize / 10;
        ctx.beginPath();
        ctx.moveTo(x0 * tileSize, y0 * tileSize);
        ctx.lineTo(x1 * tileSize, y1 * tileSize);
        ctx.stroke();
    }
}