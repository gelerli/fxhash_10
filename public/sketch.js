/*******************************************************************************************************************/
/*******************************************************************************************************************/
/*********************************************** de:gather by evil *************************************************/
/*******************************************************************************************************************/
/*******************************************************************************************************************/

// seed generation
let f1 = fxrand(); // for random seed 
let f2 = fxrand(); // for noise seed 
let f3 = fxrand(); // for palette selection
let f4 = fxrand(); // for grid selection
let f5 = fxrand(); // for style
//let f6 = fxrand(); // for fancy

//features 
let features = (window.$fxhashFeatures = {});

let soft = false;
let spikey = false;
let plasma = false;
let warped = false;

if (f5 < 0.876) {
    soft = true;
    plasma = true;
    console.log("soft");
    features["style"] = "soft";
} else {
    spikey = true;
    console.log("broken");
    features["style"] = "broken";
}

// open simplex noise API
let API;

// arrays for noise values
let n1Vals = [];
let n2Vals = [];

// declare seeds
let seed1, seed2;
let fVals = new Array(77777);

// off-screen canvases
let cnvs, cnvs0, cnvs1, cnvs2, cnvs3, kmpzt, tex1, tex2;;

// size related variables
let cnvsSize;
let w, h, dim, margin, numRows, numCols, rowSize, colSize;
let unit; // size-relative unit to ensure same output
cnvsSize = 1000;
dim = 2000;
unit = dim / 2000;

// grid and related variables
let grid = [];
let gridBools = [];

// limits for torn grid cells, used in all 3 layers
let lowerLimit = 0.09;
let upperLimit = 0.91;

// other variables
let gradient, bgkolor, bggradientkolor;

// palette and related variables
let palette, paletteHEX, palettes, paletteNames, paletteIdx;

// bg colors
let bgcolors = [
    [237, 226, 180],
    [236, 177, 75],
    [241, 198, 103],
    [254, 212, 128],
];

/*******************************************************************************************************************/
function setup() {

    //basics
    seed1 = Math.floor(f1 * 7777777);
    seed2 = Math.floor(f2 * 7777777);

    randomSeed(seed1);
    noiseSeed(seed2);
    for (let i = 0; i < fVals.length; i++) { fVals[i] = fxrand(); } 

    API = openSimplexNoise(round((seed1 + seed2) * 0.5));

    createCanvas(cnvsSize, cnvsSize);

    // set main palette and kolor order
    paletteIdx = floor(f3 * palettes.length);
    palette = palettes[paletteIdx];
    console.log("palette: " + paletteNames[paletteIdx] + " reduced");
    features["palette"] = paletteNames[paletteIdx] + " reduced";

    // set grid related variables
    numCols = floor(random(4, 7));
    numRows = floor(random(4, 7));
    margin = int(floor(dim / numCols));
    if (margin == 333) margin = 256;     // unfortunately had to hardcode these
    if (margin == 500) margin = 512;     // unfortunately had to hardcode these
    if (margin == 332) margin = 240;     // unfortunately had to hardcode these
    rowSize = ceil((dim - margin * 2) / numRows);
    colSize = ceil((dim - margin * 2) / numCols);
    depth = floor(random(3, 5));

    // necessary for grid type 3
    for (let x = 0; x < numRows; x++) {
        var column = [];
        for (let y = 0; y < numCols; y++) {
        column.push(1);
        }
        gridBools.push(column);
    }

    console.log("Columns: " + numRows); // this would take too long to fix
    console.log("Rows: " + numCols); // this would take too long to fix
    console.log("Margin: " + margin);
    //console.log("col size: " + colSize);
    //console.log("row size: " + rowSize);

    // grid selection
    switch (floor(f4 * 3)) {
        case 0:
            createGrid1(dim);
            console.log("grid 1");
            //gridType = 1;
            //features["grid type"] = "1";
        break;

        case 1:
            createGrid2(
                floor(margin),
                floor(margin),
                floor(dim - margin * 2),
                floor(dim - margin * 2),
                depth - 1
            );
            console.log("grid 2, depth: " + depth);
            //gridType = 2;
            //features["grid type"] = "2";
        break;

        case 2:
            createGrid3([3, 2, 1], [2, 1]);
            createGrid3();
            console.log("grid 3");
            //gridType = 3;
            //features["grid type"] = "3";
        break;

        default:
            createGrid1(dim);
            console.log("not working properly!");
    }
    
    // sorting grid according y values gives better results
    grid.sort(function(a,b){return a[1]-b[1]});
    //console.log(grid);
    
    // misc.
    noFill();
    angleMode(DEGREES);
    imageMode(CENTER);
    //ellipseMode(CENTER);
    //rectMode(CENTER);

    // set background colors
    bgkolor = random(bgcolors);
    bgcolors.splice(bgcolors.indexOf(bgkolor), 1);
    bggradientkolor = random(bgcolors);

    // create off-screen canvasses 
    //cnvs0 = createGraphics(dim,dim); // grid
    cnvs1 = createGraphics(dim,dim); // tops
    cnvs2 = createGraphics(dim,dim); // lefts
    cnvs3 = createGraphics(dim,dim); // rights
    kmpzt = createImage(dim,dim); // composite image for masking

    // calculate and save noise values
    calcNoise1();
    calcNoise2();

    // draw everything on off-screen canvases here
    createBG(dim);
    createTex1(dim);
    createTex2(dim);

    //drawGrid(cnvs0);

    layer1(cnvs1, floor(random() * 20 +30), floor(f1+f2+f3+f4+f5), random([16,24,18,20])); // tops
    layer2(cnvs2, floor(random() * 20 +30), ceil(f1+f2+f3+f4+f5), random([24,18])); // lefts
    layer3(cnvs3, floor(random() * 20 +30), ceil(f1+f2+f3+f4+f5), random([24,18])); // rights

    // warp related variables
    let warpFactor = random(7,13);
    let fctr = (warpFactor * 0.0000013 + 0.0004).toFixed(11);
    let rng = int(warpFactor * 77)+ 77;
    if (f1 + f2 + f3 > 2.2) {
        knvsWarp(cnvs3, fctr, rng, 0);
        console.log("warped");
        warped = true;
    } else if (f1 + f2 + f3 < 1.1) {
        knvsWarp(cnvs2, fctr, rng, 0);
        console.log("warped");
        warped = true;
    }
    
}

