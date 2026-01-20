import React, { useEffect, useRef } from 'react';

export const DynamicBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles: Particle[] = [];
        const particleCount = 80;
        const connectionDistance = 120;
        const mouseDistance = 180;

        let mouse = { x: -1000, y: -1000 };
        let time = 0;

        // Symbols to float around
        const symbols = ['₹', '%', '+', '▲', '⚡', '●'];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            symbol: string;
            alpha: number;
            targetAlpha: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.size = Math.floor(Math.random() * 12) + 8; // Font size
                this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.alpha = Math.random() * 0.5 + 0.1;
                this.targetAlpha = this.alpha;

                // Tech/Finance palette
                const colors = ['#00ff88', '#00d9ff', '#5E6AD2', '#ffffff'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Subtle oscillation
                this.targetAlpha = 0.3 + Math.sin(time * 0.02 + this.x) * 0.2;
                this.alpha += (this.targetAlpha - this.alpha) * 0.05;

                // Wrap around edges
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    // Repulse slightly
                    const force = (mouseDistance - distance) / mouseDistance;
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * force * 2;
                    this.y -= Math.sin(angle) * force * 2;

                    // Brighten near mouse
                    this.alpha = Math.min(this.alpha + 0.5, 1);
                }
            }

            draw() {
                if (!ctx) return;
                ctx.font = `${this.size}px monospace`;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.fillText(this.symbol, this.x, this.y);
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const drawBackground = () => {
            if (!ctx) return;
            // Create a dynamic gradient background
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            // Deep modern dark theme
            gradient.addColorStop(0, '#050a14'); // Almost black blue
            gradient.addColorStop(0.5, '#061021'); // Deep navy
            gradient.addColorStop(1, '#02050a'); // Black

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Add a subtle moving mesh grid
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.1;

            const gridSize = 100;
            const offset = (time * 0.5) % gridSize;

            ctx.beginPath();
            for (let x = -gridSize + offset; x < width; x += gridSize) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            for (let y = -gridSize + offset; y < height; y += gridSize) {
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();
        };

        const animate = () => {
            if (!ctx) return;
            time++;

            drawBackground();

            // Draw connections first (behind symbols)
            particles.forEach((p, index) => {
                // Connect to nearby particles
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = p.color; // Inherit color
                        ctx.globalAlpha = (1 - dist / connectionDistance) * 0.2; // Faint connections
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y - p.size / 3); // Align somewhat to center of text
                        ctx.lineTo(p2.x, p2.y - p2.size / 3);
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distMouse = Math.sqrt(dx * dx + dy * dy);
                if (distMouse < mouseDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#00ff88';
                    ctx.globalAlpha = (1 - distMouse / mouseDistance) * 0.4;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y - p.size / 3);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            });

            // Update and draw symbols
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
            }}
        />
    );
};
