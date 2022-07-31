import { IData } from "./month-model";

export interface ITimekeeperStore {
  currentDate: Date;
  data: IData;
}

export interface ITimeCalulatorStore {
  startTime: string;
  breakTime: string;
  endTime: string;
}

export interface IConfigurationStore {
  weeklyHoursWorking: number;
  yearlyVacationDays: number;
  isAutoSave: boolean;
  autoSaveTimeSeconds: number;
  isDarkMode: boolean;
  locale: string;
  country: string;
  state: string;
  isSicknessMode: boolean;
  isHolidayMode: boolean;
  weeklyWorkingDays: number;
}

export interface IPopupStore {
  show: boolean;
  message: string;
  isPositive: boolean;
}

export interface IDarkMode {
  isActive: boolean;
}
