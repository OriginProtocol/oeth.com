import { typeOptions } from "../../utils/analytics";

const MovingAverageFilter = ({ value, onChange }) => {
  return (
    <div className="flex flex-row items-center w-auto h-[36px] bg-origin-bg-black rounded-lg overflow-hidden px-3 text-sm focus:outline-none">
      <select
        className="cursor-pointer flex flex-row items-center w-full h-full bg-origin-bg-black focus:outline-none"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {typeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MovingAverageFilter;
