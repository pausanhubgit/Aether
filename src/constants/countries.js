export const COUNTRIES = [
  { name: "Nepal", code: "NP", dialCode: "+977", regex: /^[9][678][0-9]{8}$/, placeholder: "98XXXXXXXX" },
  { name: "India", code: "IN", dialCode: "+91", regex: /^[6789][0-9]{9}$/, placeholder: "9XXXXXXXXX" },
  { name: "United States", code: "US", dialCode: "+1", regex: /^[2-9][0-9]{9}$/, placeholder: "2015550123" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", regex: /^[7][0-9]{9}$/, placeholder: "7XXXXXXXXX" },
  { name: "Australia", code: "AU", dialCode: "+61", regex: /^[4][0-9]{8}$/, placeholder: "4XXXXXXXX" },
  { name: "Canada", code: "CA", dialCode: "+1", regex: /^[2-9][0-9]{9}$/, placeholder: "2015550123" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

export const getCountryByDialCode = (dialCode) => {
  return COUNTRIES.find(c => c.dialCode === dialCode) || DEFAULT_COUNTRY;
};
