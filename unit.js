class Character
{
    acc; macc; hp; mov; ht; dmg; type; x; y; team;

    constructor(x, y, team)
    {
        this.x = x;
        this.y = y;
        this.team = team;
    }

    startEffect(chars)
    {

    }

    deathEffect(chars)
    {

    }

    usePower(chars, map, x, y, tileNum, moves)
    {

    }

    getMoves(x, y, dist, chars, map, moves, tileNum)
    {
        this.diamond(x, y, dist, map, tileNum, moves);
        for (var i = 0; i < chars.length; i++)
            if (chars[i].hp > 0)
                moves[chars[i].y][chars[i].x] = 0;
    }

    diamond(x, y, dist, map, tileNum, moves)
    {
        if (dist >= 0)
        {
            moves[y][x] = 1;

            if (x >= 0 && x < tileNum && y - 1 >= 0 && y - 1 < tileNum)
                if (!map[y - 1][x] % 2)
                    this.diamond(x, y - 1, dist - 1, map, tileNum, moves);

            if (x + 1 >= 0 && x + 1 < tileNum && y >= 0 && y < tileNum)
                if (!map[y][x + 1] % 2)
                    this.diamond(x + 1, y, dist - 1, map, tileNum, moves);

            if (x >= 0 && x < tileNum && y + 1 >= 0 && y + 1 < tileNum)
                if (!map[y + 1][x] % 2)
                    this.diamond(x, y + 1, dist - 1, map, tileNum, moves);

            if (x - 1 >= 0 && x - 1 < tileNum && y >= 0 && y < tileNum)
                if (!map[y][x - 1] % 2)
                    this.diamond(x - 1, y, dist - 1, map, tileNum, moves);
        }
    }

    raytrace(x0, y0, x1, y1, map)
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
            if (map[y][x] % 2)
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

    attack(enemy, chars)
    {
        if (this.acc - Math.sqrt(Math.pow(chars[enemy].x - this.x, 2) + Math.pow(chars[enemy].y - this.y, 2)) * 0.005 >= Math.random())
            chars[enemy].hp -= 1;
    }
}

class Grunt extends Character
{
    acc = 0.5;
    macc = 0.5;
    hp = 2;
    mov = 3;
    ht = 0.5;
    type = 0;
    hps = 2;
}

class Leader extends Character
{
    acc = 0.5;
    macc = 0.5;
    hp = 3;
    mov = 3;
    ht = 0.5;
    type = 1;
    hps = 3;

    startEffect(chars)
    {
        for (var i = 0; i < chars.length; i++)
            if (chars[i].team == this.team && chars[i].type == 0)
            {
                chars[i].mov = 4;
                chars[i].acc = 0.66;
                chars[i].macc = 0.66;
                chars[i].hp = 3;
                chars[i].hps = 3;
            }
    }

    deathEffect(chars)
    {
        for (var i = 0; i < chars.length; i++)
            if (chars[i].team == this.team && chars[i].type == 0)
            {
                chars[i].mov -= 1;
                chars[i].acc -= 0.33;
                chars[i].macc -= 0.33;
                chars[i].hp -= 1;
                chars[i].hps -= 1;
            }
    }
}

class Bomber extends Character
{
    acc = 1;
    macc = 0.5;
    hp = 2;
    mov = 6;
    ht = 0;
    type = 2;
    hps = 2;

    usePower(chars, map, x, y, tileNum, moves)
    {
        this.diamond(x, y, 5, map, tileNum, moves);
        for (var yy = 0; yy < tileNum; yy++)
            for (var xx = 0; xx < tileNum; xx++)
                for (var i = 0; i < chars.length; i++)
                    if (chars[i].x == xx && chars[i].y == yy)
                        if (moves[yy][xx])
                            chars[i].hp = 1;
        this.diamond(x, y, 5, map, tileNum, moves);
            for (var yy = 0; yy < tileNum; yy++)
                for (var xx = 0; xx < tileNum; xx++)
                    for (var i = 0; i < chars.length; i++)
                        if (chars[i].x == xx && chars[i].y == yy)
                            if (moves[yy][xx])
                                chars[i].hp = 0;
    }

    attack(enemy, chars)
    {

    }
}

class Scout extends Character
{
    acc = 0.66;
    macc = 0.5;
    hp = 2;
    mov = 3;
    ht = 0.5;
    type = 3;
    hps = 2;

    diamond(x, y, dist, map, tileNum, moves)
    {
        if (dist >= 0)
        {
            if (!map[y][x])
                moves[y][x] = 1;

            if (x >= 0 && x < tileNum && y - 1 >= 0 && y - 1 < tileNum)
                this.diamond(x, y - 1, dist - 1, map, tileNum, moves);

            if (x + 1 >= 0 && x + 1 < tileNum && y >= 0 && y < tileNum)
                this.diamond(x + 1, y, dist - 1, map, tileNum, moves);

            if (x >= 0 && x < tileNum && y + 1 >= 0 && y + 1 < tileNum)
                this.diamond(x, y + 1, dist - 1, map, tileNum, moves);

            if (x - 1 >= 0 && x - 1 < tileNum && y >= 0 && y < tileNum)
                this.diamond(x - 1, y, dist - 1, map, tileNum, moves);
        }
    }
}

class Brute extends Character
{
    acc = 0.5;
    macc = 0.66;
    hp = 3;
    mov = 2;
    ht = 0.5;
    type = 4;
    hps = 3;

    attack(enemy, chars)
    {
        if (this.acc >= Math.random())
            chars[enemy].hp = 1;
    }
}

class Assassin extends Character
{
    acc = 0;
    macc = 2;
    hp = 2;
    mov = 5;
    ht = 0.5;
    type = 5;
    hps = 2;

    attack(enemy, chars)
    {

    }
}

class Heavy extends Character
{
    acc = 0.75;
    macc = 0.5;
    hp = 3;
    mov = 3;
    ht = 0.5;
    type = 6;
    hps = 3;

    attack(enemy, chars)
    {

    }
}

class Medic extends Character
{
    acc = 1;
    macc = 0.5;
    hp = 3;
    mov = 4;
    ht = 1;
    type = 7;
    hps = 3;

    attack(enemy, chars)
    {

    }
}

class Sniper extends Character
{
    acc = 0.85;
    macc = 0.5;
    hp = 2;
    mov = 3;
    ht = 0.5;
    type = 8;
    hps = 2;

    attack(enemy, chars)
    {
        if (this.acc >= Math.random())
            chars[enemy].hp -= 1;
    }
}
