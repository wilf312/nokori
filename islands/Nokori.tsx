interface NokoriProps {
  未来日: string;
  過去日: string;
}

import { useState } from "preact/hooks";
import qs from "npm:qs";

// Utility function to calculate weekdays between two dates
const calculateWeekdays = (startDate: Date, endDate: Date): number => {
  let weekdayCount = 0;
  const currentDate = new Date(startDate);

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

  const calculateProgression = () => {
    // Validate dates
    if (!pastDate || !futureDate) {
      return null;
    }

    const past = new Date(pastDate);
    const future = new Date(futureDate);
    const today = new Date();

    // Validate date order
    if (past >= future) {
      // alert("過去日は未来日より前の日付にしてください");
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
      100,
    );

    return { totalWeekdays, elapsedWeekdays, progressPercentage };
  };

  const result = calculateProgression();

  const updateDatesQuery = (
    props: { pastDate: string; futureDate: string },
  ) => {
    if (props.pastDate || props.futureDate) {
      const _pastDate = props.pastDate ? { pastDate: props.pastDate } : {};
      const _futureDate = props.futureDate
        ? { futureDate: props.futureDate }
        : {};
      const query = qs.stringify({ ..._pastDate, ..._futureDate });
      history.replaceState(null, "", `${window.location.pathname}?${query}`);
    }
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
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            const date = new Date(target.value);
            if (!Number.isNaN(date.getTime())) {
              setPastDate(target.value);
              updateDatesQuery({ pastDate: target.value, futureDate });
            }
          }}
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
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            const date = new Date(target.value);
            if (!Number.isNaN(date.getTime())) {
              setFutureDate(target.value);
              updateDatesQuery({ pastDate, futureDate: target.value });
            }
          }}
          className="w-full p-2 border rounded"
        />
      </div>

      {result && (
        <div className="mt-4">
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${result.progressPercentage}%` }}
              >
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg">
              進捗:{" "}
              <span className="font-bold text-blue-600">
                {result.progressPercentage.toFixed(2)}%
              </span>
            </p>
            <p className="text-sm text-gray-600">
              経過平日: {result.elapsedWeekdays >= 120
                ? `${Math.floor(result.elapsedWeekdays / 20)}ヶ月`
                : `${result.elapsedWeekdays}日`} / 総平日:{" "}
              {result.totalWeekdays >= 120
                ? `${Math.floor(result.totalWeekdays / 20)}ヶ月`
                : `${result.totalWeekdays}日`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nokori;
