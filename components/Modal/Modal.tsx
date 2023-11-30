import Image from "next/image";
import React, {useEffect} from "react";

interface IModalProps {
  children: React.ReactNode,
  onClose: () => void
  modalTitle?: string;
}

const Modal: React.FC<IModalProps> = ({ children, onClose, modalTitle }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, []);
  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-black p-4 flex justify-between">
            {/* Close button */}
            <div className='text-white'>
              {modalTitle && modalTitle}
            </div>
            <button onClick={onClose}>
              <Image src="/close-icon.svg" width={24} height={24} alt="close" />
            </button>
          </div>

          {/* Modal content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;