class Game
{
    moves = [];
    map = [];
    enemies = [];
    chars = [];
    select = -1;
    tileNum;
    tileSize;
    turns = 0;
    ended = false;

    constructor(characters, map)
    {
        can.style.boxShadow = "0 4px 8px 0 rgba(128, 128, 255, 0.4), 0 6px 20px 0 rgba(128, 128, 255, 0.38)";

        for(var i = 0; i < map[0]; i++)
            this.map.push(map[i + 1].splice(0));
        this.moves = this.map;
        this.tileNum = map[0];
        this.tileSize = can.width / this.tileNum;
        this.clearArr();

        for (var i = 0; i < 8; i++)
        {
            var pos;
            switch(i % 4)
            {
                case 0:
                    pos = 2;
                    break;
                case 1:
                    pos = 5;
                    break;
                case 2:
                    pos = 9;
                    break;
                case 3:
                    pos = 12;    
            }

            switch (characters[i])
            {
                case 0:
                    this.chars.push(new Grunt(pos, Math.floor(i / 4) * (this.tileNum - 1), Math.floor(i / 4)));
                    break;
                case 1:
                    this.chars.push(new Leader(pos, Math.floor(i / 4) * (this.tileNum - 1), Math.floor(i / 4)));
                    break;
                case 2:
                    this.chars.push(new Bomber(pos, Math.floor(i / 4) * (this.tileNum - 1), Math.floor(i / 4)));
                    break;
                case 3:
                    this.chars.push(new Scout(pos, Math.floor(i / 4) * (this.tileNum - 1), Math.floor(i / 4)));
                    break;
                case 4:
                    this.chars.push(new Brute(pos, Math.floor(i / 4) * (this.tileNum - 1), Math.floor(i / 4)));
                    break;
                case 5:
                    this.chars.push(new Assassin(pos, Math.floor(i / 4) * (this.tileNum - 1), Math.floor(i / 4)));
                    break;
                case 6:
                    this.chars.push(new Heavy(pos, Math.floor(i / 4) * (this.tileNum - 1), Math.floor(i / 4)));
                    break;
                case 7:
                    this.chars.push(new Medic(pos, Math.floor(i / 4) * (this.tileNum - 1), Math.floor(i / 4)));
                    break;
                case 8:
                    this.chars.push(new Sniper(pos, Math.floor(i / 4) * (this.tileNum - 1), Math.floor(i / 4)));
                    break;
            }
        }

        for (var i = 0; i < this.chars.length; i++)
            this.chars[i].startEffect(this.chars);

        this.interval = window.setInterval(() => this.render(), 1000 / 60);
    }

    move(x, y)
    {
        var xp = Math.floor(x / this.tileSize);
        var yp = Math.floor(y / this.tileSize);

        var index = -1;

        for (var i = 0; i < this.chars.length; i++)
            if (this.chars[i].hp > 0)
                if (this.chars[i].x == xp && this.chars[i].y == yp)
                    index = i;

        // DESELECT CHAR
        if (this.select == index)
        {
            this.select = -1;
            this.clearArr();
            this.enemies = [];
        }
        // SELECT CHAR
        else if (index != -1)
        {
            if (this.chars[index].hp >= 2 && this.chars[index].team == Math.floor(this.turns / 2) % 2)
            {
                this.select = index;
                this.getMoves(this.chars[this.select].x, this.chars[this.select].y, this.chars[this.select].mov)
            }

            // HEAL CHAR
            else if (this.select != -1)
                if (this.chars[index].hp > 0 && Math.abs(this.chars[index].x - this.chars[this.select].x) <= 1 && Math.abs(this.chars[index].y - this.chars[this.select].y) <= 1)
                {
                    if (this.chars[index].team == Math.floor(this.turns / 2) % 2)
                        this.chars[index].hp += this.chars[this.select].ht;

                    // MELEE CHAR
                    else
                    {
                        if (this.chars[this.select].macc + Math.random() >= this.chars[index].macc + Math.random() || this.chars[index].hp < 2)
                            this.chars[index].hp -= 1;
                        else
                            this.chars[this.select].hp -= 1;
                    }
                
                    this.turns++;
                    this.select = -1;
                    this.clearArr();
                    this.enemies = [];
                }

                // SHOOT CHARS
                else if (this.chars[index].hp >= 2 && this.chars[index].team != this.chars[this.select].team)
                {
                    for (var i = 0; i < this.enemies.length; i++)
                        if (index == this.enemies[i] && this.chars[this.select].type != 2 && this.chars[this.select].type != 5 && this.chars[this.select].type != 6 && this.chars[this.select].type != 7)
                        {
                            this.chars[i].attack(this.enemies[i], this.chars);
                            this.enemies = [];
                            this.clearArr();
                            this.select = -1;
                            this.turns++;
                        }
                }
        }
        // MOVE CHAR
        else if(index == -1 && this.select != -1)
        {
            if (this.moves[yp][xp])
            {
                this.chars[this.select].x = xp;
                this.chars[this.select].y = yp;
                this.select = -1;
                this.clearArr();
                this.turns++;
                this.enemies = [];
            }
        }
    }

