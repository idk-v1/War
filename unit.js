class Character
{
    acc; macc; hp; mov; ht; dmg; type; x; y;

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

    usePower(chars, map, x, y)
    {

    }

    getMoves(x, y, dist, chars, map, moves, tileNum)
    {
        this.diamond(x, y, dist, map, tileNum, moves);
        for (var i = 0; i < chars.length; i++)
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

    getAttacks(x, y, map, chars)
    {

    }

    attack(enemies, map)
    {

    }

    melee(enemy)
    {
        
    }
}

class Grunt extends Character
{
    acc = 0.33;
    macc = 0.33;
    hp = 2;
    mov = 3;
    ht = 0.5;
}

class Leader extends Character
{
    acc = 0.5;
    macc = 0.5;
    hp = 3;
    mov = 3;
    ht = 0.5;
    type = 1;

    startEffect(chars)
    {
        for (var i = 0; i < chars.length; i++)
            if (chars[i].team == this.team && chars[i].type == 0)
            {
                chars[i].mov += 1;
                chars[i].acc += 0.33;
                chars[i].macc += 0.33;
                chars[i].hp += 1;
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
}

class Scout extends Character
{
    acc = 0.5;
    macc = 0.5;
    hp = 2;
    mov = 3;
    ht = 0.5;
    type = 3;

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
    macc = 0.75;
    hp = 3;
    mov = 2;
    ht = 0.5;
    type = 4;
}

class Assassin extends Character
{
    acc = 0.5;
    macc = 1;
    hp = 2;
    mov = 5;
    ht = 0.5;
    type = 5;
}

class Heavy extends Character
{
    acc = 0.75;
    macc = 0.5;
    hp = 3;
    mov = 3;
    ht = 0.5;
    type = 6;
}

class Medic extends Character
{
    acc = 1;
    macc = 0.5;
    hp = 3;
    mov = 4;
    ht = 0.5;
    type = 7;
}

class Sniper extends Character
{
    acc = 0.66;
    macc = 0.5;
    hp = 2;
    mov = 3;
    ht = 0.5;
    type = 8;
}