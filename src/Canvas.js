import { useEffect, useRef } from 'react';
import './Canvas.css';

function Canvas(props) {
  const canvasRef = useRef();

  const bright = (data, b) => {
    if (b === 1)
      return;

    for (let i = 0; i < data.length; i += 4) {
      data[i] *= b;
      data[i + 1] *= b;
      data[i + 2] *= b;
    }
  };

  const contrast = (data, c) => {
    if (c === 1)
      return;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = (data[i] - 128) * c + 128;
      data[i + 1] = (data[i + 1] - 128) * c + 128;
      data[i + 2] = (data[i + 2] - 128) * c + 128;
    }
  };

  const background = (data, b) => {
    if (b === 0)
      return;
  };

  useEffect(() => {
    if (props.image) {
      const size = props.size;
      const offscreen = new OffscreenCanvas(size.width, size.height);
      let ctx = offscreen.getContext('2d');
      ctx.clearRect(0, 0, size.width, size.height);
      ctx.translate(size.width / 2, size.height / 2);
      ctx.translate(props.offset.x, props.offset.y);
      ctx.rotate(props.rotate);
      ctx.scale(props.zoom, props.zoom);
      ctx.translate(props.position.x, props.position.y);
      ctx.drawImage(props.image, -size.width / 2, -size.height / 2);
      const data = ctx.getImageData(0, 0, size.width, size.height);
      background(data.data, props.background);
      bright(data.data, props.bright);
      contrast(data.data, props.contrast);

      const canvas = canvasRef.current;
      ctx = canvas.getContext('2d');
      ctx.putImageData(data, 0, 0);
    }
  }, [props]);

  return (
    <canvas ref={canvasRef} width={props.size.width} height={props.size.height} />
  );
}

export default Canvas;
