class Canvas{
    constructor(canvas_id){
        this.canvas_doc = document.getElementById(canvas_id);
        this.canvas_obj = $(`#${canvas_id}`);
        this.ctx = this.canvas_doc.getContext('2d');
        this.w = this.h = 0;

        this.bg_color = 'white';
        this.lastRenderTime = new Date().getTime();
        
        this.resize();
        $(window).resize(this.resize);
        this.canvas_doc.addEventListener('mousemove', (e) => {
            let canvasRect = this.canvas_doc.getBoundingClientRect();

            mousePos = {
                x: e.clientX - canvasRect.left,
                y: e.clientY - canvasRect.top
            }
        });
    }

    init = (bg_color) => {
        this.bg_color = bg_color;
    }

    resize = () => {
        this.w = this.canvas_doc.width = this.canvas_obj.width();
        this.h = this.canvas_doc.height = this.canvas_obj.height();
    }

    clear = () => {
        this.ctx.fillStyle = this.bg_color;
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    render = (func) => {
        setInterval(() => {
            this.clear();
            func(this.ctx, this);

            let curTime = new Date().getTime();
            renderPeriod = curTime - this.lastRenderTime;
            this.lastRenderTime = curTime;
        }, parseInt(1000/FPS));
    }
}