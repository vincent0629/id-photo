import { Select } from 'antd';
import 'antd/dist/antd.css';

function OutputSelect(props) {
  return (
    <>
      選擇輸出尺寸
      <Select style={{width:230}} value={props.value} onChange={props.onChange}>
      {
        props.options.map((option, i) => {
          return <Select.Option value={i} key={i}>{option.name}</Select.Option>;
        })
      }
      </Select>
    </>
  );
}

export default OutputSelect;
