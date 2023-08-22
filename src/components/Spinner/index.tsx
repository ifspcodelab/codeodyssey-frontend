import ClipLoader from 'react-spinners/ClipLoader';

interface props {
    width: string;
    margin: string;
    display: string;
    size: number;
}

function Spinner({width = '10px', margin = 'auto', display = 'block', size = 10 }: props) {
    return (
        <div style={{ width: width, margin: margin, display: display }}>
            <ClipLoader color="#52bfd9" size={size}/>
        </div>
    );
}

export default Spinner;