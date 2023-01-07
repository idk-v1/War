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

var moves;
var enemys;

class Character
{
    constructor(posx, posy, team, type)
    {
        this.x = posx;
        this.y = posy;
        this.team = team;
        this.type = type;
        this.moveDist = 0;
        this.health = 0;

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
    clearArr();
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
            if (characters[i].x == x && characters[i].y == y && characters[i].team == turns % 2 && characters[i].health > 1)
            {
                select = i;
                clearArr();
                getMoves(characters[select].x, characters[select].y, characters[select].moveDist);
                enemys = [];
                for (var i = 0; i < characters.length; i++)
                    if (characters[i].team != characters[select].team)
                        if (raytrace(characters[select].x + 0.5, characters[select].y + 0.5, characters[i].x + 0.5, characters[i].y + 0.5))
                            enemys.push(i);
                for (var c = 0; c < characters.length; c++)
                    moves[characters[c].y][characters[c].x] = 0;
            }
    }
    else
    {
        var ok = true;
        var shoot = -1;

        // CHARACTERS (NO)
        for (var i = 0; i < characters.length; i++)
            if (characters[i].x == x && characters[i].y == y)
                ok = false;
        
        // SHOOT
        for (var i = 0; i < enemys.length; i++)
            if (x == characters[enemys[i]].x && y == characters[enemys[i]].y && characters[enemys[i]].health > 1)
                shoot = i;

        // WALL (NO)
        if (maps[activeMap][y + 1][x])
            ok = false;

        // SELF (CANCEL)
        if (characters[select].x == x && characters[select].y == y)
        {
            clearArr();
            select = -1;
        }

        // MOVE SELECTED
        if (ok && moves[y][x])
        {
            clearArr();
            characters[select].x = x;
            characters[select].y = y;
            select = -1;
            turns++;
            document.querySelector("body").style.backgroundColor = "#" + (turns % 2 ? "88f" : "f88");
        }

        // SHOOT ENEMY
        if (shoot != -1)
        {
            characters[enemys[shoot]].health--;
            clearArr();
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
        // DRAW TILES
        for (var y = 0; y < tileNum; y++)
            for (var x = 0; x < tileNum; x++)
            {
                // DRAW WALLS
                if (maps[activeMap][y + 1][x])
                {
                    ctx.fillStyle = "#2224";
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }

                // DRAW CHECKERBOARD PATTERN
                ctx.fillStyle = "#" + ((x + y * tileNum) % 2 ? "8884" : "90909044");
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }

        // IF SELECTION
        if (select != -1)
        {
            // DRAW SELECT OUTLINE
            ctx.fillStyle = "#ff8";
            ctx.fillRect(characters[select].x * tileSize, characters[select].y * tileSize, tileSize, tileSize);

            // DRAW RAYS
            for (var i = 0; i < enemys.length; i++)
            {
                if (characters[enemys[i]].health > 1)
                ctx.strokeStyle = "#ff8";
                ctx.lineWidth = tileSize / 10;
                ctx.beginPath();
                ctx.moveTo((characters[select].x + 0.5) * tileSize, (characters[select].y + 0.5) * tileSize);
                ctx.lineTo((characters[enemys[i]].x + 0.5) * tileSize, (characters[enemys[i]].y + 0.5) * tileSize);
                ctx.stroke();

                ctx.fillStyle = "#ff82";
                ctx.fillRect(characters[enemys[i]].x * tileSize, characters[enemys[i]].y * tileSize, tileSize, tileSize);
            }

            // DRAW POSSIBLE MOVES
            for (var y = 0; y < tileNum; y++)
                for (var x = 0; x < tileNum; x++)
                    if (moves[y][x])
                    {
                        ctx.fillStyle = "#ff82";
                        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                    }
        }

        for (var i = 0; i < characters.length; i++)
        {
            // DRAW TEAM OUTLINE
            if (characters[i].team == turns % 2 && characters[i].health > 0)
            {
                ctx.fillStyle = "#fff4";
                ctx.fillRect(characters[i].x * tileSize, characters[i].y * tileSize, tileSize, tileSize);
            }

            // DRAW CHARACTERS
            if (characters[i].health > 0)
            {
                ctx.fillStyle = "#" + (characters[i].team ? "00f" : "f00");
                ctx.fillRect(characters[i].x * tileSize + tileSize * 0.1, characters[i].y * tileSize + tileSize *  0.1, tileSize * 0.8, tileSize * 0.8);
            }
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
    var x_inc, y_inc;
    var error;

    var ok = true;

    if (dx == 0)
    {
        x_inc = 0;
        error = Infinity;
    }
    else if (x1 > x0)
    {
        x_inc = 1;
        n += Math.floor(x1) - x;
        error = (Math.floor(x0) + 1 - x0) * dy;
    }
    else
    {
        x_inc = -1;
        n += x - Math.floor(x1);
        error = (x0 - Math.floor(x0)) * dy;
    }

    if (dy == 0)
    {
        y_inc = 0;
        error -= Infinity;
    }
    else if (y1 > y0)
    {
        y_inc = 1;
        n += Math.floor(y1) - y;
        error -= (Math.floor(y0) + 1 - y0) * dx;
    }
    else
    {
        y_inc = -1;
        n += y - Math.floor(y1);
        error -= (y0 - Math.floor(y0)) * dx;
    }

    for (; n > 0; --n)
    {
        if (maps[activeMap][y + 1][x])
            ok = false;

        if (error > 0)
        {
            y += y_inc;
            error -= dx;
        }
        else
        {
            x += x_inc;
            error += dy;
        }
    }

    return ok;
}

function getMoves(x, y, dist)
{
    if (dist >= 0)
    {
        moves[y][x] = 1;

        if (x > -1 && x < tileNum && y - 1 > -1 && y - 1 < tileNum)
            if (!maps[activeMap][y - 1 + 1][x + 0])
                getMoves(x + 0, y - 1, dist - 1);

        if (x + 1 > -1 && x + 1 < tileNum && y > -1 && y < tileNum)
            if (!maps[activeMap][y + 0 + 1][x + 1])
                getMoves(x + 1, y + 0, dist - 1);

        if (x > -1 && x < tileNum && y + 1 > -1 && y + 1 < tileNum)
            if (!maps[activeMap][y + 1 + 1][x + 0])
                getMoves(x + 0, y + 1, dist - 1);

        if (x - 1 > -1 && x - 1 < tileNum && y > -1 && y < tileNum)
            if (!maps[activeMap][y + 0 + 1][x - 1])
                getMoves(x - 1, y + 0, dist - 1);
    }
}

function clearArr()
{
    var temp = [];
    for (var i =  0; i < tileNum; i++)
        temp.push(0);

    moves = [];
    
    for (var i = 0; i < tileNum; i++)
        moves.push(temp.slice());
}