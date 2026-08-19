export function initialiseHabitatCanvas({ world, setPaused, renderWorldSource }) {
      const canvas = document.querySelector("#habitat-canvas");
      const context = canvas?.getContext("2d");
      let width = 640;
      let height = 360;
      let pixelRatio = 1;
      let previousTime = performance.now();
      let batPhase = 0;

      const mothSeeds = [
        [0.12, 0.18, 0.8, 0.3], [0.18, 0.72, 0.4, -0.8], [0.27, 0.36, -0.5, 0.6],
        [0.34, 0.82, 0.7, -0.2], [0.42, 0.22, -0.4, 0.7], [0.49, 0.63, 0.6, 0.4],
        [0.56, 0.15, -0.7, 0.2], [0.62, 0.78, 0.3, -0.7], [0.70, 0.48, -0.4, -0.5],
        [0.78, 0.68, 0.5, 0.2], [0.84, 0.24, -0.6, 0.4], [0.91, 0.54, -0.3, -0.6]
      ];
      let moths = [];

      const resetMoths = () => {
        moths = mothSeeds.map(([x, y, vx, vy], index) => ({
          id: index,
          x: x * width,
          y: y * height,
          vx: vx * 18,
          vy: vy * 18,
          wing: index * 0.7
        }));
      };

      const resizeCanvas = () => {
        if (!canvas || !context) return;
        const rect = canvas.getBoundingClientRect();
        width = Math.max(320, rect.width);
        height = Math.max(240, rect.height);
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        resetMoths();
      };

      const cssColor = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

      const drawHabitat = (time) => {
        if (!context || !canvas) return;
        const delta = Math.min((time - previousTime) / 1000, 0.034);
        previousTime = time;
        const dt = world.paused ? 0 : delta * world.speed;
        batPhase += dt * 0.72;

        const ink = cssColor("--hara-v2-ink", "#eef1f4");
        const muted = cssColor("--hara-v2-muted", "#9aa4ad");
        const line = cssColor("--hara-v2-line", "rgba(255,255,255,.12)");
        const panel = cssColor("--hara-v2-panel-recess", "#090c10");
        const signal = cssColor("--hara-v2-signal", "#4d9cff");
        const warning = cssColor("--hara-v2-warning", "#f06a3c");

        context.clearRect(0, 0, width, height);
        context.fillStyle = panel;
        context.fillRect(0, 0, width, height);

        context.strokeStyle = line;
        context.lineWidth = 1;
        for (let x = 0; x < width; x += 48) {
          context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
        }
        for (let y = 0; y < height; y += 48) {
          context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
        }

        const lightX = width * 0.72;
        const lightY = height * 0.28;
        const lightRadius = 62 + world.light * 92;
        const glow = context.createRadialGradient(lightX, lightY, 2, lightX, lightY, lightRadius);
        glow.addColorStop(0, `rgba(255, 226, 146, ${0.54 * world.light})`);
        glow.addColorStop(0.24, `rgba(255, 201, 108, ${0.18 * world.light})`);
        glow.addColorStop(1, "rgba(255, 187, 90, 0)");
        context.fillStyle = glow;
        context.fillRect(lightX - lightRadius, lightY - lightRadius, lightRadius * 2, lightRadius * 2);
        context.fillStyle = "rgba(255, 226, 152, .94)";
        context.beginPath(); context.arc(lightX, lightY, 4.5, 0, Math.PI * 2); context.fill();
        context.strokeStyle = "rgba(255, 226, 152, .58)";
        context.beginPath(); context.arc(lightX, lightY, 11, 0, Math.PI * 2); context.stroke();

        const batX = width * (0.45 + Math.cos(batPhase) * 0.18);
        const batY = height * (0.48 + Math.sin(batPhase * 1.37) * 0.2);

        if (!world.paused) {
          moths.forEach((moth, index) => {
            const toLightX = lightX - moth.x;
            const toLightY = lightY - moth.y;
            const lightDistance = Math.max(1, Math.hypot(toLightX, toLightY));
            moth.vx += (toLightX / lightDistance) * world.light * 7.5 * dt;
            moth.vy += (toLightY / lightDistance) * world.light * 7.5 * dt;

            const fromBatX = moth.x - batX;
            const fromBatY = moth.y - batY;
            const batDistance = Math.max(1, Math.hypot(fromBatX, fromBatY));
            if (batDistance < world.fear) {
              const force = (1 - batDistance / world.fear) * 78;
              moth.vx += (fromBatX / batDistance) * force * dt;
              moth.vy += (fromBatY / batDistance) * force * dt;
            }

            moths.forEach((other, otherIndex) => {
              if (index === otherIndex) return;
              const dx = moth.x - other.x;
              const dy = moth.y - other.y;
              const distance = Math.max(1, Math.hypot(dx, dy));
              if (distance < world.separation) {
                const pressure = (1 - distance / world.separation) * 20;
                moth.vx += (dx / distance) * pressure * dt;
                moth.vy += (dy / distance) * pressure * dt;
              }
            });

            moth.vx += Math.sin(time * 0.0017 + index * 2.1) * 4 * dt;
            moth.vy += Math.cos(time * 0.0013 + index * 1.4) * 4 * dt;
            moth.vx *= Math.pow(0.982, dt * 60);
            moth.vy *= Math.pow(0.982, dt * 60);
            const speed = Math.max(1, Math.hypot(moth.vx, moth.vy));
            const maximum = 42;
            if (speed > maximum) {
              moth.vx = moth.vx / speed * maximum;
              moth.vy = moth.vy / speed * maximum;
            }
            moth.x += moth.vx * dt;
            moth.y += moth.vy * dt;
            moth.wing += dt * (8 + index * 0.08);
            if (moth.x < -12) moth.x = width + 12;
            if (moth.x > width + 12) moth.x = -12;
            if (moth.y < -12) moth.y = height + 12;
            if (moth.y > height + 12) moth.y = -12;
          });
        }

        moths.forEach((moth) => {
          const angle = Math.atan2(moth.vy, moth.vx);
          const wing = 2.6 + Math.abs(Math.sin(moth.wing)) * 2.2;
          context.save();
          context.translate(moth.x, moth.y);
          context.rotate(angle);
          context.fillStyle = ink;
          context.globalAlpha = 0.82;
          context.beginPath();
          context.ellipse(-1.5, -wing * 0.55, 3.6, wing, -0.42, 0, Math.PI * 2);
          context.ellipse(-1.5, wing * 0.55, 3.6, wing, 0.42, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = signal;
          context.globalAlpha = 0.9;
          context.fillRect(-2.2, -0.7, 5.4, 1.4);
          context.restore();
        });

        context.save();
        context.translate(batX, batY);
        context.rotate(Math.sin(batPhase * 2.2) * 0.16);
        context.fillStyle = warning;
        context.globalAlpha = 0.92;
        context.beginPath();
        context.moveTo(0, 0);
        context.bezierCurveTo(-12, -10, -23, -8, -30, 2);
        context.bezierCurveTo(-20, -2, -13, 8, 0, 5);
        context.bezierCurveTo(13, 8, 20, -2, 30, 2);
        context.bezierCurveTo(23, -8, 12, -10, 0, 0);
        context.fill();
        context.restore();

        context.font = "600 10px ui-monospace, monospace";
        context.fillStyle = muted;
        context.globalAlpha = 0.82;
        context.fillText(`fear radius / ${Math.round(world.fear)}`, 18, height - 18);
        context.strokeStyle = warning;
        context.globalAlpha = 0.18;
        context.setLineDash([4, 6]);
        context.beginPath(); context.arc(batX, batY, world.fear, 0, Math.PI * 2); context.stroke();
        context.setLineDash([]);
        context.globalAlpha = 1;

        window.requestAnimationFrame(drawHabitat);
      };

      if (canvas && context) {
        resizeCanvas();
        new ResizeObserver(resizeCanvas).observe(canvas);
        window.requestAnimationFrame(drawHabitat);
      }

      document.addEventListener("visibilitychange", () => {
        if (document.hidden && !world.paused) setPaused(true);
      });

      renderWorldSource();
}
