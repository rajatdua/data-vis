import Image from "next/image";
import React, {useEffect} from "react";
import Popup from "../../components/Popup/Popup";
import {useModalState} from "../../store/modal";
import {usePinnedState} from "../../store/pinned";

interface IPinnedProps {
  isSidebarOpen: boolean,
}

const Pinned: React.FC<IPinnedProps> = ({ isSidebarOpen }) => {
  const { setPinnedOptions, deletePinned, pinnedIds, pinned, isPinnedOpen, setPinnedVisibility, setChartPinVisibility } = usePinnedState();
  const { setModal, setModalVisibility } = useModalState();

  useEffect(() => {
    if (isPinnedOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto"
    return () => { document.body.style.overflow = "auto" }
  }, [isPinnedOpen]);

  const renderPinnedCards = () => {
    return pinnedIds.map(pinnedId => {
      const selectedPin = pinned[pinnedId];
      const pinnedOptions = [
        selectedPin.isPinned
          ? { label: 'Unpin', icon: '/unpin-icon.svg', clickEvent: () => { setChartPinVisibility(pinnedId, false); setPinnedOptions(pinnedId, false); }}
          : { label: 'Pin', icon: '/pin-icon.svg', clickEvent: () => { setChartPinVisibility(pinnedId, true); setPinnedOptions(pinnedId, false); }},
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
      return (
        <div key={pinnedId} className="max-w-sm rounded overflow-hidden shadow-lg mr-2 [&:nth-child(odd)]:ml-4 pt-2 relative">

          <Image className="w-full" src={`/${selectedPin.chartType}.png`} alt="pattern"  width={200} height={100} />
          <div id="overlay"
               // className='absolute bg-black opacity-10 top-0 inset-x-0'
               className='absolute bg-gradient-to-t from-black via-transparent to-transparent opacity-100 top-0 inset-x-0'
               style={{ bottom: '7rem' }}/>

          <div className='flex justify-end absolute top-5 right-1 p-2 bg-white rounded-full'>
            <Image src='/menu-icon.svg' alt='menu' width={30} height={30} onClick={() => {
              setPinnedOptions(pinnedId, true);
            }} />
            {selectedPin.isPinnedOptions && <Popup options={pinnedOptions}/>}
          </div>
          <div className="px-6 py-4">
            <div className="font-bold text-lg mb-2">{selectedPin.chartTitle}</div>
            <div className='text-sm'>ID: {selectedPin.id.slice(0, 5)}</div>
          </div>
        </div>
      );
    });
  };
  return (
    <div className={`fixed z-30 transition-all h-full bg-white drop-shadow-md`} style={{ width: '40rem', left: isPinnedOpen ? 0 : '-40rem', top: 0, display: isSidebarOpen ? 'none': '' }}>
      <div className='relative h-full w-full'>
        <p
          className='-rotate-90 absolute top-44 bg-indigo-600 text-white text-sm font-medium px-5 py-3 text-center rounded-b-md z-40 cursor-pointer flex '
          onClick={() => setPinnedVisibility()}
          style={{
            left: pinnedIds.length > 0 ? '38rem' : '38.5rem'
          }}
        >
          Saved {pinnedIds.length > 0 ? <span>&nbsp;{`(${pinnedIds.length})`}</span> : ''}
        </p>
        <div className='h-full w-full overflow-hidden flex flex-col justify-between'>
          <div className='h-full'>
            <h3 className='text-2xl py-2 px-5'>Explored Saved Charts</h3>
            <div className={`h-full overflow-y-scroll grid ${pinnedIds.length > 0 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 place-items-center items-start`}>
              {pinnedIds.length > 0 ? renderPinnedCards(): <div className='text-lg font-light'>No Explored Saved Charts</div>}
            </div>
          </div>
          <div className='text-lg text-white bg-gray-800 p-3'>
            <b>Note:</b> Only 2 charts at a time are visible from saved section by default. You can pin more as you like.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pinned;