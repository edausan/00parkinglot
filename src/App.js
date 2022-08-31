import './App.css';
import { useEffect, useState } from 'react';
import ParkingMap from './components/ParkingMap';
import CarSelector from './components/CarSelector';
import EntranceSelector from './components/EntranceSelector';
import moment from 'moment';

function App() {
  const MAX_COLS = 9;
  const MAX_ROWS = 5;

  const [showMap, setShowMap] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedEntrance, setSelectedEntrance] = useState(null);
  const [parking, setParking] = useState();
  const [status, setStatus] = useState({ msg: '', status: false, type: '' });
  const [add24, setAdd24] = useState(0);
  const [totalCharges, setTotalCharges] = useState({
    status: false,
    total: 0,
    lot: null,
  });
  const [entrance, setEntrance] = useState([
    {
      name: 'A',
      row: 1,
      col: 1,
    },
    {
      name: 'B',
      row: 1,
      col: 8,
    },
    {
      name: 'C',
      row: 4,
      col: 8,
    },
  ]);

  useEffect(() => {
    handleParking();
  }, []);

  const empty_parking = new Array(MAX_ROWS)
    .fill(null)
    .map(() => new Array(MAX_COLS).fill(null));

  const handleNearestEntrance = (row, col) => {
    if ((row <= 3 && col <= 4) || (row >= 3 && col <= 2)) {
      return 'A';
    } else if (row <= 2 && col >= 5) {
      return 'B';
    } else if (row >= 2 && col >= 5) {
      return 'C';
    }
  };

  const handleParking = () => {
    const alpha = Array.from(Array(9)).map((e, i) => i - 1 + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));

    const parking = empty_parking
      .map((row, row_idx) => {
        return row
          .map((lot, lot_idx) => {
            const max = 2;
            const min = 0;
            const park_code = ['SP', 'MP', 'LP'];
            const size = Math.round(Math.random() * (max - min) + min);
            const code = park_code[size];

            if (row_idx !== 0 && lot_idx !== 0) {
              return {
                occupied: false,
                park_size: {
                  value: size,
                  code,
                },
                name: `${code}-${row_idx}${alphabet[lot_idx]}`,
                row: row_idx,
                col: lot_idx,
                nearest_entrance: handleNearestEntrance(row_idx, lot_idx),
              };
            }
            return null;
          })
          .filter((l) => l !== null);
      })
      .filter((r) => r.length >= 1);

    setParking(parking);
  };

  const handlePark = () => {
    let ent = entrance.find(
      (entrance) => entrance.name === selectedEntrance.toUpperCase()
    );
    let distance = 9999;

    let selected_lot = null;

    // Select the nearest parking lot
    parking.forEach((row, idx) => {
      return row.forEach((lot) => {
        //
        let computedDistance =
          Math.abs(ent.row - lot.row) + Math.abs(ent.col - lot.col);

        if (
          lot.park_size.value >= selectedCar &&
          distance > computedDistance &&
          !lot.occupied
        ) {
          selected_lot = lot;
          distance = computedDistance;
        }
      });
    });

    if (selected_lot) {
      const updated_parking = parking.map((row) => {
        return row.map((lot) => {
          if (lot.name === selected_lot?.name) {
            setStatus({
              status: true,
              msg: `Vehicle is parked at ${selected_lot?.name}`,
              type: 'success',
            });

            setTimeout(() => {
              setStatus({ status: false, msg: '', type: '' });
            }, 3000);

            return {
              ...lot,
              occupied: true,
              start: new Date(),
              vehicle_size: selectedCar,
            };
          }

          return lot;
        });
      });

      setParking(updated_parking);
    } else {
      setStatus({
        msg: 'Sorry! No available parking space!',
        status: true,
        type: 'error',
      });
      setTimeout(() => {
        setStatus({ status: false, msg: '', type: '' });
      }, 3000);
    }
  };

  const handleUnpark = (parking_lot, timer) => {
    setParking((parking) => {
      return parking.map((row) => {
        return row.map((lot) => {
          if (lot.name === parking_lot.name) {
            return {
              ...lot,
              occupied: false,
              start: null,
            };
          }

          setStatus({
            status: true,
            type: 'success',
            msg: `Vehicle is unpark at ${parking_lot.name}`,
          });

          handleComputeCharges(parking_lot, timer);

          setTimeout(() => {
            setStatus({ status: false, msg: '', type: '' });
          }, 3000);

          return lot;
        });
      });
    });
  };

  const handleComputeCharges = (lot) => {
    const totalTime = new Date() - lot.start;
    let remainingTime = totalTime + add24;
    let _24hrs = 1000 * 60 * 24; // 24hrs
    let _1hr = 1000 * 60; // 1hr
    let _3hrs = 1000 * 60 * 3; // 3hrs
    let totalCharges = 0;
    let hourlyCharge = 0;

    // Checks the vehicle size to add the hourly rate
    if (lot.vehicle_size === 0) {
      hourlyCharge = 20;
    } else if (lot.vehicle_size === 1) {
      hourlyCharge = 60;
    } else if (lot.vehicle_size === 2) {
      hourlyCharge = 100;
    }

    // Checks if the parked vehicle exceeds 24hrs
    if (remainingTime > _24hrs) {
      let q24 = parseInt(remainingTime / _24hrs);
      totalCharges += q24 * 5000;
      remainingTime -= q24 * _24hrs;
    }

    // Checks if the parked vehicle exceeds 3hrs
    if (remainingTime > _3hrs) {
      remainingTime -= _3hrs;
      totalCharges += 40;
    }

    if (remainingTime > 0) {
      let remainingHours = Math.ceil(remainingTime / _1hr);
      totalCharges += remainingHours * hourlyCharge;
    }

    setTotalCharges({ status: true, total: totalCharges, lot });

    return totalCharges;
  };

  return (
    <section>
      <h4 className='bg-sky-500 w-full p-3 text-white uppercase text-center'>
        <span className='font-bold'>00Parking</span>
        <span>Lot</span>
      </h4>

      {totalCharges.status && (
        <div className='z-10 fixed p-6 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white text-black rounded-md drop-shadow-2xl'>
          <h4 className='font-bold text-sm'>TOTAL: Php {totalCharges.total}</h4>
          <div className='text-xs'>Lot: {totalCharges.lot.name}</div>
          <div className='text-xs'>
            Start Park Time: {moment(totalCharges.lot.start).format('LT')}
          </div>
          <div className='text-xs'>End Park Time: {moment().format('LT')}</div>

          <button
            className='px-2 py-1 rounded-sm mt-4 bg-sky-500 w-full text-white hover:bg-sky-400 disabled:bg-gray-200'
            onClick={() =>
              setTotalCharges({ status: false, total: 0, lot: null })
            }
          >
            Okay
          </button>
        </div>
      )}

      {status.status && (
        <div
          className={`z-10 fixed p-4 top-[60px] right-[10px]  text-white rounded-md drop-shadow-2xl ${
            status.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {status.msg}
        </div>
      )}

      <div className='App flex flex-col items-start justify-center gap-2 max-w-[700px] mx-auto p-4'>
        <div className='flex flex-row gap-8'>
          <CarSelector
            setSelectedCar={setSelectedCar}
            selectedCar={selectedCar}
          />
          {selectedCar !== null && (
            <EntranceSelector
              selectedEntrance={selectedEntrance}
              setSelectedEntrance={setSelectedEntrance}
            />
          )}
        </div>
        <button
          disabled={!selectedCar && !selectedEntrance}
          onClick={handlePark}
          className='p-2 rounded-sm bg-sky-500 w-full text-white hover:bg-sky-400 disabled:bg-gray-200'
        >
          Park
        </button>

        <div className='flex flex-row justify-between w-full mt-4'>
          <button
            className='px-2 py-1 rounded-sm bg-red-500 text-white hover:bg-red-400 disabled:bg-gray-200'
            onClick={() => setAdd24(add24 !== 0 ? 0 : 1000 * 60 * 24)}
          >
            {add24 !== 0 ? 'Remove' : 'Add'} 24hrs
          </button>

          <div className='flex flex-row gap-2 items-center justify-center'>
            <button
              className='px-2 py-1 rounded-sm bg-green-500 text-white hover:bg-green-400 disabled:bg-gray-200'
              onClick={() => setShowMap((prev) => !prev)}
            >
              {showMap ? 'Hide' : 'Show'} Map
            </button>
          </div>
        </div>

        <ParkingMap park={parking} unpark={handleUnpark} showMap={showMap} />
      </div>
    </section>
  );
}

export default App;
