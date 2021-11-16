
        function drawLine(ctx, x0, y0, x1, y1) {
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
                    ctx.fillRect(x*s, y*s, 1*s, 1*s);
                    eps = eps+k;
                    if (eps>dmax) {
                        y+=ydir;
                        eps = eps - 2*dmax;
                    }	
                } 
            } else {
                var x = x0;
                for (var y=y0; y*ydir<=y1*ydir; y+=ydir) {
                    ctx.fillRect(x*s, y*s, 1*s, 1*s);
                    eps = eps+k;
                    if (eps>dmax) {
                        x+=xdir;
                        eps = eps - 2*dmax;
                    }	
                } 
            }		
        }
        
        function distance(P0, P1, P2){
            var k = (P2[1] - P0[1])/(P2[0] - P0[0]);
            console.log('Coef', k);
            var b = -1*k*P0[0] + P0[1];
            d = Math.abs(-k*P1[0] + P1[1] -1*b)/Math.sqrt(k*k + 1);
            console.log('Distance ',d);
            return d
        }

        function Beze(P0, P1, P2){
            if(distance(P0, P1, P2) > 1){
                P0_ = []; // x0' y0'
                P0_[0] = 0.5*P0[0] + 0.5*P1[0];
                P0_[1] = 0.5*P0[1] + 0.5*P1[1];
                
                P1_ = []; // x1' y1'
                P1_[0] = 0.5*P1[0] + 0.5*P2[0];
                P1_[1] = 0.5*P1[1] + 0.5*P2[1];

                P0__ = []; // x0" y0"
                P0__[0] = 0.5*P0_[0] + 0.5*P1_[0];
                P0__[1] = 0.5*P0_[1] + 0.5*P1_[1];
                drawLine(ctx, P0_[0], P0_[1], P1_[0], P1_[1]);
                Beze(P0, P0_, P0__);
                 
            }else{
                drawLine(ctx, P0_[0], P0_[1], P1_[0], P1_[1]);
            }
        }

        function Beze2(P0, P1, P2){
            if(distance(P0, P1, P2) > 1){
                P0_ = []; // x0' y0'
                P0_[0] = 0.5*P0[0] + 0.5*P1[0];
                P0_[1] = 0.5*P0[1] + 0.5*P1[1];
                
                P1_ = []; // x1' y1'
                P1_[0] = 0.5*P1[0] + 0.5*P2[0];
                P1_[1] = 0.5*P1[1] + 0.5*P2[1];

                P0__ = []; // x0" y0"
                P0__[0] = 0.5*P0_[0] + 0.5*P1_[0];
                P0__[1] = 0.5*P0_[1] + 0.5*P1_[1];
                drawLine(ctx, P0_[0], P0_[1], P1_[0], P1_[1]);
                Beze2(P0__, P1_, P2);
                 
            }else{
                drawLine(ctx, P0_[0], P0_[1], P1_[0], P1_[1]);
            }
        }

        var canvas = document.getElementById("canv");
        var ctx = canvas.getContext("2d");
    
        var state = 0;
        var points = [];
        var counter = 0;

    
        canvas.addEventListener("click", function(event){
                if (state == 0) {
                    points[counter] = [event.offsetX, event.offsetY];
                    state = 1;

                } else if (state == 1) {
                    points[counter] = [event.offsetX, event.offsetY];
                    drawLine(ctx, points[0][0], points[0][1], points[1][0], points[1][1]);
                    state = 2;

                } else if (state == 2) {
                    points[counter] = [event.offsetX, event.offsetY];
                    drawLine(ctx, points[1][0], points[1][1], points[2][0], points[2][1]);
                    state = -1;

                }else if(state == -1){
                    P0 = points[0];
                    P1 = points[1];
                    P2 = points[2];
                    state = -2;

                    Beze(P0, P1, P2);
                    Beze2(P0, P1, P2);
                }else if(state == -2){
                    points = [];
                    state = 0;
                    counter = -1;
                }
                console.log(state);
                console.log(points);
                console.log(counter);
                counter += 1;
    
        });
