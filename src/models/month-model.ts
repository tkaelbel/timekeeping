import { Ref } from "vue";

export interface IWeekModel {
  monday: IDayModelRef | undefined;
  tuesday: IDayModelRef | undefined;
  wednesday: IDayModelRef | undefined;
  thursday: IDayModelRef | undefined;
  friday: IDayModelRef | undefined;
  saturday: IDayModelRef | undefined;
  sunday: IDayModelRef | undefined;
  [key: string]: IDayModelRef | undefined;
}

export interface IDayModelRef {
  day: Date;
  hours: Ref<number>;
  begin: Ref<string>;
  end: Ref<string>;
  breakTime: Ref<string>;
}

// This model is used to save Day
export interface IDayModel {
  day: Date;
  hours: number;
  vacationHours: number;
  sicknessHours: number;
  holiday: IHolidayModel;
  begin: string;
  end: string;
  breakTime: string;
}

export interface IHolidayModel {
  isHoliday: boolean;
  holidayName: string;
}

export interface IWeek {
  [key: number]: {
    [key: string]: IDayModel;
  };
}

export interface IInputModel {
  [key: number]: {
    [key: string]: IDayModelRef;
  };
}

export interface IData {
  [key: number]: IMonth;
}

interface IMonth {
  [key: string]: IWeek;
}
