// helper functions

/*******************************************************************************************************************/
// NOISE CALCULATIONS

function calcNoise1() {

    let factor1 = 0.0017;
  
    for (let y = 0; y <= dim ; y++) {
        for (let x = 0; x <= dim; x++) {

        n1Vals[x + y * dim] = API.noise2D(x * factor1, y * factor1);
        //n1Vals[x + y * dim] = noise(x * factor1, y * factor1);
            
        }
    }

}

function calcNoise2() {

    let factor2 = 0.003;
  
    for (let y = 0; y <= dim; y ++) {
      for (let x = 0; x <= dim; x ++) {
        
        let n1 =  n1Vals[x + y * dim];
        n2Vals[x + y * dim] = API.noise2D((x + n1) * factor2, (y + n1) * factor2);
        //n2Vals[x + y * dim] = noise((x + n1) * factor2, (y + n1) * factor2);
        
      }
    }

}

/*******************************************************************************************************************/
// ISOMETRY

function isoTop(knvs, posX, posY, rounds, ang, rad, kol1 = knvs.color(10,110), kol2 = knvs.color(10,110)) {

    let currentKolor;

    knvs.angleMode(DEGREES);

    knvs.push();
    knvs.translate(posX, posY);
    for (let j = 0; j <= rounds; j+=1) {

        if (soft) {
            let rotAng = n2Vals[knvs.floor(posX + (posY - knvs.map(j, 0, rounds, 0, rounds/20)) * width) % n2Vals.length] * -7 + f5;
            knvs.rotate(rotAng);
        }

        if (soft && j > rounds * 0.6) {
            knvs.translate(0, - knvs.map(j, 0, rounds, 0, rounds/30)); // going up
        } else {
            knvs.translate(0, - knvs.map(j, 0, rounds, 0, rounds/20)); // going up
        }
        
        knvs.push();
        knvs.rotate(knvs.map(j, 0, rounds, 0, 120));

        if (kol1 == kol2) {currentKolor = kol1;} else {currentKolor = knvs.lerpColor(kol1, kol2, j / rounds);}
        //if (f5  + f4 + f3 < 1.5) currentKolor.setAlpha(220);
        knvs.fill(currentKolor);

        knvs.beginShape();
        for (let theta = 0; theta < 360; theta += ang) {
            
            let x = (rad - knvs.map(j, 0, rounds, 0, rad - unit)) * knvs.cos(theta);
            let y = (rad - knvs.map(j, 0, rounds, 0, rad - unit)) * knvs.sin(theta) / 2;
            
            knvs.vertex(x,y);
        }
        knvs.endShape(CLOSE);
        knvs.pop();

    }
    knvs.pop();

}

function isoRight(knvs, posX, posY, rounds, ang, rad, kol1, kol2) {

    let currentKolor;

    knvs.angleMode(DEGREES);

    knvs.push();
    knvs.translate(posX, posY);
    for (let j = 0; j <= rounds; j+=1) {

        if (!soft) {
            let rotAng;
            rotAng = n2Vals[knvs.floor(posX + (posY - knvs.map(j, 0, rounds, 0, rounds/10)) * width) % n2Vals.length] * 5 + f5;
            knvs.rotate(rotAng);
        }

        knvs.translate(j/30, j/60); // - for left, + for right
        
        knvs.push();

        knvs.shearY(-27); // - for right, + for left

        knvs.rotate(15 - j*3);

        if (kol1 == kol2) {currentKolor = kol1;} else {currentKolor = knvs.lerpColor(kol1, kol2, j / rounds);}
        knvs.fill(currentKolor);

        knvs.beginShape();
        for (let theta = 0; theta < 360; theta += ang + 10 * noise(j * 0.01)) {
            let x = (rad - knvs.map(j, 0, rounds, 0, rad)) * knvs.cos(theta + 30) * 0.7;
            let y = (rad - knvs.map(j, 0, rounds, 0, rad)) * knvs.sin(theta + 30) * 0.7;
            
            knvs.vertex(x,y);
        }
        knvs.endShape(CLOSE);
        knvs.pop();

    }
    knvs.pop();

}

