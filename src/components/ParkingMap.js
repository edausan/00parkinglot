import moment from 'moment';
import React, { useEffect, useState } from 'react';

const ParkingMap = ({ park, unpark, showMap }) => {
  return (
    <section
      className={`flex flex-col gap-2 p-2 items-center justify-center mx-auto border border-black/20 rounded-md relative w-full mt-10 ${
        showMap ? 'flex' : 'hidden'
      } `}
    >
      <span className='absolute top-0 left-0 translate-x-[-50%] translate-y-[-50%] rounded-full w-[30px] h-[30px] flex items-center justify-center bg-sky-500 text-white'>
        A
      </span>
      <span className='absolute top-0 right-0 translate-x-[50%] translate-y-[-50%] rounded-full w-[30px] h-[30px] flex items-center justify-center bg-orange-500 text-white'>
        B
      </span>
      <span className='absolute bottom-0 right-0 translate-x-[50%] translate-y-[50%] rounded-full w-[30px] h-[30px] flex items-center justify-center bg-gray-500 text-white'>
        C
      </span>
      {park?.map((row, idx) => {
        return (
          <div
            key={idx}
            className='flex flex-row gap-2 p-2 items-stretch w-full'
          >
            {row?.map((lot, idx) => {
              return <ParkingLot key={idx} lot={lot} unpark={unpark} />;
            })}
          </div>
        );
      })}
    </section>
  );
};

const ParkingLot = ({ lot, unpark }) => {
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (lot.occupied) {
      let startTimestamp = moment().startOf('day');
      setInterval(function () {
        startTimestamp.add(1, 'second');
        const time = startTimestamp.format('HH:mm:ss');
        setTimer(time);
      }, 1000);
    }
  }, [lot]);

  return (
    <div
      className={`relative p-2 bg-black/20 rounded-md h-[120px] flex-1 flex flex-col items-center justify-center  ${
        lot.nearest_entrance === 'A'
          ? lot.occupied
            ? '!bg-sky-500 !text-white'
            : '!bg-sky-200'
          : lot.nearest_entrance === 'B'
          ? lot.occupied
            ? '!bg-orange-500 !text-white'
            : '!bg-orange-200'
          : lot.occupied && lot.nearest_entrance === 'C'
          ? '!bg-gray-500 !text-white'
          : ''
      }`}
    >
      {lot.name}
      {lot.occupied && (
        <>
          <div className='text-xs'>{timer}</div>
          <button
            onClick={() => unpark(lot)}
            className='px-2 py-1 rounded-sm bg-white text-black w-[calc(100% - 16px)] text-xs absolute bottom-[10px] mx-auto'
          >
            Unpark
          </button>
        </>
      )}
    </div>
  );
};

export default ParkingMap;
