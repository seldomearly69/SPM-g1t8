import { BodyState, DefaultEventItemProps, MonthlyBodyProps, MonthlyDayProps, OmittedDaysProps, TeamEventItemProps } from '@/types';
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
import { cn, daysInWeek } from '@/lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

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
  const monthStart = startOfMonth(currentMonth);
  const days = eachDayOfInterval({
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
  const { locale, currentMonth, onCurrentMonthChange } = useMonthlyCalendar();

  return (
    <div className="flex justify-end mb-4">
      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onCurrentMonthChange(subMonths(currentMonth, 1));
        }}
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
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onCurrentMonthChange(addMonths(currentMonth, 1));
        }}
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
    const subtractOmittedDays = omitDays.filter(day => day < firstDayOfMonth)
      .length;
    firstDayOfMonth = firstDayOfMonth - subtractOmittedDays;
  }
  const padding = new Array(firstDayOfMonth).fill(0);

  return { headings, daysToRender, padding };
};


const MonthlyBodyContext = React.createContext({} as any);

export function useMonthlyBody<DayData>() {
    return useContext<BodyState<DayData>>(MonthlyBodyContext)
  }

const headingClasses = {
    l3: 'xl:grid-cols-3',
    l4: 'xl:grid-cols-4',
    l5: 'xl:grid-cols-5',
    l6: 'xl:grid-cols-6',
    l7: 'xl:grid-cols-7',
  };

export function MonthlyBody<DayData>({
    omitDays,
    events,
    children,
    className
  }: MonthlyBodyProps<DayData>) {
    const { days, locale } = useMonthlyCalendar();
    const { headings, daysToRender, padding } = handleOmittedDays({
      days,
      omitDays,
      locale,
    });
   
    const headingClassName =
      'border-b-2 p-2 border-r-2 xl:flex justify-center items-center hidden';

    return (
      <div className={cn("bg-white border-l-2 border-t-2", className)}>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5  ${
            //@ts-expect-error -- headings.length is not known at compile time
            headingClasses[`l${headings.length}`]
          }`}
        >
          {headings.map(day => (
            <div
              key={day.day}
              className={cn(headingClassName, className, "text-sm font-bold")}
              title="Day of Week"
            >
              {day.label.slice(0, 3)}
            </div>
          ))}
          {padding.map((_, index) => (
            <div
              key={index}
              className={cn(headingClassName, className)}
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


  export function MonthlyDay<DayData>({ renderDay, onDateClick, className}: MonthlyDayProps<DayData>) {
    const { locale } = useMonthlyCalendar();
    const { day, events } = useMonthlyBody<DayData>()
    const dayNumber = format(day, 'd', { locale });
    return (
      <div
        title={`Events for day ${dayNumber}`}
        className={cn("h-48 p-2 border-b-2 border-r-2", className?.({date: day}))}
        onClick={() => onDateClick(day)}
        >
        <div className="flex justify-between">
          <div className="font-bold">{dayNumber}</div>
          <div className="xl:hidden block">
            {format(day, 'EEEE', { locale })}
          </div>
        </div>
        <ul className="divide-gray-200 divide-y overflow-hidden max-h-36 overflow-y-auto">
          {renderDay && renderDay(events)}
        </ul>
      </div>
    );
  }


export function CustomMonthlyDay<DayData>({ renderDay, onDateClick, className}: MonthlyDayProps<DayData>) {
    const { locale } = useMonthlyCalendar();
    const { day, events } = useMonthlyBody<DayData>()
    const dayNumber = format(day, 'd', { locale });

    return (
      <Popover>
        <PopoverTrigger>
          <div
            title={`Events for day ${dayNumber}`}
            className={cn("h-48 flex flex-col p-1 border-b-2 border-r-2", className?.({date: day}))}
          >
            <div className="flex justify-between">
              <div className="font-bold">{dayNumber}</div>
              <div className="md:hidden block">
                {format(day, 'EEEE', { locale })}
              </div>
            </div>
            <ul className="flex gap-1 justify-evenly w-full overflow-hidden max-h-36 overflow-y-auto">
              {renderDay && renderDay(events)}
            </ul>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-36">
          <ToggleGroup
              type="multiple"
              value={events.map(e => e.type)}
              onValueChange={(value) => {

                  onDateClick((prev?: any[]) => {
                    const currentEvents = prev || []
                    const currentDayEvents = currentEvents.filter(e => isSameDay(e.date, day));
                    const otherDayEvents = currentEvents.filter(e => !isSameDay(e.date, day));
                    
                    console.log(currentDayEvents);
                    
                    const typesToAdd = value.filter(type => !currentDayEvents.some(e => e.type === type));
                    const typesToKeep = currentDayEvents.filter(e => value.includes(e.type));
                    
                    console.log(typesToKeep);
                    
                    const newEvents = [
                      ...typesToKeep,
                      ...typesToAdd.map(type => ({ date: day, type }))
                    ];
                    
                    return [...otherDayEvents, ...newEvents];

              })}}>
              
              <ToggleGroupItem value="AM">
                AM
              </ToggleGroupItem>
              <ToggleGroupItem value="PM">
                PM
              </ToggleGroupItem>
            </ToggleGroup>

        </PopoverContent>
      </Popover>
   
    );
  }


export const DefaultMonthlyEventItem = ({
    availability,
    type,
    isPending

  }: DefaultEventItemProps) => {
    
    return (
      <li className="py-2">
        <Badge variant={isPending ? "warning" : "success"} className="w-full">
          <div className="flex text-sm flex-1 justify-between">
            <h3 className="font-medium">{availability}</h3>
            <p className="text-gray-500 text-xs">{type}</p>
          </div>
        </Badge>
      </li>
    );
  };

export const ApplyMonthlyEventItem = ({
    availability,
    type,

  }: DefaultEventItemProps) => {
    return (
      <li>
        <Badge variant="secondary" className="w-full p-1">
            <p className="text-gray-700 text-[10px]">{type}</p>
        </Badge>
      </li>
    );
  }

  
export const TeamMonthlyEventItem = ({
    availability,
    type,

  }: TeamEventItemProps) => {
    return (
      <li className="py-2">
          <div className="flex text-sm flex-1 justify-between">
            <h3 className="font-medium">{availability}</h3>
            <p className="text-gray-500">{type}</p>
          </div>
      </li>
    );
  };