function draw() {

    image(cnvs, cnvsSize  * 0.5, cnvsSize  * 0.5, cnvsSize, cnvsSize); // BACKGROUND first layer

    image(tex2, cnvsSize  * 0.5, cnvsSize  * 0.5, cnvsSize, cnvsSize); // TEXTURE2

    /*
    blendMode(HARD_LIGHT);
    image(cnvs1, cnvsSize  * 0.5, cnvsSize  * 0.5, cnvsSize, cnvsSize); // tops
    blendMode(BLEND);
    */

    if (warped) {
        blendMode(HARD_LIGHT);
        image(kmpzt, cnvsSize  * 0.5, cnvsSize  * 0.5, cnvsSize, cnvsSize);
        image(cnvs1, cnvsSize  * 0.5, cnvsSize  * 0.5, cnvsSize, cnvsSize); // tops
        blendMode(BLEND);
        if (f1 + f2 + f3 < 1.1) {
            image(cnvs3, cnvsSize  * 0.5, cnvsSize  * 0.5, cnvsSize, cnvsSize); // rights
        } else if ((f1 + f2 + f3 > 2.2)) {
            image(cnvs2, cnvsSize  * 0.5, cnvsSize  * 0.5, cnvsSize, cnvsSize); // lefts
        }
    } else {
        blendMode(HARD_LIGHT);
        image(cnvs1, cnvsSize  * 0.5, cnvsSize  * 0.5, cnvsSize, cnvsSize); // tops
        blendMode(BLEND);
        image(cnvs2, cnvsSize  * 0.5, cnvsSize  * 0.5, cnvsSize, cnvsSize); // lefts
        image(cnvs3, cnvsSize  * 0.5, cnvsSize  * 0.5, cnvsSize, cnvsSize); // rights
    }
    
    //image(kmpzt, cnvsSize  * 0.5, cnvsSize  * 0.5, cnvsSize, cnvsSize); // main composite image

    image(tex1, cnvsSize  * 0.5, cnvsSize  * 0.5, cnvsSize, cnvsSize); // TEXTURE1 last layer

    noLoop();

}
