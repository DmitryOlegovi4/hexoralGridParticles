(()=>{
    let requestId;
    let btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
        btn.addEventListener('click', changeCfg)
    });
    function changeCfg(event){
        btns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        if(event.target.classList.contains('triangle')){
            cfg.dirsCount = 3;
            cfg.stepsToTurn = 30;
            cfg.distance = 300;
            cancelAnimationFrame(requestId)
            dotsList.length = 0;
            dirsList.length = 0;
            createDirs();
            loop();
        }else if(event.target.classList.contains('hexagon')){
            cfg.dirsCount = 6;
            cfg.stepsToTurn = 15;
            cfg.distance = 300;
            cancelAnimationFrame(requestId)
            dotsList.length = 0;
            dirsList.length = 0;
            createDirs();
            loop();
        }else if(event.target.classList.contains('random')){
            cfg.dirsCount = 25;
            cfg.stepsToTurn = 50;
            cfg.distance = 150;
            cancelAnimationFrame(requestId)
            dotsList.length = 0;
            dirsList.length = 0;
            createDirs();
            loop();
        }
    }

    const cvs = document.getElementById('cvs');
    const ctx = cvs.getContext('2d');
    let cw, ch, cx, cy;
    function resizeCanvas(){
        cw = cvs.width = innerWidth;
        ch = cvs.height = innerHeight;
        cx = cw / 2;
        cy = ch / 2;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const cfg = {
        hue: 0,
        bgFillColor: "rgba(50,50,50,.05)",
        dirsCount: 6,
        stepsToTurn: 15,
        dotSize: 3,
        dotsCount: 300,
        dotSpeed: 2,
        distance: 300,
        gradientLen: 5,
        gridAngle: 0,
    }

    function drawRect(color, x, y, w, h, shadowColor, shadowBlur){
        ctx.shadowColor = shadowColor || 'black';
        ctx.shadowBlur = shadowBlur || 1;
        ctx.fillStyle = color;
        ctx.fillRect(x,y,w,h);
    }

    class Dot {
        constructor(x,y) {
            this.pos = {x,y};
            this.dir = cfg.dirsCount === 6 ?
                (Math.random() * 3 | 0) * 2 :
                Math.random() * cfg.dirsCount | 0;
            this.step = 0;
        }
        drawDot(){
            let xy = Math.abs(this.pos.x - cx) + Math.abs(this.pos.y - cy);
            let modHue = (cfg.hue + xy / cfg.gradientLen) % 360;
            let color = `hsl(${modHue}, 100%, 50%)`;
            let blur = cfg.dotSize - Math.sin(xy / 5) * 2;
            let size = cfg.dotSize - Math.sin(xy / 9) * 2 ;
            let x = this.pos.x - size / 2;
            let y = this.pos.y - size / 2;
            drawRect(color, x, y, size, size, color, blur);
        }
        moveDot(){
            this.step++;
            this.pos.x += dirsList[this.dir].x * cfg.dotSpeed;
            this.pos.y += dirsList[this.dir].y * cfg.dotSpeed;
        }
        changeDir(){
            if(this.step % cfg.stepsToTurn === 0){
                this.dir = Math.random() > .5 ?
                    (this.dir + 1) % cfg.dirsCount :
                    (this.dir + cfg.dirsCount - 1) % cfg.dirsCount ;
            }
        }
        deleteDot(i){
            let percent = Math.random() * Math.exp(this.step / cfg.distance);
            if(percent > 100){
                dotsList.splice(i,1);
            }
        }
    }

    let dirsList = [];
    function createDirs(){
        for(let i = 0; i < 360; i += 360 / cfg.dirsCount){
            let angle = cfg.gridAngle + i;
            let x = Math.cos(angle * Math.PI / 180);
            let y = Math.sin(angle * Math.PI / 180);
            dirsList.push({x, y});
        }
    }
    createDirs();

    let dotsList = [];
    function addDot(){
        if(dotsList.length < cfg.dotsCount && Math.random() > .85){
            dotsList.push(new Dot(cx,cy));
            cfg.hue = (cfg.hue + 1) % 360;
        }
    }
    function refreshDots(){
        dotsList.forEach((dot,i) => {
            dot.moveDot();
            dot.drawDot();
            dot.changeDir();
            dot.deleteDot(i);
        })
    }

    function loop(){
        drawRect(cfg.bgFillColor, 0, 0, cw, ch);
        addDot();
        if(dotsList.length){
            refreshDots();
        }
        requestId = requestAnimationFrame(loop);
    }
    loop();
})();