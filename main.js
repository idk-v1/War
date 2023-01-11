var can = document.getElementById("can");
ctx = can.getContext("2d");

can.width = Math.min(window.innerWidth * 0.95, window.innerHeight * 0.95);
can.height = can.width;

var game;

var page = 0;
var buttons = [
    new Button(can.width * 0.5 - can.width * 0.5 * 0.4, can.height * 0.5 - can.height * 0.5 * 0.125, can.width * 0.4, can.height * 0.125, 1, "START")
];

renderBG();
renderPage();


function input(x, y)
{
    if (page == 3)
        game.move(x, y);
    else

        for (var i = 0; i < pages[page].clk.length; i++)
        {
            var clk = pages[page].clk[i];
            if (x >= can.width / 2 + can.width * clk.x &&
             y >= can.height / 2 + can.height * clk.y &&
              x <= can.width / 2 + can.width * clk.x + can.width * clk.w &&
               y <= can.height / 2 + can.height * clk.y + can.height * clk.h)
            {
                if (page == 1 && i < 3 && i > -1)
                {
                    if (pages[page].select != i)
                        pages[page].select = i;
                    else
                        pages[page].select = -1;
                    renderBG();
                    renderPage();
                }
            }
        }

        for (var i = 0; i < pages[page].btn.length; i++)
        {
            var btn = pages[page].btn[i];
            if (x >= can.width / 2 + can.width * btn.x &&
             y >= can.height / 2 + can.height * btn.y &&
              x <= can.width / 2 + can.width * btn.x + can.width * btn.w &
               y <= can.height / 2 + can.height * btn.y + can.height * btn.h)
            {
                if (page > -1 && page < 2 && i == 0)
                {
                    page++;
                    renderBG();
                    renderPage();
                }
                else if (page == 2 && i == 0)
                {
                    page++;
                    ctx.clearRect(0, 0, can.width, can.height);
                    game = new Game(/* chars, mapNum */);
                }
            }
        }
}

function renderBG()
{
    for (var y = 0; y < can.height; y += 5)
    for (var x = 0; x < can.width; x += 5)
    {
        ctx.fillStyle = "rgb(" + (255 - 255 * (x / can.height)) + ", 0, " + (255 * (x / can.width)) + ")";
        ctx.fillRect(x, y, 5, 5);
    }
}

function renderPage()
{
    ctx.textAlign = "center";
    ctx.textBaseLine = "middle";
    ctx.strokeStyle = "#fff8";
    ctx.lineWidth = 5;
    ctx.fillStyle = "#fff8";
    
    for (var i = 0; i < pages[page].btn.length; i++)
    {
        var btn = pages[page].btn[i];
        ctx.font = can.width * btn.fs + "px Spectral";
        ctx.strokeRect(can.width / 2 + can.width * btn.x, can.height / 2 + can.height * btn.y, can.width * btn.w, can.height * btn.h);
        ctx.fillText(btn.str, can.width / 2 + can.width * btn.x + can.width * btn.w / 2, can.height / 2 + can.height * btn.y + can.height * btn.h / 2 * 1.5);
    }

    for (var i = 0; i < pages[page].lbl.length; i++)
    {
        var lbl = pages[page].lbl[i];
        ctx.font = can.width * lbl.fs + "px Spectral";
        ctx.fillText(lbl.str, can.width / 2 + can.width * lbl.x + can.width * lbl.w / 2, can.height / 2 + can.height * lbl.y + can.height * lbl.h / 2 * 1.5);
        if (lbl.box)
            ctx.strokeRect(can.width / 2 + can.width * lbl.x, can.height / 2 + can.height * lbl.y, can.width * lbl.w, can.height * lbl.h);
    }

    for (var i = 0; i < pages[page].dsp.length; i++)
    {
        var dsp = pages[page].dsp[i];

        ctx.fillStyle = "#fff";
        ctx.fillRect(can.width / 2 + can.width * dsp.x, can.height / 2 + can.height * dsp.y, can.width * dsp.w, can.height * dsp.h);
        for (var y = 0; y < maps[dsp.index][0]; y++)
            for (var x = 0; x < maps[dsp.index][0]; x++)
            {
                if (maps[dsp.index][y + 1][x] % 2)
                {
                    ctx.fillStyle = "#2228";
                    ctx.fillRect(can.width / 2 + can.width * dsp.x + can.width * dsp.w * (x / maps[dsp.index][0]), can.height / 2 + can.height * dsp.y + can.height * dsp.h * (y / maps[dsp.index][0]), (can.width * dsp.w) / maps[dsp.index][0], (can.height * dsp.h) / maps[dsp.index][0]);
                }

                ctx.fillStyle = "#" + ((x + y * maps[dsp.index][0]) % 2 ? "8886" : "90909088");
                ctx.fillRect(can.width / 2 + can.width * dsp.x + can.width * dsp.w * (x / maps[dsp.index][0]), can.height / 2 + can.height * dsp.y + can.height * dsp.h * (y / maps[dsp.index][0]), (can.width * dsp.w) / maps[dsp.index][0], (can.height * dsp.h) / maps[dsp.index][0]);
            }
        ctx.strokeRect(can.width / 2 + can.width * dsp.x, can.height / 2 + can.height * dsp.y, can.width * dsp.w, can.height * dsp.h);
    }

    for (var i = 0; i < pages[page].clk.length; i++)
    {
        if (pages[page].select == i)
        {
            var btn = pages[page].clk[i];
            ctx.fillStyle = "#ff87";
            ctx.fillRect(can.width / 2 + can.width * btn.x, can.height / 2 + can.height * btn.y, can.width * btn.w, can.height * btn.h);
        }
    }
}