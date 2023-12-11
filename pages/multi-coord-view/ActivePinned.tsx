import Image from "next/image";
import React from "react";
import Draggable from 'react-draggable';
import Popup from "../../components/Popup/Popup";
import {useModalState} from "../../store/modal";
import {usePinnedState} from "../../store/pinned";

const ActivePinned = () => {
  const { pinned, pinnedIds, setPinnedOptions, setChartPinVisibility, deletePinned } = usePinnedState();
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
      { label: 'Remove', icon: '/delete-icon.svg', clickEvent: () => { deletePinned(pinnedId); setPinnedOptions(pinnedId, false); }},
      { label: 'Close', icon: '/close-b-icon.svg', clickEvent: () => { setPinnedOptions(pinnedId, false); }}
    ];
    if (isPinned) {
      return (
        <Draggable key={pinnedId}><div className='bg-white absolute z-50 border-2 border-black rounded' style={{ width: '42rem' }} key={pinnedId}>
          <div className='relative p-4'>
            {selectedPin.node}
            <div className='absolute -top-10 -inset-x-1 bg-black h-11 rounded border-2 border-black flex justify-center items-center'>
              <p className='text-white text-lg pl-2 select-none'>Drag from here</p>
            </div>
            <div className='absolute -top-10 -right-1 bg-white border-2 border-black p-2 rounded' onClick={() => setPinnedOptions(pinnedId, true)}>
              <Image src='/menu-icon.svg' alt='menu' width={24} height={24}/>
            </div>
            {selectedPin.isPinnedOptions && <div className='absolute top-10 -right-16'>
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