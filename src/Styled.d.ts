import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    accentColor: string;
    buttonColor: string;
    comWidth: string;
    comHeight: string;
    pageSmallWidth?: string;
    pageSmallHeight?: string;
    pageHeight?: string;
    pageMaxHeight?: string;
  }
}
