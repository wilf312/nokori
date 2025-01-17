import type { Signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

interface NokoriProps {
  未来日: string;
  過去日: string;
}

import { useState, useEffect } from 'preact/hooks';

// Utility function to calculate weekdays between two dates
const calculateWeekdays = (startDate: Date, endDate: Date): number => {
  let weekdayCount = 0;
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Check if current day is a weekday (1-5 are weekdays)
    if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
      weekdayCount++;
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return weekdayCount;
};

function Nokori(props: NokoriProps) {
  const [pastDate, setPastDate] = useState<string>(props.過去日);
  const [futureDate, setFutureDate] = useState<string>(props.未来日);
  const [progressInfo, setProgressInfo] = useState<{
    totalWeekdays: number;
    elapsedWeekdays: number;
    progressPercentage: number;
  } | null>(null);

  const calculateProgression = () => {
    // Validate dates
    if (!pastDate || !futureDate) {
      alert('過去日と未来日の両方を入力してください');
      return;
    }

    const past = new Date(pastDate);
    const future = new Date(futureDate);
    const today = new Date();

    // Validate date order
    if (past >= future) {
      alert('過去日は未来日より前の日付にしてください');
      return;
    }

    // Calculate total weekdays between past and future dates
    const totalWeekdays = calculateWeekdays(past, future);

    // Calculate elapsed weekdays from past date to today
    const elapsedWeekdays = today <= future 
      ? calculateWeekdays(past, today)
      : totalWeekdays;

    // Calculate progression percentage
    const progressPercentage = Math.min(
      Math.max((elapsedWeekdays / totalWeekdays) * 100, 0),
      100
    );

    setProgressInfo({
      totalWeekdays,
      elapsedWeekdays,
      progressPercentage
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">平日進捗計算</h1>
      
      <div className="mb-4">
        <label htmlFor="pastDate" className="block mb-2">
          開始日（過去日）:
        </label>
        <input 
          type="date" 
          id="pastDate"
          value={pastDate}
          onChange={(e) => setPastDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="futureDate" className="block mb-2">
          終了日（未来日）:
        </label>
        <input 
          type="date" 
          id="futureDate"
          value={futureDate}
          onChange={(e) => setFutureDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <button 
        onClick={calculateProgression}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
      >
        進捗を計算
      </button>

      {progressInfo && (
        <div className="mt-4">
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progressInfo.progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg">
              進捗: <span className="font-bold text-blue-600">
                {progressInfo.progressPercentage.toFixed(2)}%
              </span>
            </p>
            <p className="text-sm text-gray-600">
              経過平日: {progressInfo.elapsedWeekdays}日 / 
              総平日: {progressInfo.totalWeekdays}日
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nokori;