function isoLeft(knvs, posX, posY, rounds, ang, rad, kol1, kol2) {

    let currentKolor;

    knvs.angleMode(DEGREES);

    knvs.push();
    knvs.translate(posX, posY);
    for (let j = 0; j <= rounds; j+=1) {

        if (!soft) {
            let rotAng;
            rotAng = n2Vals[knvs.floor(posX + (posY - knvs.map(j, 0, rounds, 0, rounds/10)) * width) % n2Vals.length] * 5 + f5;
            knvs.rotate(rotAng);
        }

        knvs.translate(-j/30, j/60); // - for left, + for right
        
        knvs.push();

        knvs.shearY(27); // - for right, + for left

        knvs.rotate(15 + j*3);

        if (kol1 == kol2) {currentKolor = kol1;} else {currentKolor = knvs.lerpColor(kol1, kol2, j / rounds);}
        knvs.fill(currentKolor);

        knvs.beginShape();
        for (let theta = 0; theta < 360; theta += ang + 10 * noise(j * 0.01)) {
            let x = (rad - knvs.map(j, 0, rounds, 0, rad)) * knvs.cos(theta + 30) * 0.7;
            let y = (rad - knvs.map(j, 0, rounds, 0, rad)) * knvs.sin(theta + 30) * 0.7;
            
            knvs.vertex(x,y);
        }
        knvs.endShape(CLOSE);
        knvs.pop();

    }
    knvs.pop();

}

/*******************************************************************************************************************/
/*  GRID GENERATOR FUNCTIONS  */

/*  
grid generator functions 2 & 3 are based on https://gorillasun.de/blog/an-algorithm-for-irregular-grids 
by Ahmad Moussa https://twitter.com/gorillasu and used with his knowledge and kind permission.
*/

function createGrid1(size) {

    for (let y = margin; y < floor(size - margin); y += colSize) {
        for (let x = margin; x < floor(size - margin); x += rowSize) {
                
            grid.push([ceil(x), ceil(y), ceil(rowSize), ceil(colSize)]);

        }
    }

}
  
function createGrid2(x, y, gridWidth, gridHeight, depth) {

    if (depth > 0) {
        createGrid2(
            ceil(x),
            ceil(y),
            ceil(gridWidth / 2),
            ceil(gridHeight / 2),
            depth - int(random([1, 2]))
        );
        createGrid2(
            ceil(x + gridWidth / 2),
            ceil(y),
            ceil(gridWidth / 2),
            ceil(gridHeight / 2),
            depth - int(random([1, 2]))
        );
        createGrid2(
            ceil(x),
            ceil(y + gridHeight / 2),
            ceil(gridWidth / 2),
            ceil(gridHeight / 2),
            depth - int(random([1, 2]))
        );
        createGrid2(
            ceil(x + gridWidth / 2),
            ceil(y + gridHeight / 2),
            ceil(gridWidth / 2),
            ceil(gridHeight / 2),
            depth - int(random([1, 2]))
        );
    } else {
      grid.push([ceil(x), ceil(y), ceil(gridWidth), ceil(gridHeight)]);
    }

}
  
function createGrid3(sizesArrX = [1], sizesArrY = [1]) {

    rowSize = (dim - margin * 2) / numRows;
    for (let x = 0; x < numRows - max(sizesArrX) + 1; x++) {
        for (let y = 0; y < numCols - max(sizesArrY) + 1; y++) {
            xdim = random(sizesArrX);
            ydim = random(sizesArrY);
    
            fits = true;
    
            // check if within bounds
            if (x + xdim > numRows || y + ydim > numCols) {
                fits = false;
            }
    
            // check if rectangle overlaps with any other rectangle
            if (fits) {
                for (let xc = x; xc < x + xdim; xc++) {
                    for (let yc = y; yc < y + ydim; yc++) {
                        if (gridBools[xc][yc] == 0) {
                            fits = false;
                        }
                    }
                }
            }
    
            if (fits) {
                // mark area as occupied
                for (let xc = x; xc < x + xdim; xc++) {
                    for (let yc = y; yc < y + ydim; yc++) {
                    gridBools[xc][yc] = 0;
                    }
                }
    
                grid.push([ceil(x * rowSize + margin), ceil(y * colSize + margin), ceil(xdim * rowSize), ceil(ydim * colSize)]);

            }
        }
    }

}

/*******************************************************************************************************************/
function createBG(dimension = 1000) {

    cnvs = createGraphics(dimension, dimension);
    cnvs.background(bgkolor[0], bgkolor[1], bgkolor[2]);

    //gradient
    gradient = createImage(100, 100);
    gradient.loadPixels();
    for (let i = 0; i < gradient.width; i++) {
        for (let j = 0; j < gradient.height; j++) {
        gradient.set(
            j,
            i,
            color(
            bggradientkolor[0],
            bggradientkolor[1],
            bggradientkolor[2],
            (i % gradient.height) * 2
            )
        );
        }
    }
    gradient.updatePixels();

    cnvs.image(gradient, 0, 0, dimension, dimension);

}

