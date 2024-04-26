// style
import "./style.css";
const SpinnerLoader = ({ size, borderSize, color }) => {
  return (
    <div
      className="spinner"
      style={{
        width: size + "px",
        height: size + "px",
        borderTopColor: color,
        borderWidth: borderSize + "px",
      }}
    ></div>
  );
};

export default SpinnerLoader;
