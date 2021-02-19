const load_btn = document.createElement('input');
load_btn.type = 'file';
load_btn.accept = ".png,.jpg,.jpeg";
document.body.appendChild(load_btn);

const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
document.body.appendChild(canvas);


load_btn.onchange = e => {
  const file = e.target.files[0];
  
  let reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onload = e => {
    const base_image = new Image();
    base_image.src = reader.result;
    base_image.onload = () => {
      canvas.width = base_image.width;
      canvas.height = base_image.height;
      context.drawImage(base_image, 0, 0);
    }

  }

  canvas.onclick = () => {
    const cutted = context.getImageData(7, 7, canvas.width - 7, canvas.height - 7);
    canvas.width = canvas.width - 14;
    canvas.height = canvas.height - 14;
    context.putImageData(cutted, 0, 0);
    let x = 0, y = 0, size = 16;
    const interval = setInterval(() => {
      if (y >= canvas.height) {
        clearInterval(interval); return;
      }
      if (x >= canvas.width) { x = 0; y += size; }
      context.rect(x, y, size, size);
      context.fill();
      x += size;
    }, 100);
  }
}