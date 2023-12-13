import Image from "next/image";
// import React, {useState} from "react";
import React from "react";
// import {Rnd} from "react-rnd";
import Draggable from 'react-draggable';
import Popup from "../../components/Popup/Popup";
import {useModalState} from "../../store/modal";
import {usePinnedState} from "../../store/pinned";

const ActivePinned = () => {
  const { pinned, pinnedIds, setPinnedOptions, setChartPinVisibility, deletePinned } = usePinnedState();
  // const [dimensions, setDimensions] = useState({ x: 0, y: 0, width: '200', height: '100' });
  const { setModal, setModalVisibility } = useModalState();
  return pinnedIds.map(pinnedId => {
    const selectedPin = pinned[pinnedId];
    const isPinned = selectedPin.isPinned;
    const pinnedOptions = [
      { label: 'Unpin', icon: '/unpin-icon.svg', clickEvent: () => { setChartPinVisibility(pinnedId, false); setPinnedOptions(pinnedId, false); }},
      {
        label: 'Details', icon: '/info-icon.svg', clickEvent: () => {
          setModal(selectedPin.chartTitle, `<p><b>Parent Dashboard:</b> <br/>${selectedPin.dashboard.title}<br/>${selectedPin.dashboard.description}</p>`, []);
          setModalVisibility(true);
          setPinnedOptions(pinnedId, false);
        }
      },
      { label: 'Delete', icon: '/delete-icon.svg', clickEvent: () => { deletePinned(pinnedId); setPinnedOptions(pinnedId, false); }},
      { label: 'Close', icon: '/close-b-icon.svg', clickEvent: () => { setPinnedOptions(pinnedId, false); }}
    ];
    if (isPinned) {
      return (
        <Draggable
          // default={{ x: 0, y: 0, width: 200, height: 100 }}
          // enableResizing={{ bottomRight: true, }}
          key={pinnedId}
          // style={{ zIndex: 50 }}
          // size={{ width: dimensions.width,  height: dimensions.height }}
          // position={{ x: dimensions.x, y: dimensions.y }}
          // onDragStop={(e, d) => { setDimensions(prevState => ({ ...prevState, x: d.x, y: d.y }) ); }}
          // onResizeStop={(e, direction, ref, delta, position) => {
          //   setDimensions(prevState => ({
          //     ...prevState,
          //     width: ref.style.width,
          //     height: ref.style.height,
          //     ...position
          //   }));
          // }}
        ><div className='bg-white absolute z-50 border-2 border-black rounded' style={{ width: '42rem' }} key={pinnedId}>
          <div className='relative p-4'>
            {React.cloneElement(selectedPin.node, { insideComponent: 'active-pinned' })}
            {/*{selectedPin.node}*/}
            <div className='absolute -top-10 -inset-x-1 bg-black h-11 rounded border-2 border-black flex justify-center items-center'>
              <p className='text-white text-lg pl-2 select-none'>Drag from here</p>
            </div>
            <div className='absolute -top-10 -right-1 bg-white border-2 border-black p-2 rounded' onClick={() => setPinnedOptions(pinnedId, true)}>
              <Image src='/menu-icon.svg' alt='menu' width={24} height={24}/>
            </div>
            {selectedPin.isPinnedOptions && <div className='absolute top-5 -right-16'>
              <Popup options={pinnedOptions}/>
            </div>}
          </div>
        </div></Draggable>
      );
    }
    else return null;
  })
};
export default ActivePinned;