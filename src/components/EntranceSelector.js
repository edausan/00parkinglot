import React from 'react';

const EntranceSelector = ({ setSelectedEntrance, selectedEntrance }) => {
  return (
    <section className='mt-4 flex flex-col items-start'>
      <h5 className='text-sm'>Select Entrance:</h5>

      <section className='flex flex-row gap-2'>
        <button
          onClick={() => setSelectedEntrance('A')}
          className={`px-2 py-1 bg-sky-300 rounded-sm cursor-pointer hover:bg-sky-400 text-white ${
            selectedEntrance === 'A' ? '!bg-sky-500' : ''
          }`}
        >
          Entrance A
        </button>
        <button
          onClick={() => setSelectedEntrance('B')}
          className={`px-2 py-1 bg-orange-300 rounded-sm cursor-pointer hover:bg-orange-400 text-white ${
            selectedEntrance === 'B' ? '!bg-orange-500' : ''
          }`}
        >
          Entrance B
        </button>
        <button
          onClick={() => setSelectedEntrance('C')}
          className={`px-2 py-1 bg-gray-300 rounded-sm cursor-pointer hover:bg-gray-400 text-white ${
            selectedEntrance === 'C' ? '!bg-gray-500' : ''
          }`}
        >
          Entrance C
        </button>
      </section>
    </section>
  );
};

export default EntranceSelector;
