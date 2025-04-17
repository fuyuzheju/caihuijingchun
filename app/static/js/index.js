class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.originX = x; // 爆炸原点
        this.originY = y;
        this.color = color;
        this.alpha = 1;
        
        // 三维速度向量
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8; // 初始向上速度
        
        // 物理参数
        this.gravity = 0.02;
        this.friction = 0.95;
        this.decay = 0.009;
    }

    update() {
        // 三维运动模拟
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;

        return this.alpha > 0;
    }
}

class FireworkSystem {
    constructor() {
        this.canvas = document.getElementById('fireworksCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.fireworks = [];
        this.particles = []; // 全局粒子池
        this.resize();
        this.init();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        window.addEventListener('resize', () => this.resize());
        
        // 调整发射频率（单位：毫秒）
        setInterval(() => {
            this.fireworks.push(new Firework(this.canvas.width));
        }, 1000);

        this.animate();
    }

    animate() {
        // 清空画布（使用渐变清除制造拖尾效果）
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width/2, 
            this.canvas.height/2, 
            0,
            this.canvas.width/2,
            this.canvas.height/2,
            Math.max(this.canvas.width, this.canvas.height)
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新烟花
        this.fireworks = this.fireworks.filter(firework => {
            if (firework.update()) {
                this.drawFirework(firework);
                return true;
            } else {
                this.createExplosion(firework);
                return false;
            }
        });

        // 更新粒子
        this.particles = this.particles.filter(p => {
            if (p.update()) {
                this.drawParticle(p);
                return true;
            }
            return false;
        });

        requestAnimationFrame(() => this.animate());
    }

    drawFirework(firework) {
        // 绘制上升轨迹
        this.ctx.beginPath();
        this.ctx.strokeStyle = firework.color;
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(firework.startX, this.canvas.height);
        this.ctx.lineTo(firework.x, firework.y);
        this.ctx.stroke();

        // 绘制弹头
        this.ctx.beginPath();
        this.ctx.fillStyle = firework.color;
        this.ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    createExplosion(firework) {
        // 生成爆炸粒子
        for (let i = 0; i < 80; i++) {
            this.particles.push(new Particle(
                firework.x,
                firework.y,
                firework.color
            ));
        }

        // 添加冲击波效果
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(firework.x, firework.y, 30, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawParticle(p) {
        // 带光晕效果的粒子绘制
        this.ctx.save();
        
        // 主粒子
        this.ctx.beginPath();
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha * 0.8;
        this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        this.ctx.fill();

        // 光晕效果
        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        this.ctx.globalAlpha = p.alpha * 0.3;
        this.ctx.arc(p.x, p.y, 4 * p.alpha, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }
}

class Firework {
    constructor(canvasWidth) {
        this.startX = canvasWidth * Math.random();
        this.x = this.startX;
        this.y = canvasWidth;
        this.targetY = canvasWidth * 0.3 * Math.random();
        this.speed = 4 + Math.random() * 2;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    update() {
        this.y -= this.speed;
        return this.y > this.targetY;
    }
}

// 初始化系统
new FireworkSystem();