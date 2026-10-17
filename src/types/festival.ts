export interface OfficialContact {
  id: string;
  sNo?: string | number;
  department: string;
  name: string;
  designation: string;
  mobile: string;
  additionalDetails?: string;
}

export interface ControlRoomConfig {
  tollFreeNumber: string;
  tollFreeDisplay: string;
  locationLabel: string;
}

export interface FestivalConfig {
  stateGovtName: string;
  districtName: string;
  festivalTitle: string;
  festivalSubtitle: string;
  editionYear: string;
  logoUrl: string;
  controlRoom: ControlRoomConfig;
  mapImageUrl: string;
  googleSheetId?: string;
  googleSheetCsvUrl?: string;
}
