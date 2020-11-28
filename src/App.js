import { useEffect, useRef, useState } from 'react';
import SizeSelect from './SizeSelect';
import Canvas from './Canvas';
import EditTool from './EditTool';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

function App() {
  const [sizeValue, setSizeValue] = useState(0);
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [bright, setBright] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [background, setBackground] = useState(0);
  const [hint, setHint] = useState(true);
  const [mouseState, setMouseState] = useState(0);
  const [mouseDown, setMouseDown] = useState({});
  const canvasRef = useRef();

  const photoSizes = [
    {
      width: 331,
      height: 413,
      name: '1 吋證件照 (2.8 x 3.5)'
    },
    {
      width: 413,
      height: 531,
      name: '2 吋大頭照 (3.5 x 4.5)'
    },
    {
      width: 496,
      height: 555,
      name: '2 吋半身照 (4.2 x 4.7)'
    },
    {
      width: 591,
      height: 591,
      name: '美國簽證 (5 x 5)'
    },
    {
      width: 354,
      height: 472,
      name: '日本簽證 (3 x 4)'
    }
  ];

  const reset = () => {
    setPosition({x: 0, y: 0});
    setOffset({x: 0, y: 0});
    setZoom(1);
    setRotate(0);
    setBright(1);
    setContrast(1);
    setBackground(0);
    setHint(true);
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

  const onMouseDown = (event) => {
    if (event.button !== 0 || event.target.tagName !== 'CANVAS')
      return;

    setMouseState(1);
    setMouseDown({
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY
    });
    setHint(true);
  };

  const onMouseMove = (event) => {
    if (mouseState === 0)
      return;

    if (mouseState === 1)
      setMouseState(2);
    setOffset({
      x: event.nativeEvent.clientX - mouseDown.x,
      y: event.nativeEvent.clientY - mouseDown.y
    });
  };

  const onMouseUp = (event) => {
    const cos = Math.cos(rotate);
    const sin = Math.sin(rotate);
    setPosition({
      x: position.x + (offset.x * cos + offset.y * sin) / zoom,
      y: position.y + (-offset.x * sin + offset.y * cos) / zoom
    });
    setOffset({x: 0, y: 0});
  };

  const onClick = (event) => {
    if (mouseState !== 2 && event.target.tagName === 'CANVAS') {
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

    setMouseState(0);
  };

  useEffect(() => {
    if (hint === false) {
      const download = document.createElement('a');
      download.href = canvasRef.current.toDataURL('image/png').replace('image/png', 'application/octet-stream');
      download.download = 'photo.png';
      download.click();
      setHint(true);
    }
  }, [hint]);

  return (
    <div className='container' onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onClick={onClick}>
      <div><SizeSelect options={photoSizes} value={sizeValue} onChange={onSizeChanged} /></div>
      <div><Canvas canvasRef={canvasRef} size={photoSizes[sizeValue]} image={image} hint={hint} position={position} offset={offset} zoom={zoom} rotate={rotate} bright={bright} contrast={contrast} background={background} /></div>
      <div><EditTool onZoomChanged={onZoomChanged} onRotateChanged={onRotateChanged} onBrightChanged={setBright} onContrastChanged={setContrast} onBackgroundChanged={setBackground} /></div>
      <div><Button type='primary' onClick={onSaveFile}>儲存檔案</Button></div>
    </div>
  );
}

export default App;