/*******************************************************************************************************************/
function createTex1(dim = 1000) {

    tex1 = createGraphics(dim, dim);
    tex1.colorMode(HSB, 360, 100, 100, 100);
    tex1.angleMode(DEGREES);
    tex1.strokeWeight(unit);
    for (let i = 0; i < (tex1.width * tex1.height * 1) / 100; i++) {
        if (random() > 0.5) {
            tex1.stroke(0, 0, 100, 2);
        } else {
            tex1.stroke(0, 0, 0, 1);
        }
        let cx = random(tex1.width);
        let cy = random(tex1.height);
        let angle = random(360);
        tex1.line(
            cx + cos(angle) * tex1.width,
            cy + sin(angle) * tex1.height,
            cx + cos(angle + 180) * tex1.width,
            cy + sin(angle + 180) * tex1.height
        );
    }

}

/*******************************************************************************************************************/
function createTex2(dim = 1000) {

    tex2 = createGraphics(dim* 1.1, dim * 1.1);
    tex2.colorMode(HSB, 360, 100, 100, 100);
    tex2.angleMode(DEGREES);
    tex2.strokeWeight(unit*floor(random(3,5)));

    let increment = unit * floor(random(7,12));

    tex2.push();
    tex2.rotate(random(-1,1));

    for (let i = 0; i < tex2.width; i+= increment) {
        if (random() > 0.5) {
            tex2.stroke(0, 0, 100, 2);
        } else {
            tex2.stroke(0, 0, 0, 1);
        }

        tex2.line(i, 0, i, tex2.height);

    }

    for (let j = 0; j < tex2.height; j+= increment) {
        if (random() > 0.5) {
            tex2.stroke(0, 0, 100, 2);
        } else {
            tex2.stroke(0, 0, 0, 1);
        }

        tex2.line(0, j, tex2.width, j);

    }

    tex2.pop();

}

/*******************************************************************************************************************/
function windowResized() {

    w = windowWidth;
    h = windowHeight;
    w == h ? (cnvsSize = w) : (cnvsSize = min(w, h));
    if (w < 250 || h < 250) cnvsSize = 250;
    resizeCanvas(cnvsSize, cnvsSize);
    draw();

}

/*******************************************************************************************************************/
function keyPressed() {

    if (key == "s") {
        save(seed1 + "_" + seed2 + ".png");
    }
    
    if (key == "1") {
        dim = 4096;
        resizeCanvas(dim, dim);
        unit = dim / 2000;
        draw();
        console.log("hi-res : 4096nx");
    }

    if (key == "2") {
        dim = 2048;
        resizeCanvas(dim, dim);
        unit = dim / 2000;
        draw();
        console.log("mid-res : 2048nx");
    }
    
}

/*******************************************************************************************************************/
//warp function calculations are based on this article by @iquilezles -> https://www.iquilezles.org/www/articles/warp/warp.htm

//warp with open simplex noise

function warp(a, b, factor, n_range) {

    let n1 = API.noise2D((a + 0.0) * factor, (b + 0.0) * factor) * n_range;
    let n2 = API.noise2D((a + 5.2) * factor, (b + 1.3) * factor) * n_range;
    let q = createVector(n1, n2);
  
    let n3 = API.noise2D((a + q.x * 4 + 1.7) * factor, (b + q.y * 4 + 9.2) * factor) * n_range;
    let n4 = API.noise2D((a + q.x * 4 + 8.3) * factor, (b + q.y * 4 + 2.8) * factor) * n_range;
    let r = createVector(n3, n4);
  
    return ( API.noise2D((a + r.x * 4) * factor, (b + r.y * 4) * factor) * (n_range));

}

/*******************************************************************************************************************/

