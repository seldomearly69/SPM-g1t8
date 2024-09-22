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
  is_pending: boolean;
};

export type TeamEventItemProps = {
  availability: string | number;
  type: string;
};

export type Request = {
  id: number;
  staff_id: number;
  employee_name: string;
  department: string;
  date: string;
  type: "AM" | "PM" | "full";
  requested_on: string;
  status: string;
  remarks: string;
};

export type Availability = {
  employee_name: string;
  department: string;
  availability: string;
  type: "AM" | "PM" | "full";
  is_pending: boolean;
};
