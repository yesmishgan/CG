
        let canvas = document.getElementById("canv");
        let context = canvas.getContext("2d");
        let formula = {};

        function drawLine(context, x0, y0, x1, y1) {
            context.fillStyle = "#5a89a4";
            let x = x0;
            let y = y0;
            let epsilon = 0;
            let dx = x1 - x0;
            let dy = y1 - y0;
            let sign_x = Math.sign(dx);
            let sign_y = Math.sign(dy);
            if (Math.abs(dx) > Math.abs(dy)) {
                while (x != x1) {
                    epsilon += 2 * dy;
                    if (Math.abs(epsilon) >= Math.abs(dx)) {
                        y += sign_y;
                        epsilon -= 2 * sign_x * sign_y * dx;
                    }
                    context.fillRect(x, y, 1, 1);
                    x += sign_x;
                }
            } else {
                while (y != y1) {
                    epsilon += 2 * dx;
                    if (Math.abs(epsilon) >= Math.abs(dy)) {
                        epsilon -= 2 * sign_x * sign_y * dy;
                        x += sign_x;
                    }
                    context.fillRect(x, y, 1, 1);
                    y += sign_y;
                }
            }
        }
        formula.getPointOnCurve = function (shift, points) {
            if (points.length == 2) {
                return this.getPointOnLine(shift, points);
            }
            let pointsPP = [];
            for (var i = 1; i < points.length; i++) {
                pointsPP.push(this.getPointOnLine(shift, [points[i - 1], points[i]]));
            }
            return this.getPointOnCurve(shift, pointsPP);
        };
        formula.getPointOnLine = function (shift, points) {
            return [(points[1][0] - points[0][0]) * (shift / 100) + points[0][0],
            (points[1][1] - points[0][1]) * (shift / 100) + points[0][1]];
        };
        let state = 0;
        let shift = 0;
        let step = 1;
        let points = [[,], [,], [,]];
        canvas.addEventListener("click", function (event) {
            
            if (state === 0) {
                points[0][0] = event.offsetX
                points[0][1] = event.offsetY
                state = 1
            } else if (state === 1) {
                points[1][0] = event.offsetX
                points[1][1] = event.offsetY
                drawLine(context, points[0][0], points[0][1], points[1][0], points[1][1])
                state = 2
            } else if (state === 2) {
                points[2][0] = event.offsetX
                points[2][1] = event.offsetY
                drawLine(context, points[1][0], points[1][1], points[2][0], points[2][1])
                state = 3
            } else if (state === 3) {
                var timer = setInterval(function () {
                    context.moveTo(points[0][0], points[0][1]);
                    if (shift > 100) {
                        shift = 100;
                    }
                    for (var i = 0; i <= shift; i += step) {
                        var coord = formula.getPointOnCurve(i, points);
                        context.lineTo(coord[0], coord[1]);
                    }
                    context.stroke();
                    if (shift <= 100) {
                        shift += step;
                    }
                }, 25)
                state = 4
            } else if (state === 4){
                state = 5
            }
            if (state === 5){
                state = 0
                points = [[,], [,], [,]]
            }
            console.log(state);
            console.log(points);
            
        });
