import { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isToday } from 'date-fns';
import axios from 'axios';

const Calendar = () => {
  const [loginDates, setLoginDates] = useState<string[]>([]);

  const today = new Date();
  const currentMonth = format(today, 'MMMM yyyy');
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const dates = [];
  let day = startDate;

  while (day <= monthEnd || dates.length % 7 !== 0) {
    dates.push(day);
    day = addDays(day, 1);
  }

  useEffect(() => {
    const fetchLoginDates = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/streak/v1/login-dates', {
          withCredentials: true, // include cookies/session
        });

        if (res.data?.loginDates) {
          setLoginDates(res.data.loginDates); // Expecting format: ['2025-06-01', '2025-06-03']
        }
      } catch (error) {
        console.error('Failed to fetch login dates', error);
      }
    };

    fetchLoginDates();
  }, []);

  const isLoggedInDate = (date: Date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    return loginDates.includes(formatted);
  };

  return (
    <div className="bg-[#151313] rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <button className="text-gray-400">
          {/* Left arrow */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h3 className="text-white font-semibold">{currentMonth}</h3>
        <button className="text-gray-400">
          {/* Right arrow */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {days.map((day, index) => (
          <div key={index} className="text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {dates.map((date, index) => {
          const isInMonth = isSameMonth(date, monthStart);
          const isCurrentDay = isToday(date);
          const loggedIn = isLoggedInDate(date);

          return (
            <div
              key={index}
              className={`rounded-full w-8 h-8 mx-auto flex items-center justify-center
              ${isCurrentDay ? 'bg-purple-600 text-white' :
                loggedIn ? 'bg-green-500 text-white' :
                  isInMonth ? 'text-gray-300' : 'text-gray-600'}
            `}
            >
              {format(date, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
