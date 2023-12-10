import Image from "next/image";
import React, {useState} from "react";
import ChartSwitcher from "./ChartSwitcher";
import Popup from "../../components/Popup/Popup";
import {INIT_DASHBOARD} from "../../constants";
import {IDashboard, useAppStore} from "../../store/app";
import {useModalState} from "../../store/modal";
import {ICommonChartProps} from "../../types";

interface IFloatingChartProps extends ICommonChartProps, IDashboard {
}

interface IMainMenu { [key: string]: boolean }

const FloatingChartsContainer: React.FC<IFloatingChartProps> = ({date, dashboards, dashboardIds = []}) => {
  const { selectedDash, setDashboard, deleteDash } = useAppStore();
  const { setModal, setModalVisibility } = useModalState();
  const [isMenuOpen, setMenu] = useState<IMainMenu>({});
  const [isMenuOpenInternal, setMenuInternal] = useState(false);
  const renderHeader = () => {
    const internalDashOptions = [
      {
        label: 'Details', icon: '/info-icon.svg', clickEvent: async () => {
          setMenuInternal(false);
          setModal(selectedDash.title, selectedDash.description, []);
          setModalVisibility(true);
        }
      },
      {
        label: 'Close', icon: '/close-b-icon.svg', clickEvent: async () => {
          setMenuInternal(false);
        }
      },
      {
        label: 'Delete', icon: '/delete-icon.svg', clickEvent: async () => {
          deleteDash(selectedDash.id);
          setDashboard(INIT_DASHBOARD);
          setMenuInternal(false);
        }
      }
    ];
    return (
      <div className='flex flex-row justify-between w-full'>
        <div className='flex flex-row items-center'>
          <Image src='/back-icon.svg' alt='back' width={32} height={32} className='mx-2' onClick={() => setDashboard(INIT_DASHBOARD)}/>
          <h3>{selectedDash.title}</h3>
        </div>
        <Image src='/menu-icon.svg' alt='menu' width={32} height={32} className='pr-2' onClick={() => setMenuInternal(prevState => !prevState)}/>
        {isMenuOpenInternal && <Popup options={internalDashOptions}/>}
      </div>
    );
  };
  return (
    <>
      {selectedDash.id === '' ? dashboardIds.map(dashboardId => {
        const selectedDashboard = dashboards[dashboardId];
        const commonSetter = (prevState: IMainMenu) => ({ ...prevState, [dashboardId]: false })
        const mainDashOptions = [
          {
            label: 'View', icon: '/view-b-icon.svg', clickEvent: async () => {
              setMenu(commonSetter);
              setDashboard(selectedDashboard);
            }
          },
          {
            label: 'Details', icon: '/info-icon.svg', clickEvent: async () => {
              setModal(selectedDashboard.title, selectedDashboard.description, []);
              setModalVisibility(true);
              setMenu(commonSetter);
            }
          },
          {
            label: 'Close', icon: '/close-b-icon.svg', clickEvent: async () => {
              setMenu(commonSetter);
            }
          },
          {
            label: 'Delete', icon: '/delete-icon.svg', clickEvent: async () => {
              deleteDash(dashboardId);
              setDashboard(INIT_DASHBOARD);
              setMenu(commonSetter);
            }
          }
        ];
        return (
          <div key={dashboardId} className="max-w-sm rounded overflow-hidden shadow-lg ml-2 [&:nth-child(even)]:mr-4 pt-2">

            {/*<Image className="w-full" src="/pattern.png" alt="pattern"  width={200} height={100} />*/}
            <div className='bg-gray-400 w-full h-20 flex justify-end border-gray-500 border-2 relative'>
              <Image src='/menu-icon.svg' alt='menu' width={30} height={30} onClick={() => setMenu((prevState) => ({ ...prevState, [dashboardId]: true }))} />
              {!!isMenuOpen[dashboardId] && <Popup options={mainDashOptions}/>}
            </div>
              <div className="px-6 py-4">
                <div className="font-bold text-lg mb-2">{selectedDashboard.title}</div>
              </div>
          </div>
        );
      }): renderHeader()}
      {selectedDash.id !== '' && <div className='grid grid-cols-1'>
        {Object.keys(selectedDash.graphsToRender ?? {}).map(graphKey => {
          return (
            <ChartSwitcher
              key={`${selectedDash.id}-${graphKey}`}
              chartType={graphKey}
              date={date}
              chartData={selectedDash.tweetIds}
              selectedDash={selectedDash}
            />
          );
        })}
      </div>}
    </>
  );
};


export default FloatingChartsContainer;