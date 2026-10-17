import { FestivalConfig, OfficialContact } from '../types/festival';
import officialFestivalMap from '../assets/kulasai-festival-map.jpg';
import { MAP_IMAGE_BASE64 } from '../assets/mapImageBase64';
import { LOGO_IMAGE_BASE64 } from '../assets/logoImageBase64';

/**
 * THOOTHUKUDI DISTRICT ADMINISTRATION
 * KULASAI DASARA FESTIVAL – 2026
 *
 * Official Configuration & Contact Directory
 * Authoritative Original Assets:
 * 1. Tamil Nadu Government Logo: Original uploaded asset
 * 2. Kulasai Dasara Festival Map: Original consolidated route map
 */
export const FESTIVAL_CONFIG: FestivalConfig = {
  stateGovtName: 'GOVERNMENT OF TAMIL NADU',
  districtName: 'THOOTHUKUDI DISTRICT ADMINISTRATION',
  festivalTitle: 'KULASAI DASARA FESTIVAL – 2026',
  festivalSubtitle: 'Festival Information & Emergency Assistance',
  editionYear: '2026',

  // Exact Tamil Nadu Government logo image uploaded by the administrator
  logoUrl: LOGO_IMAGE_BASE64 || '/images.png',

  // Single Toll-Free Festival Control Room Helpline
  controlRoom: {
    tollFreeNumber: '18004251077',
    tollFreeDisplay: '1800 425 1077',
    locationLabel: 'Festival Control Room, Kulasai',
  },
  // Exact consolidated festival map image uploaded by the administrator
  // Uses authoritative embedded data URI + bundled asset for 100% reliability on Vercel
  mapImageUrl: MAP_IMAGE_BASE64 || officialFestivalMap,

  // Google Sheets configuration (optional)
  googleSheetId: '',
  googleSheetCsvUrl: '',
};

/**
 * Verified Official Directory supplied directly by the District Administration
 */
export const VERIFIED_OFFICIALS: OfficialContact[] = [
  // REVENUE
  {
    id: 'rev-01',
    sNo: '01',
    department: 'Revenue',
    name: 'Mr. R. Gowtham',
    designation: 'RDO',
    mobile: '9445000480',
    additionalDetails: 'Revenue Divisional Officer',
  },
  {
    id: 'rev-02',
    sNo: '02',
    department: 'Revenue',
    name: 'Mr. Thangasamy',
    designation: 'Tahsildar',
    mobile: '9445000682',
    additionalDetails: 'Festival Coordination & Revenue Administration',
  },
  {
    id: 'rev-03',
    sNo: '03',
    department: 'Revenue',
    name: 'Mrs. Saratha',
    designation: 'RI – Udangudi',
    mobile: '9790587881',
    additionalDetails: 'Revenue Inspector (Udangudi)',
  },
  {
    id: 'rev-04',
    sNo: '04',
    department: 'Revenue',
    name: 'Mr. Muthu Sankar',
    designation: 'VAO – Kulasai',
    mobile: '9486948835',
    additionalDetails: 'Village Administrative Officer (Kulasai)',
  },

  // POLICE
  {
    id: 'pol-05',
    sNo: '05',
    department: 'Police',
    name: 'Mr. Maheshkumar',
    designation: 'DSP',
    mobile: '7708467248',
    additionalDetails: 'Deputy Superintendent of Police – Law & Order',
  },
  {
    id: 'pol-06',
    sNo: '06',
    department: 'Police',
    name: 'Mr. Innoskumar',
    designation: 'Inspector – Kulasai',
    mobile: '9944306272',
    additionalDetails: 'Inspector of Police (Kulasai Station)',
  },

  // HR & CE
  {
    id: 'hrce-07',
    sNo: '07',
    department: 'HR & CE',
    name: 'Mrs. Rojali Sumatha',
    designation: 'JC',
    mobile: '7708320771',
    additionalDetails: 'Joint Commissioner (HR & CE Department)',
  },
  {
    id: 'hrce-08',
    sNo: '08',
    department: 'HR & CE',
    name: 'Mr. Vallinayagam',
    designation: 'EO',
    mobile: '9790852867',
    additionalDetails: 'Executive Officer – Mutharamman Temple Administration',
  },

  // HEALTH
  {
    id: 'hlth-09',
    sNo: '09',
    department: 'Health',
    name: 'Dr. Yazhini',
    designation: 'DHO',
    mobile: '7358122686',
    additionalDetails: 'District Health Officer',
  },
  {
    id: 'hlth-10',
    sNo: '10',
    department: 'Health',
    name: 'Dr. Gokula Kannan',
    designation: 'BMO',
    mobile: '8870651598',
    additionalDetails: 'Block Medical Officer – Emergency Medical Facilities',
  },

  // RURAL DEVELOPMENT
  {
    id: 'rd-11',
    sNo: '11',
    department: 'Rural Development',
    name: 'Mr. Balasubramanian',
    designation: 'BDO – BP',
    mobile: '9442723617',
    additionalDetails: 'Block Development Officer (Block Panchayat)',
  },
  {
    id: 'rd-12',
    sNo: '12',
    department: 'Rural Development',
    name: 'Mr. Sudalai',
    designation: 'BDO – VP',
    mobile: '9442179846',
    additionalDetails: 'Block Development Officer (Village Panchayat)',
  },

  // TNSTC
  {
    id: 'tnstc-13',
    sNo: '13',
    department: 'TNSTC',
    name: 'Mr. Ramakrishnan',
    designation: 'GM',
    mobile: '9487502511',
    additionalDetails: 'General Manager – Tamil Nadu State Transport Corp',
  },
  {
    id: 'tnstc-14',
    sNo: '14',
    department: 'TNSTC',
    name: 'Mr. Rajasekar',
    designation: 'BM',
    mobile: '9489052005',
    additionalDetails: 'Branch Manager – Temporary Bus Stand Operations',
  },

  // FIRE
  {
    id: 'fire-15',
    sNo: '15',
    department: 'Fire and Rescue',
    name: 'Mr. Karunakaran',
    designation: 'DFO',
    mobile: '9445086276',
    additionalDetails: 'District Fire Officer – Fire & Rescue Services',
  },
  {
    id: 'fire-16',
    sNo: '16',
    department: 'Fire and Rescue',
    name: 'Mr. Pabanasam',
    designation: 'SFO',
    mobile: '9952902301',
    additionalDetails: 'Station Fire Officer – On-Site Emergency Readiness',
  },

  // FOOD SAFETY
  {
    id: 'food-17',
    sNo: '17',
    department: 'Food Safety',
    name: 'Dr. Arun',
    designation: 'DO',
    mobile: '9894301986',
    additionalDetails: 'Designated Officer – Food Safety & Hygiene Oversight',
  },
];
