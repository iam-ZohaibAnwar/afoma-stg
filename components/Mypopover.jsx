import React from 'react';

const Popover = ({ isVisible, onClose, children }) => {
  return (
    <>
      {isVisible && (
        <div className="popover">
          <div className="popover-content">{children}</div>
          <div className="popover-overlay" onClick={onClose}></div>
        </div>
      )}
    </>
  );
};

export default Popover;


// import { faShareNodes } from '@fortawesome/pro-regular-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Popover } from '@headlessui/react'

// const Popoverr = ({ isVisible, onClose, children }) => {
//   return (
//     <Popover className="relative">
//       <Popover.Button>  <FontAwesomeIcon icon={faShareNodes} /></Popover.Button>

//       <Popover.Panel className="absolute z-10 border border-emerald-600">
      
//         <div className="popover-content">{children}</div>
          
        

//         <img src="/solutions.jpg" alt="" />
//       </Popover.Panel>
//     </Popover>
//   )
// }
// export default Popoverr;