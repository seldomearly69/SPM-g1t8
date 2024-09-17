export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
    }
);

export type DaysInWeekProps = {
  locale?: Locale;
};

export type BodyState<DayData> = {
  day: Date;
  events: DayData[];
};

export type OmittedDaysProps = {
  days: Date[];
  omitDays?: number[];
  locale?: Locale;
};

export type MonthlyDayProps<DayData> = {
  renderDay: (events: DayData[]) => ReactNode;
};

export type MonthlyBodyProps<DayData> = {
  /*
    skip days, an array of days, starts at sunday (0), saturday is 6
    ex: [0,6] would remove sunday and saturday from rendering
  */
  omitDays?: number[];
  events: (DayData & { date: Date})[];
  children: ReactNode;
};

export export type EventType = {
  date: Date;
  title: string;
  type: string;
};

export type DefaultEventItemProps = {
  title: string;
  date: Date;
  type: string;

};