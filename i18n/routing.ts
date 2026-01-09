import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ko", "jp", "cn", "tw"],
 
  // Used when no locale matches
  defaultLocale: 'jp',
  localePrefix: 'always'
});
