import { useState } from 'react';
import SizeSelect from './SizeSelect';
import Canvas from './Canvas';
import EditTool from './EditTool';
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
  const [mouseState, setMouseState] = useState(0);
  const [mouseDown, setMouseDown] = useState({});

  const photoSizes = [
    {
      width: 300,
      height: 420,
      name: '1 吋 (28mm x 35mm)'
    },
    {
      width: 413,
      height: 532,
      name: '2 吋 (35mm x 45mm)'
    },
    {
      width: 496,
      height: 555,
      name: '2 吋 (42mm x 47mm)'
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
  };

  const onSizeChanged = (value) => {
    setSizeValue(parseInt(value));
  };

  const onMouseDown = (event) => {
    if (event.button !== 0 || event.target.tagName !== 'CANVAS')
      return;

    setMouseState(1);
    setMouseDown({
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY
    });
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

  return (
    <div className='container' onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onClick={onClick}>
      <div><SizeSelect options={photoSizes} value={sizeValue} onChange={onSizeChanged} /></div>
      <div><Canvas size={photoSizes[sizeValue]} image={image} position={position} offset={offset} zoom={zoom} rotate={rotate} bright={bright} contrast={contrast} background={background} /></div>
      <div><EditTool onZoomChanged={setZoom} onRotateChanged={setRotate} onBrightChanged={setBright} onContrastChanged={setContrast} onBackgroundChanged={setBackground} /></div>
    </div>
  );
}

export default App;
