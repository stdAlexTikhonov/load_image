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
}