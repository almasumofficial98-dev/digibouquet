const canvas = document.getElementById("canvas");
const flowers = document.querySelectorAll(".draggable");

function init() {
    let z = 10;
    flowers.forEach(el => {
        if (!el.style.left) setRandom(el);
        makeDraggable(el, () => z++);
    });
    updateURL();
}

function setRandom(el) {
    const maxX = canvas.clientWidth - 80;
    const maxY = canvas.clientHeight - 80;
    el.style.left = Math.random() * maxX + "px";
    el.style.top = Math.random() * maxY + "px";
}

function updateURL() {
    const layout = [];
    flowers.forEach(el => {
        layout.push(
            `${el.dataset.id}:${Math.round(el.offsetLeft)}:${Math.round(el.offsetTop)}`
        );
    });
    const msg = new URLSearchParams(location.search).get("msg") || "";
    history.replaceState(null, "", `?msg=${encodeURIComponent(msg)}&layout=${layout.join(",")}`);
}

function makeDraggable(el, getZ) {
    let dragging = false, sx, sy, ix, iy;

    const start = e => {
        dragging = true;
        el.style.zIndex = getZ();
        const p = e.touches ? e.touches[0] : e;
        sx = p.clientX;
        sy = p.clientY;
        ix = el.offsetLeft;
        iy = el.offsetTop;
        e.preventDefault();
    };

    const move = e => {
        if (!dragging) return;
        const p = e.touches ? e.touches[0] : e;
        let x = ix + (p.clientX - sx);
        let y = iy + (p.clientY - sy);

        x = Math.max(0, Math.min(x, canvas.clientWidth - el.offsetWidth));
        y = Math.max(0, Math.min(y, canvas.clientHeight - el.offsetHeight));

        el.style.left = x + "px";
        el.style.top = y + "px";
        e.preventDefault();
    };

    const end = () => {
        if (dragging) {
            dragging = false;
            updateURL();
        }
    };

    el.addEventListener("mousedown", start);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);

    el.addEventListener("touchstart", start, { passive: false });
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", end);
}

function randomize() {
    flowers.forEach(setRandom);
    updateURL();
}

function share() {
    navigator.clipboard.writeText(location.href)
        .then(() => alert("Bouquet link copied!"));
}

init();