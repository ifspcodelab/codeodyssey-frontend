// import PropTypes from 'prop-types'
// import './style.css'
// import uploadImg from '../../assets/drop_file_input/cloud-upload-regular-240.png'
// import { useRef, useState } from 'react'

// const DropFileInput = props => {
//   const wrapperRef = useRef(null)

//   const [fileList, setFileList] = useState()

//   const onDragEnter = () => wrapperRef.current.classList.add('dragover')

//   const onDragLeave = () => wrapperRef.current.classList.remove('dragover')

//   const onDrop = () => wrapperRef.current.classList.remove('dragover')

//   const onFileDrop = (e) => {
//     const newFile = e.target.files
//     if (newFile) {
//       setFileList(newFile)
//       props.onFileChange(newFile)
//     }
//   }


//   return (
//     <div
//       ref={wrapperRef}
//       className='drop-file-input'
//       onDragEnter={onDragEnter}
//       onDragLeave={onDragLeave}
//       onDrop={onDrop}
//     >
//       <div className='drop-file-input__label'>
//         <img src={uploadImg} alt="" />
//         <p>Drag & Drop your file here</p>
//       </div>
//       <input type="file" value="" onChange={onFileDrop} />
//     </div>
//   )
// }

// DropFileInput.propTypes = {
//   onFileChange: PropTypes.func,
// }

// export default DropFileInput