function knvsWarp(knvs1, factorL, n_rangeL, swtch = 0) {
    
    // knvs1 half transparency
    if (swtch == 1) {
        knvs1.loadPixels();
        for (y = 0; y < knvs1.height * 4; y += 4) {
            for (x = 0; x < knvs1.width * 4; x += 4) {
                let idx = x + y * knvs1.width;
                
                if (knvs1.pixels[idx +3] !==0) knvs1.pixels[idx +3] = 133;
        
            }
        }
        knvs1.updatePixels();
    }

    kmpzt.copy(knvs1, 0, 0, knvs1.width, knvs1.height, 0, 0, kmpzt.width, kmpzt.height);

    // warp
    kmpzt.loadPixels();
    for (y = 0; y < kmpzt.height * 4; y += 4) {
        for (x = 0; x < kmpzt.width * 4; x += 4) {

            let idx = x + y * kmpzt.width;
            let pxArrLen = kmpzt.height * kmpzt.width * 4;
            let n;

            //warp(a, b, factor, n_range) // LEGEND for warp
            n = warp(x, y, factorL, n_rangeL);

            let offset = floor(n);

            if (offset < 0) offset = abs(offset); 
            if (offset % 4 !== 0) offset = offset - (offset % 4); // offset has to be multiples of 4 due to the nature of the pixel array
            if (offset + idx >= pxArrLen) offset = offset % pxArrLen; 
            if (offset + x >= kmpzt.width * 4) offset = noise(x * 0.01) * offset/2 ; //to avoid left side bleeding to the right

            let c = [
            kmpzt.pixels[idx + offset],
            kmpzt.pixels[idx + offset + 1],
            kmpzt.pixels[idx + offset + 2],
            kmpzt.pixels[idx + offset + 3],
            ];

            kmpzt.pixels[idx] = c[0];
            kmpzt.pixels[idx + 1] = c[1];
            kmpzt.pixels[idx + 2] = c[2];
            kmpzt.pixels[idx + 3] = c[3];
        }
    }
    kmpzt.updatePixels();
    
}

/*******************************************************************************************************************/

// this is a quick and dirty way to handle the palette selection and probability but it works :)
// also, these two arrays should be in the same file for easy cancelling of palettes, because they have to be identical.
  
paletteNames = [
    "memories lost",
    "memories lost",
    "you've been naughty!",
    "hiding under the table",
    "candy flush",
    "boiling water",
    "easy tiger",
    "price on my head",
    "need a father figure",
    "family ties",
    "chihuahua",
    "eyes on the prize",
    "the shitsy fox",
    "neon dreams",
    "neon dreams",
    "neon dreams",
    "neon dreams",
    //"candy pastelle",
    //"vegan pizza",
    //"caramel rain",
    //"morning in Tokyo",
    //"roll the dice",
    //"lucky number",
    //"motherly embrace",
    //"cheesy omelette",
    //"blood of my enemies",
    "minima",
    "cherry cherry lady",
    "cherry cherry lady",
    "cherry cherry lady",
    "babylon",
    "babylon",
    "babylon",
    "stolen dreams",
    "stolen dreams",
    "genocidal",
    "genocidal",
    "genocidal",
    "vacuum",
    "vacuum",
    "six pack",
    "six pack",
    "black tea",
    "black tea",
    "beer goggles",
    "beer goggles",
    "beer goggles",
    //"noir v2",
    //"golden boy",
    //"all red",
];

palettes = [
    memorieslostHEX,
    memorieslostHEX,
    youvebeenaughtyHEX,
    hidingunderthetableHEX,
    candyflushHEX,
    boilingwaterHEX,
    easytigerHEX,
    priceonmyheadHEX,
    needafatherfigureHEX,
    familytiesHEX,
    chihuahuaHEX,
    eyesontheprizeHEX,
    theshitsyfoxHEX,
    neondreamsHEX,
    neondreamsHEX,
    neondreamsHEX,
    neondreamsHEX,
    //candypastelleHEX,
    //veganpizzaHEX,
    //caramelrainHEX,
    //morningintokyoHEX,
    //rollthediceHEX,
    //luckynumberHEX,
    //motherlyembraceHEX,
    //cheesyomeletteHEX,
    //bloodofmyenemiesHEX,
    minimaHEX,
    cherrycherryladyHEX,
    cherrycherryladyHEX,
    cherrycherryladyHEX,
    babylonHEX,
    babylonHEX,
    babylonHEX,
    stolendreamsHEX,
    stolendreamsHEX,
    genocidalHEX,
    genocidalHEX,
    genocidalHEX,
    vacuum,
    vacuum,
    sixpack,
    sixpack,
    blacktea,
    blacktea,
    beergoggles,
    beergoggles,
    beergoggles,
    //noir2HEX,
    //goldenboyHEX,
    //allredsHEX,
];

/*******************************************************************************************************************/