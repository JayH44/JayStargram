import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    accentColor: string;
    buttonColor: string;
    comWidth: string;
    comHeight: string;
    bdColor?: string;
    pageSmallWidth?: string;
    pageSmallHeight?: string;
    pageWidth?: string;
    pageHeight?: string;
    pageMaxHeight?: string;
  }
}
