const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const frameCount = 208;

// Handle high-DPI screens
const dpi = window.devicePixelRatio || 1;
canvas.width = window.innerWidth * dpi;
canvas.height = window.innerHeight * dpi;
ctx.scale(dpi, dpi);

// Image path
function currentFrame(index) {
  return `image/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;
}

const images = [];
let loadedImages = 0;
let currentFrameIndex = 0;

// Preload images safely
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  img.onload = () => {
    loadedImages++;
    if (loadedImages === 1) {
      drawImage(img); // draw first image ASAP
    }
  };
  images.push(img);
}

// Draw image
function drawImage(img) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scale = Math.max(
    window.innerWidth / img.width,
    window.innerHeight / img.height
  );

  const x = (window.innerWidth - img.width * scale) / 2;
  const y = (window.innerHeight - img.height * scale) / 2;

  ctx.drawImage(
    img,
    x,
    y,
    img.width * scale,
    img.height * scale
  );
}

// Scroll animation
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  const scrollFraction = scrollTop / maxScroll;

  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  if (frameIndex !== currentFrameIndex && images[frameIndex]) {
    currentFrameIndex = frameIndex;
    requestAnimationFrame(() =>
      drawImage(images[currentFrameIndex])
    );
  }
});

// Resize fix
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth * dpi;
  canvas.height = window.innerHeight * dpi;
  ctx.scale(dpi, dpi);
  drawImage(images[currentFrameIndex]);
});