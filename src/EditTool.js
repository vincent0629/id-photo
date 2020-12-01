import { forwardRef, useImperativeHandle, useState } from 'react';
import { Slider } from 'antd';
import './EditTool.css';
import 'antd/dist/antd.css';

function EditTool(props, ref) {
  const [zoom, setZoom] = useState(100);
  const [rotate, setRotate] = useState(0);
  const [bright, setBright] = useState(100);
  const [contrast, setContrast] = useState(100);

  const onZoomChanged = (value) => {
    setZoom(value);
    props.onZoomChanged(value / 100);
  };

  const onRotateChanged = (value) => {
    setRotate(value);
    props.onRotateChanged(value * 3.1416 / 180);
  };

  const onBrightChanged = (value) => {
    setBright(value);
    props.onBrightChanged(value / 100);
  };

  const onContrastChanged = (value) => {
    setContrast(value);
    props.onContrastChanged(value / 100);
  };

  useImperativeHandle(ref, () => {
    return {
      reset: () => {
        onZoomChanged(100);
        onRotateChanged(0);
        onBrightChanged(100);
        onContrastChanged(100);
      }
    };
  });

  return (
    <>
      <div className='row'><span>大小</span><Slider min={20} max={300} value={zoom} onChange={onZoomChanged} /></div>
      <div className='row'><span>旋轉</span><Slider min={-180} max={180} value={rotate} onChange={onRotateChanged} /></div>
      <div className='row'><span>亮度</span><Slider min={50} max={200} value={bright} onChange={onBrightChanged} /></div>
      <div className='row'><span>對比</span><Slider min={50} max={200} value={contrast} onChange={onContrastChanged} /></div>
    </>
  );
}

export default forwardRef(EditTool);
