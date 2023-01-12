class Character
{
    constructor(x, y, team)
    {
        this.x = x;
        this.y = y;
        this.team = team;
        this.type = 0;

        this.acc = 0.33;
        this.macc = 0.33;
        this.hp = 2;
        this.mov = 3;
        this.ht = 0.5;
        this.dmg = 1;
    }
}

class Grunt extends Character
{
    acc = 0.33;
    macc = 0.33;
    hp = 2;
    mov = 3;
    ht = 0.5;
    dmg = 1;

    power()
    {
        
    }
}

// class Sniper
// {
//     turn(x, y, map, chars)
//     {
//         var move = true;
//         var heal = -1;
//         var melee = -1;
//         var shoot = -1;
//         var reselect = -1;

//         // if place on map is not open or place is too far
//         // - move = false

//         // if any character is on spot
//         // - move = false


//         // if team character is within 1 tile
//         // - heal = i


//         // if enemy character is within 1 tile
//         // - melee = i


//         // if character can see other character
//         // - shoot = i


//         // if character is selected
//         // - select = -1

//         // if team character is not downed
//         // - 

//     }
// }