import { useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
import EditTool from './EditTool';
import OutputSelect from './OutputSelect';
import SizeSelect from './SizeSelect';
import { Button } from 'antd';
import './App.css';

const photoSizes = [
  {
    width: 331,
    height: 413,
    name: '1 吋證件照 (2.8 x 3.5 公分)'
  },
  {
    width: 413,
    height: 531,
    name: '2 吋大頭照 (3.5 x 4.5 公分)'
  },
  {
    width: 496,
    height: 555,
    name: '2 吋半身照 (4.2 x 4.7 公分)'
  },
  {
    width: 591,
    height: 591,
    name: '美國簽證 (5 x 5 公分)'
  },
  {
    width: 354,
    height: 472,
    name: '日本簽證 (3 x 4 公分)'
  }
];
const outputSizes = [
  {
    width: 0,
    height: 0,
    name: '單張圖檔'
  },
  {
    width: 1500,
    height: 900,
    name: '3 x 5 吋照片'
  },
  {
    width: 1800,
    height: 1200,
    name: '4 x 6 吋照片'
  }
];

function App() {
  const [sizeValue, setSizeValue] = useState(0);
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [bright, setBright] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [outputValue, setOutputValue] = useState(0);
  const [hint, setHint] = useState(true);
  const pointerRef = useRef({state: 0});
  const canvasRef = useRef();
  const editToolRef = useRef();

  const reset = () => {
    setPosition({x: 0, y: 0});
    setOffset({x: 0, y: 0});
    setHint(true);
    // reset EditTool.
    editToolRef.current.reset();
  };

  const onSizeChanged = (value) => {
    setSizeValue(parseInt(value));
    setHint(true);
  };

  const onZoomChanged = (value) => {
    setZoom(value);
    setHint(true);
  };

  const onRotateChanged = (value) => {
    setRotate(value);
    setHint(true);
  };

  const onSaveFile = () => {
    setHint(false);
  };

  const onPointerDown = (event) => {
    if (event.button !== 0 || event.target.tagName !== 'CANVAS')
      return;

    pointerRef.current = {
      state: 1,
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY,
    };
    setHint(true);
  };

  const onPointerMove = (event) => {
    if (pointerRef.current.state === 0)
      return;

    if (pointerRef.current.state === 1)
      pointerRef.current.state = 2;
    setOffset({
      x: event.nativeEvent.clientX - pointerRef.current.x,
      y: event.nativeEvent.clientY - pointerRef.current.y
    });
  };

  const onPointerUp = (event) => {
    const cos = Math.cos(rotate);
    const sin = Math.sin(rotate);
    setPosition({
      x: position.x + (offset.x * cos + offset.y * sin) / zoom,
      y: position.y + (-offset.x * sin + offset.y * cos) / zoom
    });
    setOffset({x: 0, y: 0});
  };

  const onClick = (event) => {
    if (pointerRef.current.state !== 2 && event.target.tagName === 'CANVAS') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event) => {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
          const image = document.createElement('img');
          image.src = reader.result;
          setImage(image);
        });
        reader.readAsDataURL(event.target.files[0]);
        reset();
      };
      input.click();
    }

    pointerRef.current.state = 0;
  };

  useEffect(() => {
    if (hint === false) {
      const photoSize = {width: photoSizes[sizeValue].width, height: photoSizes[sizeValue].height};
      const outputSize = {width: outputSizes[outputValue].width, height: outputSizes[outputValue].height};
      if (outputValue === 0) {
        outputSize.width = photoSize.width + 2;
        outputSize.height = photoSize.height + 2;
      }
      const numX = Math.floor(outputSize.width / (photoSize.width + 2));
      const numY = Math.floor(outputSize.height / (photoSize.height + 2));
      const dx = (outputSize.width - photoSize.width * numX) / (numX + 1);
      const dy = (outputSize.height - photoSize.height * numY) / (numY + 1);
      const offscreen = new OffscreenCanvas(outputSize.width, outputSize.height);
      const ctx = offscreen.getContext('2d');
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outputSize.width, outputSize.height);
      const dd = 5;
      for (let j = 0; j < numY; ++j)
        for (let i = 0; i < numX; ++i) {
          const x = (dx + photoSize.width) * i + dx;
          const y = (dy + photoSize.height) * j + dy;
          ctx.drawImage(canvasRef.current, x, y);
          if (numX > 1 || numY > 1) {
            ctx.beginPath();
            ctx.moveTo(x + dd, y - 1);
            ctx.lineTo(x - 1, y - 1);
            ctx.lineTo(x - 1, y + dd);
            ctx.moveTo(x + photoSize.width + 1 - dd, y - 1);
            ctx.lineTo(x + photoSize.width + 1, y - 1);
            ctx.lineTo(x + photoSize.width + 1, y + dd);
            ctx.moveTo(x - 1, y + photoSize.height + 1 - dd);
            ctx.lineTo(x - 1, y + photoSize.height + 1);
            ctx.lineTo(x + dd, y + photoSize.height + 1);
            ctx.moveTo(x + photoSize.width + 1, y + photoSize.height + 1 - dd);
            ctx.lineTo(x + photoSize.width + 1, y + photoSize.height + 1);
            ctx.lineTo(x + photoSize.width - dd, y + photoSize.height + 1);
            ctx.stroke();
          }
        }
      offscreen.convertToBlob({type: 'image/jpeg', quality: 0.95})
        .then((blob) => {
          const reader = new FileReader();
          reader.addEventListener('load', function() {
            const download = document.createElement('a');
            download.href = reader.result;
            download.download = 'photo.jpg';
            download.click();
          });
          reader.readAsDataURL(blob);
        });
      setHint(true);
    }
  }, [hint, sizeValue, outputValue]);

  return (
    <div className='container' onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onClick={onClick}>
      <div><SizeSelect options={photoSizes} value={sizeValue} onChange={onSizeChanged} /></div>
      <div><Canvas canvasRef={canvasRef} image={image} params={{hint, position, offset, size:photoSizes[sizeValue], zoom, rotate, bright, contrast}} /></div>
      <div><EditTool ref={editToolRef} onZoomChanged={onZoomChanged} onRotateChanged={onRotateChanged} onBrightChanged={setBright} onContrastChanged={setContrast} /></div>
      <div><OutputSelect options={outputSizes} value={outputValue} onChange={setOutputValue} /></div>
      <div className='marginTop'><Button type='primary' onClick={onSaveFile}>儲存檔案</Button></div>
    </div>
  );
}

export default App;
