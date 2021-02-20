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
document.body.style.display = 'flex';
document.body.style.flexDirection = 'column';
document.body.style.alignItems = 'flex-start';


const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
document.body.appendChild(canvas);

const trim_button = document.createElement('button');
trim_button.innerText = "trim";
trim_button.onclick = () => {
  const cutted = context.getImageData(7, 7, canvas.width - 7, canvas.height - 7);
  canvas.width = canvas.width - 14;
  canvas.height = canvas.height - 14;
  context.putImageData(cutted, 0, 0);
};
document.body.appendChild(trim_button);

const set_canvas = document.createElement('canvas'), set_context = set_canvas.getContext('2d');
document.body.appendChild(set_canvas);
const block = document.createElement('div');
block.style.display = 'flex';
block.style.fontSize = '10px';

const elements = ['O', '.', 'R', 'U', 'B', 'E', '+', ' ', 'X', 'D', '>', '<', '#', 'L', 'M', 'N', 'W', 'P', 'Y', 'C', '*', 'A', 'Z', '1','2','3','4','5','6','7','8','9','^','&','%'];

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

    let x = 0, y = 0, size = 16;
    while (y < canvas.height) {
      
      while (x < canvas.width - size) {
        const tile = context.getImageData(x, y, size, size);
        const transformed = getTransformedData(tile.data);
        const value = compare(transformed);
        result.push(value);
        context.rect(x, y, size, size);
        context.fill();
        x += size;
      }

      x = 0; y += size;
    }
      
    display(result);
  
  }



}

const getTransformedData = (tile) => {
  const data = Array.from(tile);
  // const chunked = data.chunk(4);
  // const transformed = chunked.map(pixel => parseInt(pixel.reduce((a, b) => a + b)/4));
  return data;
}

const compare = (data) => {
  const values = ideal_model.map((model) => {
    return model.map((el, i) => {
      return +(Math.abs(el - data[i]) < 10)
    }).reduce((a, b) => a + b)
  });
  const max_value = Math.max(...values);
  const index = values.indexOf(max_value);
 
  return elements[index];
}


const display = (result) => {
  const chunked = result.chunk(58);
  const transformed = chunked.map(row => row.join(" "));
  const itog = transformed.join("\r\n");
  const pre = document.createElement('pre');
  pre.innerText = itog;
  document.body.appendChild(pre);
}
