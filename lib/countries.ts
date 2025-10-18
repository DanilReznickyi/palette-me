export type Country = {
  iso2: string;
  name: string;
  dial: string;     // с плюсиком
  flag: string;     // emoji
  phone: { min: number; max: number };
};

export const COUNTRIES: Country[] = [
  { iso2: "DE", name: "Germany",       dial: "+49",  flag: "🇩🇪", phone: { min: 6,  max: 11 } },
  { iso2: "PL", name: "Poland",        dial: "+48",  flag: "🇵🇱", phone: { min: 6,  max: 9 }  },
  { iso2: "UA", name: "Ukraine",       dial: "+380", flag: "🇺🇦", phone: { min: 9,  max: 9 }  },
  { iso2: "RU", name: "Russia",        dial: "+7",   flag: "🇷🇺", phone: { min: 10, max: 10 } },
  { iso2: "LT", name: "Lithuania",     dial: "+370", flag: "🇱🇹", phone: { min: 8,  max: 8 }  },
  { iso2: "LV", name: "Latvia",        dial: "+371", flag: "🇱🇻", phone: { min: 8,  max: 8 }  },
  { iso2: "EE", name: "Estonia",       dial: "+372", flag: "🇪🇪", phone: { min: 7,  max: 8 }  },
  { iso2: "CZ", name: "Czechia",       dial: "+420", flag: "🇨🇿", phone: { min: 9,  max: 9 }  },
  { iso2: "SK", name: "Slovakia",      dial: "+421", flag: "🇸🇰", phone: { min: 9,  max: 9 }  },
  { iso2: "AT", name: "Austria",       dial: "+43",  flag: "🇦🇹", phone: { min: 6,  max: 11 } },
  { iso2: "CH", name: "Switzerland",   dial: "+41",  flag: "🇨🇭", phone: { min: 7,  max: 9 }  },
  { iso2: "FR", name: "France",        dial: "+33",  flag: "🇫🇷", phone: { min: 9,  max: 9 }  },
  { iso2: "ES", name: "Spain",         dial: "+34",  flag: "🇪🇸", phone: { min: 9,  max: 9 }  },
  { iso2: "IT", name: "Italy",         dial: "+39",  flag: "🇮🇹", phone: { min: 9,  max: 10 } },
  { iso2: "GB", name: "United Kingdom",dial: "+44",  flag: "🇬🇧", phone: { min: 9,  max: 10 } },
];
