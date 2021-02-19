import original from "./original_set.png";

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

const set_canvas = document.createElement('canvas'), set_context = set_canvas.getContext('2d');
document.body.appendChild(set_canvas);
const block = document.createElement('div');
block.style.display = 'flex';
block.style.fontSize = '10px';

const elements = ['O', '.', 'R1', 'R2', 'B', 'E', '+', ' ', 'X', 'D1', '>', '<', '#', 'L1', 'L2', 'L3', 'W', 'P1', 'D2', 'PC', '*', 'A', 'EL'];

elements.forEach((_) => {
  const el = document.createElement('div');
  el.style.width = '16px';
  el.style.display = 'flex';
  const inner = document.createElement('div');
  inner.textContent = _;
  inner.style.margin = 'auto';
  el.appendChild(inner);
  block.appendChild(el);
});

document.body.appendChild(block);



const image_set = new Image();
image_set.src = original;
let ideal_model = [];

image_set.onload = () => {
  set_canvas.width = image_set.width;
  set_canvas.height = image_set.height;
  set_context.drawImage(image_set, 0, 0);
  ideal_model = elements.map((_, i) => {
    const tile = set_context.getImageData(i * 16, 0, 16, 16);
    const transformed = getTransformedData(tile.data);
    return transformed;
  })
}


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
      if (x >= (canvas.width - size)) { x = 0; y += size; }
      const tile = context.getImageData(x, y, size, size);
      const transformed = getTransformedData(tile.data);
      result.push(transformed);
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

