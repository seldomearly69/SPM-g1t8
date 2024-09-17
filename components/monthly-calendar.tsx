import { BodyState, DefaultEventItemProps, EventType, MonthlyBodyProps, MonthlyDayProps, OmittedDaysProps } from '@/types';
import {
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    format,
    subMonths,
    addMonths,
    getYear,
    Locale,
    getDay,
    isSameDay
  } from 'date-fns';
import React, { ReactNode, useContext } from 'react';
import { daysInWeek } from '@/lib/utils';
import { Button } from './ui/button';

type CalendarState = {
  days: Date[];
  currentMonth: Date;
  locale?: Locale;
  onCurrentMonthChange: (date: Date) => any;
};

const MonthlyCalendarContext = React.createContext<CalendarState>(
  {} as CalendarState
);

export const useMonthlyCalendar = () => useContext(MonthlyCalendarContext);

type Props = {
  locale?: Locale;
  children: ReactNode;
  currentMonth: Date;
  onCurrentMonthChange: (date: Date) => any;
};

export const MonthlyCalendar = ({
  locale,
  currentMonth,
  onCurrentMonthChange,
  children,
}: Props) => {
  let monthStart = startOfMonth(currentMonth);
  let days = eachDayOfInterval({
    start: monthStart,
    end: endOfMonth(monthStart),
  });

  return (
    <MonthlyCalendarContext.Provider
      value={{
        days,
        locale,
        onCurrentMonthChange,
        currentMonth: monthStart,
      }}
    >
      {children}
    </MonthlyCalendarContext.Provider>
  );
};

export const MonthlyNav = () => {
  let { locale, currentMonth, onCurrentMonthChange } = useMonthlyCalendar();

  return (
    <div className="flex justify-end mb-4">
      <Button
        onClick={() => onCurrentMonthChange(subMonths(currentMonth, 1))}
        variant="secondary"
        size="sm"
      >
        Previous
        </Button>
      <div
        className="ml-4 mr-4 w-32 inline-flex items-center justify-center text-sm font-medium"
        title="Current Month"
      >
        {format(
          currentMonth,
          getYear(currentMonth) === getYear(new Date()) ? 'LLLL' : 'LLLL yyyy',
          { locale }
        )}
      </div>
      <Button
        onClick={() => onCurrentMonthChange(addMonths(currentMonth, 1))}
        variant="secondary"
        size="sm"
      >
        Next
      </Button>
    </div>
  );
};

export const handleOmittedDays = ({
  days,
  omitDays,
  locale,
}: OmittedDaysProps) => {
  let headings = daysInWeek({ locale });
  let daysToRender = days;
  //omit the headings and days of the week that were passed in
  if (omitDays) {
    headings = daysInWeek({ locale }).filter(
      day => !omitDays.includes(day.day)
    );
    daysToRender = days.filter(day => !omitDays.includes(getDay(day)));
  }

  // omit the padding if an omitted day was before the start of the month
  let firstDayOfMonth = getDay(daysToRender[0]) as number;
  if (omitDays) {
    let subtractOmittedDays = omitDays.filter(day => day < firstDayOfMonth)
      .length;
    firstDayOfMonth = firstDayOfMonth - subtractOmittedDays;
  }
  let padding = new Array(firstDayOfMonth).fill(0);

  return { headings, daysToRender, padding };
};

const MonthlyBodyContext = React.createContext({} as any);

export function useMonthlyBody<DayData>() {
    return useContext<BodyState<DayData>>(MonthlyBodyContext)
  }

const headingClasses = {
    l3: 'lg:grid-cols-3',
    l4: 'lg:grid-cols-4',
    l5: 'lg:grid-cols-5',
    l6: 'lg:grid-cols-6',
    l7: 'lg:grid-cols-7',
  };

export function MonthlyBody<DayData>({
    omitDays,
    events,
    children,
  }: MonthlyBodyProps<DayData>) {
    let { days, locale } = useMonthlyCalendar();
    let { headings, daysToRender, padding } = handleOmittedDays({
      days,
      omitDays,
      locale,
    });
   
    let headingClassName =
      'border-b-2 p-2 border-r-2 lg:block hidden';

    return (
      <div className="bg-white border-l-2 border-t-2">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 ${
            //@ts-ignore
            headingClasses[`l${headings.length}`]
          }`}
        >
          {headings.map(day => (
            <div
              key={day.day}
              className={headingClassName}
              title="Day of Week"
            >
              {day.label}
            </div>
          ))}
          {padding.map((_, index) => (
            <div
              key={index}
              className={headingClassName}
              title="Empty Day"
            />
          ))}
          {daysToRender.map(day => (
            <MonthlyBodyContext.Provider
              key={day.toISOString()}
              value={{
                day,
                events: (events || []).filter(data => isSameDay(data.date, day)),
              }}
            >
              {children}
            </MonthlyBodyContext.Provider>
          ))}
        </div>
      </div>
    );
  }


export function MonthlyDay<DayData>({ renderDay}: MonthlyDayProps<DayData>) {
    let { locale } = useMonthlyCalendar();
    let { day, events } = useMonthlyBody<DayData>()
    let dayNumber = format(day, 'd', { locale });
    return (
      <div
        title={`Events for day ${dayNumber}`}
        className="h-48 p-2 border-b-2 border-r-2"
      >
        <div className="flex justify-between">
          <div className="font-bold">{dayNumber}</div>
          <div className="lg:hidden block">
            {format(day, 'EEEE', { locale })}
          </div>
        </div>
        <ul className="divide-gray-200 divide-y overflow-hidden max-h-36 overflow-y-auto">
          {renderDay(events)}
        </ul>
      </div>
    );
  }


export const DefaultMonthlyEventItem = ({
    title,
    date,
    type,

  }: DefaultEventItemProps) => {
    return (
      <li className="py-2">
        <div className="flex text-sm flex-1 justify-between">
          <h3 className="font-medium">{title}</h3>
          <p className="text-gray-500">{type}</p>
        </div>
      </li>
    );
  };