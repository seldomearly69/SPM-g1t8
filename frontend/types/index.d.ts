export const dashboardConfig: NavStructure = {
  common: [...mainNav.common, ...sidebarNav.common],
  roleSpecific: {
    ...mainNav.roleSpecific,
    ...sidebarNav.roleSpecific,
  },
  // Add other shared properties here
};

export type DashboardConfig = {
  mainNav: {
    common: MainNavItem[];
    roleSpecific: { [key: number]: MainNavItem[] };
  };
  sidebarNav: {
    common: SidebarNavItem[];
    roleSpecific: { [key: number]: SidebarNavItem[] };
  };
};
export type MainNavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
};

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
  role: number;
  position: string;
  reportingManager: number;
  awayManager: number;
};

export type DaysInWeekProps = {
  locale?: Locale;
};

export type BodyState<DayData> = {
  day: Date;
  is_past: boolean;
  events: DayData[];
  requests: any;
};

export type OmittedDaysProps = {
  days: Date[];
  omitDays?: number[];
  locale?: Locale;
};

export type MonthlyDayProps<DayData> = {
  renderDay?: (events: DayData[]) => ReactNode;
  onDateClick: (any) => void;
  className?: ({ date: Date }) => string;
};

export type MonthlyBodyProps<DayData> = {
  className?: string;
  omitDays?: number[];
  events: (DayData & { date: string | Date })[];
  requests: { date: string; type: string }[];
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

export type DaySchedule = {
  date: string;
  type: string;
  availableCount: {
    office: number;
    wfh: number;
  };
  availability: Availability[];
};

export type TeamSchedule = {
  reportingManagerId: number;
  teamCount: number;
  teamSchedule: DaySchedule[];
};

type ChartData = {
  type: string;
  office: number;
  wfh: number;
}

export type Availability = {
  employeeName: string;
  department: string;
  availability: string;
  type: "AM" | "PM" | "full";
  isPending: string;
};

export type SubordinatesRequest = {
  requestId: number;
  requestingStaffName: string;
  department: string;
  date: string;
  type: string;
  status: string;
  reason: string;
  remarks: string;
  createdAt: string;
  files: string[];
};

export type IndividualRequest = {
  requestId: number;
  createdAt: string;
  date: string;
  type: string;
  status: string;
  remarks: string;
  reason: string;
};

export type TransferRequest = {
  requestId: number;
  requestingManagerId: number;
  requestingManagerName: string;
  targetManagerId: number;
  targetManagerName: string;
  status: string;
  reason: string;
};