    render()
    {
        var over = true;
        var skip = true;
        for (var i = 0; i < this.chars.length; i++)
            if (this.chars[i].team == Math.floor(this.turns / 2) % 2) 
            {
                if (this.chars[i].hp >= 2)
                    skip = false;
                if (this.chars[i].hp != 0)
                    over = false;
            }
        if (skip)
            this.turns += 2;
        if (over)
            this.ended = true;

        can.style.boxShadow = "0 4px 8px 0 " + (Math.floor(this.turns / 2) % 2 ? "rgba(255, 128, 128, 0.6)" : "rgba(128, 128, 255, 0.6)") + ", 0 6px 20px 0 " + (Math.floor(this.turns / 2) % 2 ? "rgba(255, 128, 128, 0.57)" : "rgba(128, 128, 255, 0.57)");


        // DRAW TILES
        for (var y = 0; y < this.tileNum; y++)
            for (var x = 0; x < this.tileNum; x++)
            {
                // DRAW WALLS
                if (this.map[y][x] % 2)
                {
                    ctx.fillStyle = "#2228";
                    ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                }

                // DRAW CHECKERBOARD PATTERN
                ctx.fillStyle = "#" + ((x + y * this.tileNum) % 2 ? "8884" : "90909044");
                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);

                // DRAW MOVES
                if (this.moves[y][x])
                {
                    ctx.fillStyle = "#ff84";
                    ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                }
            }

        // DRAW SELECTED
        if (this.select != -1)
        {
            ctx.fillStyle = "#ff84";
            ctx.fillRect(this.chars[this.select].x * this.tileSize, this.chars[this.select].y * this.tileSize, this.tileSize, this.tileSize);
        }

        // DRAW CHARS
        for (var i = 0; i < this.chars.length; i++)
            if (this.chars[i].hp > 0)
            {
                ctx.fillStyle = "#" + (this.chars[i].team ? "f00" : "00f");
                ctx.fillRect(this.chars[i].x * this.tileSize + this.tileSize * 0.1, this.chars[i].y * this.tileSize + this.tileSize * 0.1, this.tileSize * 0.8, this.tileSize * 0.8);

                // DRAW HEALTH BAR
                ctx.fillStyle = "#fff";
                ctx.fillRect(this.chars[i].x * this.tileSize, this.chars[i].y * this.tileSize, this.tileSize, this.tileSize * 0.2);

                ctx.fillStyle = "#" + (this.chars[i].hp < 2 ? "f80" : (this.chars[i].hp > 2 ? "0cf" : "8f0"));
                ctx.fillRect(this.chars[i].x * this.tileSize + this.tileSize * 0.05, this.chars[i].y * this.tileSize + this.tileSize * 0.05, this.tileSize * (this.chars[i].hp / this.chars[i].hps) - this.tileSize * 0.1, this.tileSize * 0.1);
            }

        // DRAW RAYS
        for (var i = 0; i < this.enemies.length; i++)
        {
            ctx.strokeStyle = "#ff84";
            ctx.lineWidth = this.tileSize / 5;
            ctx.beginPath();
            ctx.moveTo((this.chars[this.select].x + 0.5) * this.tileSize, (this.chars[this.select].y + 0.5) * this.tileSize);
            ctx.lineTo((this.chars[this.enemies[i]].x + 0.5) * this.tileSize, (this.chars[this.enemies[i]].y + 0.5) * this.tileSize);
            ctx.stroke();
        }

        if (this.ended)
        {
            ctx.fillStyle = "#fff";
            ctx.fillText("GAME OVER!", can.width / 2, can.height / 2);
        }

        ctx.fillStyle = "#" + (Math.floor(this.turns / 2) % 2 ? "54433444" : "34435444");
        ctx.fillRect(0, 0, can.width, can.height);
    }

    getMoves(x, y, dist)
    {
        this.clearArr();
        this.enemies = [];
        this.chars[this.select].getMoves(x, y, dist, this.chars, this.map, this.moves, this.tileNum);
        for (var i = 0; i < this.chars.length; i++)
            if (this.chars[i].team != this.chars[this.select].team && this.chars[i].hp >= 2)
                if (this.chars[this.select].raytrace(this.chars[this.select].x + 0.5, this.chars[this.select].y + 0.5, this.chars[i].x + 0.5, this.chars[i].y + 0.5, this.map))
                    this.enemies.push(i);
    }

    clearArr()
    {
        var temp = [];
        for (var i =  0; i < this.tileNum; i++)
            temp.push(0);
        this.moves = [];
        for (var i = 0; i < this.tileNum; i++)
            this.moves.push(temp.slice());
    }
}