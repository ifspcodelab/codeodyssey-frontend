import ClipLoader from 'react-spinners/ClipLoader';

interface props {
    size: number;
}

function Spinner({ size }: props) {
    return (
        <div style={{ width: '10px', margin: 'auto', display: 'block' }}>
            <ClipLoader color="#52bfd9" size={size}/>
        </div>
    );
}

export default Spinner;