import { Select } from 'antd';

function SizeSelect(props) {
  return (
    <>
      選擇照片尺寸
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

export default SizeSelect;
