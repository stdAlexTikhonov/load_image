Object.defineProperty(Array.prototype, 'chunk', {
  value: function(chunkSize) {
    var R = [];
    for (var i = 0; i < this.length; i += chunkSize)
      R.push(this.slice(i, i + chunkSize));
    return R;
  }
});

const load_btn = document.createElement('input');
load_btn.type = 'file';
load_btn.accept = ".png,.jpg,.jpeg";
document.body.appendChild(load_btn);

const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
document.body.appendChild(canvas);


load_btn.onchange = e => {
  const result = [];
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
      const tile = context.getImageData(x, y, size, size);
      const transformed = getTransformedData(tile.data);
      result.push(transformed.join(','));
      context.rect(x, y, size, size);
      context.fill();
      x += size;
    }, 10);
  }



}

  const getTransformedData = (tile) => {
    const data = Array.from(tile);
    const chunked = data.chunk(4);
    const transformed = chunked.map(pixel => parseInt(pixel.reduce((a, b) => a + b)/4));
    return transformed;
  }