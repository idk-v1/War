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

    constructor(characters, map)
    {
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

        this.interval = window.setInterval(() => this.render(), 1000 / 60);
    }

    move(x, y)
    {
        var xp = Math.floor(x / this.tileSize);
        var yp = Math.floor(y / this.tileSize);

        var index = -1;

        for (var i = 0; i < this.chars.length; i++)
            if (this.chars[i].team == this.turns % 2)
                if (this.chars[i].x == xp && this.chars[i].y == yp)
                    index = i;

        // DESELECT CHAR
        if (this.select == index)
        {
            this.select = -1;
            this.clearArr();
        }
        // SELECT CHAR
        else if (index != -1)
        {
            this.select = index;
            this.getMoves(this.chars[this.select].x, this.chars[this.select].y, this.chars[this.select].mov)
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
            }
        }

    }

    render()
    {
        // DRAW TILES
        for (var y = 0; y < this.tileNum; y++)
            for (var x = 0; x < this.tileNum; x++)
            {
                // DRAW WALLS
                if (this.map[y][x] % 2)
                {
                    ctx.fillStyle = "#2224";
                    ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                }

                // DRAW CHECKERBOARD PATTERN
                ctx.fillStyle = "#" + ((x + y * this.tileNum) % 2 ? "8882" : "90909022");
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
        {
            ctx.fillStyle = "#" + (this.chars[i].team ? "f00" : "00f");
            ctx.fillRect(this.chars[i].x * this.tileSize + this.tileSize * 0.1, this.chars[i].y * this.tileSize + this.tileSize * 0.1, this.tileSize * 0.8, this.tileSize * 0.8);
        }
    }

    raycast(x0, y0, x1, y1)
    {

    }

    getMoves(x, y, dist)
    {
        this.clearArr();
        this.enemies = [];
        this.chars[this.select].getMoves(x, y, dist, this.chars, this.map, this.moves, this.tileNum);
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