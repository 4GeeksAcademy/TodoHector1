import ClipLoader from "react-spinners/ClipLoader";

const Spiner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <ClipLoader color="#3498db" size={50} speedMultiplier={1} />
    </div>
  );
};

export default Spiner;