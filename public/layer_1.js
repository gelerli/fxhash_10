function layer1(knvs,rnds = 30,radd = 1, inc = 24) {

    let increment = inc * unit;
    let x, y, xStart, yStart, xStop, yStop;
    let range = 120 * unit;
    let kolor1, kolor2;
    if (plasma) {
        let kolor1Idx = floor(random(palette.length));
        kolor1 = color(palette[kolor1Idx]);
        palette.splice(kolor1Idx,1);
    }

    for (let i = 0; i < grid.length; i ++) {

        xStart = grid[i][0];
        xStop = grid[i][0] + grid[i][2];
        yStart = grid[i][1] + 100 * unit;
        yStop = grid[i][1] + grid[i][3] + 100 * unit;

        if (fVals[i] <= lowerLimit || fVals[i] >= upperLimit) {

            knvs.stroke(10);
            knvs.strokeWeight(0.5 * unit);

            for(y = yStart; y < yStop; y += increment) {
                for(x = xStart; x < xStop; x += increment) {

                    let n1 =  range * n1Vals[knvs.floor(x + y * width) % n1Vals.length];
                    let n2 =  n2Vals[knvs.floor(x + y * width) % n2Vals.length];

                    let posX = x + n1;
                    let posY = y + n1;

                    let kol = color(random(palette));

                    //isoTop(knvs, posX, posY, rounds, ang, rad)                                                // LEGEND
                    isoTop(knvs, posX, posY, 1, 10, 5 * unit, kol);
                }
            }

        } else if (fVals[i] > lowerLimit && fVals[i] < upperLimit ){

            knvs.stroke(10);
            knvs.strokeWeight(0.5 * unit);
            
            if (!plasma) {
                let idx1 = floor(noise(i * 2) * palette.length);
                if (idx1 >= palette.length) idx1 = idx1 -1
                kolor1 = color(palette[idx1]);
            }

            let idx2 = floor(noise(i + 111) * palette.length);
            if (idx2 >= palette.length) idx2 = idx2 -1
            kolor2 = color(palette[idx2]);
                   
            for(y = yStart; y < yStop; y += increment) {
                for(x = xStart; x < xStop; x += increment) {

                    let n1 =  range * n1Vals[knvs.floor(x + y * width) % n1Vals.length];
                    let n2 =  n2Vals[knvs.floor(x + y * width) % n2Vals.length];

                    let posX = x + n1;
                    let posY = y + n1;

                    //isoTop(knvs, posX, posY, rounds, ang, rad, kol1, kol2)                                                // LEGEND
                    isoTop(knvs, posX, posY, rnds * unit + 150 * knvs.abs(n2), 90, radd * unit + knvs.abs(n1 * n2) * 0.77, kolor1, kolor2);

                }
            }

        } 

    }

    knvs.blendMode(REMOVE);
    knvs.fill(249, 240, 204, 60);
    knvs.rect(0,0,knvs.width,knvs.height);
      
}