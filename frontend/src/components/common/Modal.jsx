import React from 'react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="mt-3">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          <div className="mt-2 px-7 py-3">
            {children}
          </div>
          <div className="flex items-center px-4 py-3">
            <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;