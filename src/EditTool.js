import { Slider } from 'antd';
import './EditTool.css';
import 'antd/dist/antd.css';

function EditTool(props) {
  const onZoomChanged = (value) => {
    props.onZoomChanged(1 + value / 100);
  };

  const onRotateChanged = (value) => {
    props.onRotateChanged(value * 3.1416 / 180);
  };

  const onBrightChanged = (value) => {
    props.onBrightChanged(1 + value / 100);
  };

  const onContrastChanged = (value) => {
    props.onContrastChanged(1 + value / 100);
  };

  const onBackgroundChanged = (value) => {
    props.onBackgroundChanged(value / 100);
  };

  return (
    <>
      <div className='row'><span>大小</span><Slider min={-80} max={250} defaultValue={0} onChange={onZoomChanged} /></div>
      <div className='row'><span>旋轉</span><Slider min={-180} max={180} defaultValue={0} onChange={onRotateChanged} /></div>
      <div className='row'><span>亮度</span><Slider min={-50} max={100} defaultValue={0} onChange={onBrightChanged} /></div>
      <div className='row'><span>對比</span><Slider min={-50} max={100} defaultValue={0} onChange={onContrastChanged} /></div>
      <div className='row'><span>去背</span><Slider min={0} max={100} defaultValue={0} onChange={onBackgroundChanged} /></div>
    </>
  );
}

export default EditTool;
