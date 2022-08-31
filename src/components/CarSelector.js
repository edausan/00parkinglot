import React from 'react';

const CarSelector = ({ setSelectedCar, selectedCar }) => {
  return (
    <section className='mt-4 flex flex-col items-start'>
      <h5 className='text-sm'>Select Car Size:</h5>
      <section className='flex flex-row gap-2'>
        <button
          onClick={() => setSelectedCar(0)}
          className={`px-2 py-1 bg-sky-300 rounded-sm cursor-pointer hover:bg-sky-500 text-white ${
            selectedCar === 0 ? '!bg-sky-500' : ''
          }`}
        >
          Small
        </button>
        <button
          onClick={() => setSelectedCar(1)}
          className={`px-2 py-1 bg-sky-300 rounded-sm cursor-pointer hover:bg-sky-500 text-white ${
            selectedCar === 1 ? '!bg-sky-500' : ''
          }`}
        >
          Medium
        </button>
        <button
          onClick={() => setSelectedCar(2)}
          className={`px-2 py-1 bg-sky-300 rounded-sm cursor-pointer hover:bg-sky-500 text-white ${
            selectedCar === 2 ? '!bg-sky-500' : ''
          }`}
        >
          Large
        </button>
      </section>
    </section>
  );
};

export default CarSelector;
