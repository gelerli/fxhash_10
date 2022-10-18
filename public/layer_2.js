function layer2(knvs,rnds = 30,radd = 1, inc = 24) {
    
    let increment = inc * unit;
    let x, y, xStart, yStart, xStop, yStop;
    let range = 120 * unit;
    knvs.stroke(10,133);
    knvs.strokeWeight(1 * unit);
    let kolor1, kolor2;
    let kolor2Idx = floor(random(palette.length));
    kolor2 = color(palette[kolor2Idx]);
    palette.splice(kolor2Idx,1);

    for (let i = grid.length -1; i >= 0; i--) {

        if (fVals[i] <= lowerLimit) {

            let idx1 = floor(noise(i * 2) * palette.length);
            if (idx1 >= palette.length) idx1 = idx1 -1
            kolor1 = color(palette[idx1]);
            
            /*
            let idx2 = floor(noise(i + 111) * palette.length);
            if (idx2 >= palette.length) idx2 = idx2 -1
            kolor2 = color(palette[idx2]);
            */

            xStart = grid[i][0];
            xStop = grid[i][0] + grid[i][2];
            yStart = grid[i][1] + 100 * unit;
            yStop = grid[i][1] + grid[i][3] + 100 * unit;
            
            for(y = yStop; y > yStart; y -= increment) {
                for(x = xStart; x < xStop; x += increment) {

                    let n1 =  range * n1Vals[knvs.floor(x + y * width) % n1Vals.length];
                    let n2 =  n2Vals[knvs.floor(x + y * width) % n2Vals.length];

                    let posX = x + n1;
                    let posY = y + n1;

                    let rds;
                    if (soft) {rds = radd * unit + knvs.abs(n1 * n2) * 0.44} else {rds = radd * unit + knvs.abs(n1 * n2)}
                    isoLeft(knvs, posX + 3 * unit, posY + (x- xStart) * tan(30),rnds * unit + 200 * knvs.abs(n2), 90, rds, kolor1, kolor2);

                }
            }

        }

    }
    /*
    knvs.blendMode(REMOVE);
    knvs.fill(249, 240, 204, 120);
    knvs.rect(0,0,knvs.width,knvs.height);
    */
}