import { ReactNode } from 'react';
import {FaTimes} from  'react-icons/fa';

type ModalProps = {
    title: String,
    children: ReactNode,
    handleStatus: any,
}

const Modal = ({ children, title, handleStatus }: ModalProps) => {
    return (
        <>
            <div className="overlay"></div>
            <div className='modal'>
                <button onClick={handleStatus} className='close-modal'><FaTimes /></button>
                <h2>{title}</h2>
                {children}
            </div>
        </>
    );
}

export default Modal;