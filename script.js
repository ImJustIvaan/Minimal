(() => {
  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, "0");

  // Live clock (digital + analog)
  function tick() {
    const d = new Date();
    const t = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    $("time").textContent = t;
    $("time2").textContent = t;
    $("date").textContent = d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    const s = d.getSeconds(), m = d.getMinutes() + s / 60, h = (d.getHours() % 12) + m / 60;
    $("ss").style.transform = `rotate(${s * 6}deg)`;
    $("mm").style.transform = `rotate(${m * 6}deg)`;
    $("hh").style.transform = `rotate(${h * 30}deg)`;
  }
  tick();
  setInterval(tick, 1000);
  $("yr").textContent = new Date().getFullYear();

  // Pointer-following glass sheen
  document.querySelectorAll(".glass").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // Subtle 3D tilt on cards (fine pointers only)
  if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
    document.querySelectorAll(".tilt:not(.clock-card)").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  // Scroll reveal
  const items = document.querySelectorAll(".card, .spotlight, .connect, .section > h2, .sub");
  items.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }),
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
})();
