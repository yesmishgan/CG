let canv = document.getElementById("lab08")
    let ctx = canv.getContext('2d')
    canv.width = window.innerWidth
    canv.height = window.innerHeight

    ctx.strokeRect(0,0,canv.width,canv.height)

    let x_shift = canv.width / 2
    let y_shift = canv.height / 2
    let object_scale = 7
    let surfs = []
    let vert = []

    function draw_line(x0, y0, x1, y1) {
        let dy = Math.abs(y1 - y0);
        let dx = Math.abs(x1 - x0);
        let dmax = Math.max(dx, dy);
        let dmin = Math.min(dx, dy);
        let xdir = 1;
        if (x1 < x0)
            xdir = -1;
        let ydir = 1;
        if (y1 < y0)
            ydir = -1;
        let eps = 0;
        let s = 1;
        let k = 2 * dmin;
        if (dy <= dx) {
            let y = y0;
            for (let x = x0; x * xdir <= x1 * xdir; x += xdir) {
                ctx.fillRect(x * s, y * s, 2 * s, 2 * s);
                eps = eps + k;
                if (eps > dmax) {
                    y += ydir;
                    eps = eps - 2 * dmax;
                }
            }
        } else {
            let x = x0;
            for (let y = y0; y * ydir <= y1 * ydir; y += ydir) {
                ctx.fillRect(x * s, y * s, 2 * s, 2 * s);
                eps = eps + k;
                if (eps > dmax) {
                    x += xdir;
                    eps = eps - 2 * dmax;
                }
            }
        }
    }

    function draw_figure() {
        ctx.fillStyle = "black"
        surfs.forEach(surf => {
            for(let i = 0; i < surf.length; i++) {
                let line_start = vert[surf[i]-1]
                let end_of_line = 0
                if (i == surf.length - 1){
                    end_of_line = vert[surf[0]-1]
                }else{
                    end_of_line = vert[surf[i+1]-1]
                }
                if (line_start == undefined || end_of_line == undefined) {
                    continue
                }

                let x0 = object_scale * line_start[0] + x_shift
                let y0 = y_shift - object_scale * line_start[1]
                let x1 = object_scale * end_of_line[0] + x_shift
                let y1 = y_shift - object_scale * end_of_line[1]

                draw_line(x0, y0, x1, y1);
            }
        })
    }

    const input = document.querySelector('input[type="file"]')
    input.addEventListener('change', function (e) {
        const reader = new FileReader()
        let size = Number(prompt('input height (0-100 for good vision)', "0"));
        reader.onload = function () {
            const lines = reader.result.split('\n')

            for(let i = 0; i < lines.length; i++) {
                let params = lines[i].split(/\s+/);

                if(params[0] == "f") {
                    let list = []
                    for(let j = 1; j < params.length; j++) {
                        list.push(parseInt(params[j]))
                    }
                    surfs.push(list)
                }

                if(params[0] == "v") {
                    vert.push([parseFloat(params[1]) * size, parseFloat(params[2]) * size, parseFloat(params[3]) * size])
                }
            }
            
            draw_figure()
            surfs = []
            vert = []
        }
        reader.readAsText(input.files[0])
    }, false)