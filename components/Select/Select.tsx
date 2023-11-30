import React, {ChangeEvent, useEffect, useState} from 'react';

interface IOptionProps {
  value: string | number;
  label: string
}
interface ISelectProps {
  handleChange: (value: string) => void;
  options: IOptionProps[]
  preSelected: string|number
  hideLabel?: boolean
}
const DropdownSelect: React.FC<ISelectProps> = ({ hideLabel, handleChange, options, preSelected = '' }) => {
  const [selectedOption, setSelectedOption] = useState(preSelected);

  useEffect(() => {
    setSelectedOption(preSelected)
  }, [preSelected]);

  const handleChangeInternal = (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedOption(e.target.value);
    handleChange(e.target.value);
  };

  return (
    <div className="w-64 grid grid-cols-2">
      <label htmlFor="dropdown" className="text-sm text-gray-700 self-center">
        {hideLabel ? '' : 'Select an option:'}
      </label>
      <select
        id="dropdown"
        name="dropdown"
        value={selectedOption}
        onChange={handleChangeInternal}
        className="text-sm mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
      >
        <option value="" disabled>
          Choose an option
        </option>
        {options.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
        {/* Add more options as needed */}
      </select>
      {/*{selectedOption && (*/}
      {/*  <p className="mt-2 text-sm text-gray-500">You selected: {selectedOption}</p>*/}
      {/*)}*/}
    </div>
  );
};

export default DropdownSelect;
