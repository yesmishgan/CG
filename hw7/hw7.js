function distance(P0, P1, P2) {
    var k = (P2.y-P0.y)/(P2.x-P0.x);
    var n = {x:-k, y:1};
    var b = P0.y-k*P0.x;
    var d = Math.abs(n.x*P1.x+P1.y-b)/Math.sqrt(k*k+1); 
    return d;
}

function bezie(p0, p1, p2){
    if (distance(p0, p1, p2) > 1) {
        var p0_1 = [];
        p0_1[0] = 0.5*p0[0] + 0.5*p1[0];
        p0_1[1] = 0.5*p0[1] + 0.5*p1[1];

        var p1_1 = [];
        p1_1[0] = 0.5*p1[0] + 0.5*p2[0];
        p1_1[1] = 0.5*p1[1] + 0.5*p2[1];

        var p0_2 = [];
        p0_2[0] = 0.5*p0_1[0] + 0.5*p1_1[0];
        p0_2[1] = 0.5*p0_1[1] + 0.5*p1_1[1];
        bezie(p0, p0_1, p0_2);
        bezie(p0_2, p1_1, p2);
    } else {
        Line(ctx, p0[0], p0[1], p2[0], p2[1]);
    }
}

function Line(ctx, x0, y0, x1, y1) {
    var dy = Math.abs(y1-y0);
    var dx = Math.abs(x1-x0);
    var dmax = Math.max(dx, dy);
    var dmin = Math.min(dx, dy);
    var xdir = 1;
    if (x1<x0) xdir = -1;
    var ydir = 1;
    if (y1<y0) ydir = -1;
    var eps = 0;
    var s = 1;
    var k=2*dmin;
    if (dy<=dx) {
        var y = y0;
        for (var x=x0; x*xdir<=x1*xdir; x+=xdir) {
            ctx.fillRect(x*s, y*s, s, s);
            eps = eps+k;
            if (eps>dmax) {
                y+=ydir;
                eps = eps - 2*dmax;
            }
        }
    } else {
        var x = x0;
        for (var y=y0; y*ydir<=y1*ydir; y+=ydir) {
            ctx.fillRect(x*s, y*s, s, s);
            eps = eps+k;
            if (eps>dmax) {
                x+=xdir;
                eps = eps - 2*dmax;
            }
        }
    }
}

function MV_mul(M, v) {
    var res = [];
    for (var i=0; i<4; i++) {
        var aij = 0;
        for (var j=0; j<4; j++) {
            aij += M[i*(4)+j]*v[j];
        }		
        res.push(aij);
    }
    return res;
}

var canvas = document.getElementById("lab7");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = '#D25755';
        canvas.setAttribute("tabindex", 0);
        let points = [[],[],[]];
        let counter = 0;
    
    
        canvas.addEventListener("click", function(event){
            if (counter < 3) {
                points[counter] = [event.offsetX, event.offsetY, 0];
                ctx.fillRect(event.offsetX, event.offsetY, 2, 2);
                counter++;
            }else if (counter >= 3){
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(points[counter % 3][0], points[counter % 3][1], 2, 2);
                ctx.fillStyle = '#D25755';
                points[counter % 3] = [event.offsetX, event.offsetY, 0];
                ctx.fillRect(event.offsetX, event.offsetY, 2, 2);
                counter++;
            }
        })
        var mode
        canvas.addEventListener('keydown', function(e){
            mode = e.key
            if (((mode === 'x') | (mode === 'y') | (mode === 'z'))){
                P0 = points[0];
                P1 = points[1];
                P2 = points[2];
                bezie(P0, P1, P2);
        
                var P0_ = [];
                var P2_ = [];
        
                P0_[0] = P0[0];
                P0_[1] = P0[1];
                P0_[2] = P0[2];
                P2_[0] = P2[0];
                P2_[1] = P2[1];
                P2_[2] = P2[2];
        
                for(var i = 0; i < 360; i += 10){
        
                    var alpha = i*Math.PI/180;
                    P0_[0] -= P1[0];
                    P0_[1] -= P1[1];
                    P0_[2] -= P1[2];
                    P2_[0] -= P1[0];
                    P2_[1] -= P1[1];
                    P2_[2] -= P1[2];
        
                    var M_x = [ 1, 0, 0, 0,
                        0, Math.cos(alpha), -1*Math.sin(alpha), 0,
                        0, Math.sin(alpha), Math.cos(alpha), 0,
                        0, 0, 0, 1];
        
                    var M_y = [ Math.sin(alpha), 0, Math.cos(alpha), 0,
                        0, 1, 0, 0,
                        Math.cos(alpha), 0, -1*Math.sin(alpha), 0,
                        0, 0, 0, 1];
        
                    var M_z = [ Math.cos(alpha), -1*Math.sin(alpha), 0, 0,
                        Math.sin(alpha), Math.cos(alpha), 0, 0,
                        0, 0, 0, 0,
                        0, 0, 0, 1];
        
                    if (mode === 'x'){
                        var out = MV_mul(M_x, [P0_[0], P0_[1], P0_[2], 1]);
                        P0_[0] = out[0] + P1[0];
                        P0_[1] = out[1] + P1[1];
                        out = MV_mul(M_x, [P2_[0], P2_[1], P2_[2], 1]);
                        P2_[0] = out[0] + P1[0];
                        P2_[1] = out[1] + P1[1];
                        bezie(P0_, P1, P2_);
        
                        P0_[0] = P0[0];
                        P0_[1] = P0[1];
                        P0_[2] = P0[2];
                        P2_[0] = P2[0];
                        P2_[1] = P2[1];
                        P2_[2] = P2[2];
        
                    }else if(mode === 'y'){
                        var out = MV_mul(M_y, [P0_[0], P0_[1], P0_[2], 1]);
                        P0_[0] = out[0] + P1[0];
                        P0_[1] = out[1] + P1[1];
                        out = MV_mul(M_y, [P2_[0], P2_[1], P2_[2], 1]);
                        P2_[0] = out[0] + P1[0];
                        P2_[1] = out[1] + P1[1];
                        bezie(P0_, P1, P2_);
        
                        P0_[0] = P0[0];
                        P0_[1] = P0[1];
                        P0_[2] = P0[2];
                        P2_[0] = P2[0];
                        P2_[1] = P2[1];
                        P2_[2] = P2[2];
        
                    }else if(mode === 'z'){
                        var out = MV_mul(M_z, [P0_[0], P0_[1], P0_[2], 1]);
                        P0_[0] = out[0] + P1[0];
                        P0_[1] = out[1] + P1[1];
                        out = MV_mul(M_z, [P2_[0], P2_[1], P2_[2], 1]);
                        P2_[0] = out[0] + P1[0];
                        P2_[1] = out[1] + P1[1];
                        bezie(P0_, P1, P2_);
        
                        P0_[0] = P0[0];
                        P0_[1] = P0[1];
                        P0_[2] = P0[2];
                        P2_[0] = P2[0];
                        P2_[1] = P2[1];
                        P2_[2] = P2[2];
        
                    }
        
                }
        
                counter = 0;
                points = [[],[],[]];
            } else if (mode === 'c') {
                for(var i = 0; i < points.length; i++){
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(points[i][0], points[i][1], 2, 2); 
                }
                ctx.fillStyle = '#D25755';
                counter = 0;
                points = [[],[],[]];
            } else if (mode === 'r') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                counter = 0;
                points = [[],[],[]];
            }
        })