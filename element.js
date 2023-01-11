class Page
{
    btn = [];
    lbl = [];
    dsp = [];
    clk = [];
    select = -1;
}

class Button
{
    constructor(x, y, w, h, str, fs)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.str = str;
        this.fs = fs;
    }
}

class Label
{
    constructor(x, y, w, h, str, fs, box)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.str = str;
        this.fs = fs;
        this.box = box;
    }
}

class Display
{
    constructor(x, y, w, h, index)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.index = index;
    }
}

class ClickArea
{
    constructor(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

var pages = [];


//MENU
pages.push(new Page);

// Play Button
pages[0].btn.push(new Button(-0.15, -0.0625, 0.3, 0.125, "PLAY", 0.1));


//MAPS
pages.push(new Page);

//TITLE
pages[1].lbl.push(new Label(-0.125, -0.425, 0.25, 0.05, "MAPS", 0.125, false));

//NEXT
pages[1].btn.push(new Button(0.27, 0.4, 0.2, 0.08, "Next", 0.066));

//LEFT
pages[1].clk.push(new ClickArea(-0.125 - 0.3, -0.36, 0.25, 0.31));
pages[1].dsp.push(new Display(-0.125 - 0.3, -0.36, 0.25, 0.25, 0));
pages[1].lbl.push(new Label(-0.125 - 0.3, -0.1, 0.25, 0.05, "ORE", 0.04, true));

//MID
pages[1].clk.push(new ClickArea(-0.125, -0.36, 0.25, 0.31));
pages[1].dsp.push(new Display(-0.125, -0.36, 0.25, 0.25, 0));
pages[1].lbl.push(new Label(-0.125, -0.1, 0.25, 0.05, "???", 0.04, true));

//RIGHT
pages[1].clk.push(new ClickArea(-0.125 + 0.3, -0.36, 0.25, 0.31));
pages[1].dsp.push(new Display(-0.125 + 0.3, -0.36, 0.25, 0.25, 0));
pages[1].lbl.push(new Label(-0.125 + 0.3, -0.1, 0.25, 0.05, "???", 0.04, true));


//CHARACTERS
pages.push(new Page);

//NEXT
pages[2].btn.push(new Button(0.27, 0.4, 0.2, 0.08, "Next", 0.066));


//GAME
pages.push(new Page);