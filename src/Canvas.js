import { useEffect } from 'react';
import './Canvas.css';

function Canvas(props) {
  const { canvasRef, image, params } = props;

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

  const drawLine = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  useEffect(() => {
    const size = params.size;
    const canvas = canvasRef.current;
    if (image) {
      const offscreen = new OffscreenCanvas(size.width, size.height);
      let ctx = offscreen.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size.width, size.height);
      ctx.translate(size.width / 2, size.height / 2);
      ctx.translate(params.offset.x, params.offset.y);
      ctx.rotate(params.rotate);
      ctx.scale(params.zoom, params.zoom);
      ctx.translate(params.position.x, params.position.y);
      ctx.drawImage(image, -size.width / 2, -size.height / 2);
      const data = ctx.getImageData(0, 0, size.width, size.height);
      bright(data.data, params.bright);
      contrast(data.data, params.contrast);

      ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, size.width, size.height);
      ctx.putImageData(data, 0, 0);

      if (params.hint) {
        ctx.strokeStyle = '#006060a0';
        ctx.setLineDash([5, 5]);
        const y1 = size.height / 8;
        drawLine(ctx, 0, y1, size.width, y1);
        const y2 = y1 + size.height * 2 / 3;
        drawLine(ctx, 0, y2, size.width, y2);
        let x = size.width / 2;
        drawLine(ctx, x, y1, x, y2);
      }
    } else {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, size.width, size.height);
      const text = '點擊此處載入圖檔';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.font = '28px sans-serif';
      ctx.fillText(text, size.width / 2, size.height / 2);
    }
  }, [canvasRef, image, params]);

  return (
    <canvas ref={canvasRef} width={params.size.width} height={params.size.height} />
  );
}

export default Canvas;
