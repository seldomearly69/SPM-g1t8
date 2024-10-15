export type DashboardConfig = {
  mainNav: MainNavItem[];
  loggedOutNav: NavbarItem[];
  loggedInNav: NavbarItem[];
  sidebarNav: {
    common: SidebarNavItem[];
    roleSpecific: {
      [key: number]: SidebarNavItem[];
    };
  };
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
};

export type NavbarItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  image?: string;
};

export type User = {
  staffId: number;
  name: string;
  email: string;
  role: string;
  position: string;
    reportingManager: string;
};

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
  renderDay?: (events: DayData[]) => ReactNode;
  onDateClick: (handler: (prev?: any[]) => any[]) => void;
  className?: ({date: Date}) => string;
};

export type MonthlyBodyProps<DayData> = {
  className?: string;
  /*
    skip days, an array of days, starts at sunday (0), saturday is 6
    ex: [0,6] would remove sunday and saturday from rendering
  */
  omitDays?: number[];
  events: (DayData & { date: string | Date })[];
  children: ReactNode;
};

export type EventType = {
  availableCount?: number;
  date: Date;
  availability?: string;
  type: string;
  is_pending: boolean;
};

export type DefaultEventItemProps = {
  availability: string;
  date: Date;
  type: string;
  isPending: boolean;
};

export type TeamEventItemProps = {
  availability: string | number;
  type: string;
};

export type Request = {
  requestId: number;
  staffId: number;
  employeeName: string;
  department: string;
  date: string;
  type: "AM" | "PM" | "full";
  requested_on: string;
  status: string;
  remarks: string;
};

export type Availability = {
  employeeName: string;
  department: string;
  availability: string;
  type: "AM" | "PM" | "full";
  isPending: string;
};

export type IndividualRequest = {
  requestId: number;
  date: string;
  type: string;
  status: string;
  remarks: string;
};
