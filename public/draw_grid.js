function drawGrid(knvs) {

    for (let i = 0; i < grid.length; i ++) {

        
        let idx = floor(noise(i * 2) * palette.length);
        if (idx >= palette.length) idx = idx -1

        let kolor1 = color(palette[idx]);
        kolor1.setAlpha(70);
        knvs.fill(kolor1);

        //knvs.noFill();
        knvs.noStroke();
        
        /*
        let p1 = [grid[i][0], grid[i][1]];
        let p2 = [grid[i][0] + grid[i][2], grid[i][1]];
        let p3 = [grid[i][0] + grid[i][2], grid[i][1] + grid[i][3]];
        let p4 = [grid[i][0], grid[i][1] + grid[i][3]];
        */

        let increment = 2 * unit;
        let x, y, xStart, yStart, xStop, yStop;
        let range = 120 * unit;
        
        
        knvs.beginShape();

        //first loop - from point 1 to point 2
        xStart = grid[i][0];
        xStop = grid[i][0] + grid[i][2];
        yStart = grid[i][1] + 100 * unit;
        yStop = grid[i][1] + 100 * unit;

        for (x = xStart; x < xStop; x += increment ) {
            y = grid[i][1] + 100 * unit;

            let n1 =  range * n1Vals[knvs.floor(x + y * width) % n1Vals.length];
            let n2 =  n2Vals[knvs.floor(x + y * width) % n2Vals.length];

            let xN = x + n1;
            let yN = y + n1;

            knvs.vertex(xN,yN);
        }

        //second loop - from point 2 to point 3
        xStart = grid[i][0] + grid[i][2];
        xStop = grid[i][0] + grid[i][2];
        yStart = grid[i][1] + 100 * unit;
        yStop = grid[i][1] + grid[i][3] + 100 * unit;

        for (y = yStart; y < yStop; y += increment) {
            x = grid[i][0] + grid[i][2];

            let n1 =  range * n1Vals[knvs.floor(x + y * width) % n1Vals.length];
            let n2 =  n2Vals[knvs.floor(x + y * width) % n2Vals.length];

            let xN = x + n1;
            let yN = y + n1;

            knvs.vertex(xN,yN);
        }
        
        //third loop - from point 3 to point 4
        xStart = grid[i][0] + grid[i][2];
        xStop = grid[i][0];
        yStart = grid[i][1] + grid[i][3] + 100 * unit;
        yStop = grid[i][1] + grid[i][3] + 100 * unit;

        for (x = xStart; x > xStop; x -= increment ) {
            y = grid[i][1] + grid[i][3] + 100 * unit;

            let n1 =  range * n1Vals[knvs.floor(x + y * width) % n1Vals.length];
            let n2 =  n2Vals[knvs.floor(x + y * width) % n2Vals.length];

            let xN = x + n1;
            let yN = y + n1;

            knvs.vertex(xN,yN);
        }

        //fourth loop - from point 4 to point 1
        xStart = grid[i][0];
        xStop = grid[i][0];
        yStart = grid[i][1] + grid[i][3] + 100 * unit;
        yStop = grid[i][1] + 100 * unit;

        for (y = yStart; y > yStop; y -= increment) {
            x = grid[i][0];

            let n1 =  range * n1Vals[knvs.floor(x + y * width) % n1Vals.length];
            let n2 =  n2Vals[knvs.floor(x + y * width) % n2Vals.length];

            let xN = x + n1;
            let yN = y + n1;

            knvs.vertex(xN,yN);
        }

        knvs.endShape(CLOSE);


    }

}

/*******************************************************************************************************************/