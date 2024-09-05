declare module 'react-furi' {
  import { type ReactNode } from 'react';

  interface FuriObject {
    [kanji: string]: string;
  }

  interface ReactFuriProps {
    word: string;
    reading?: string;
    furi?: string | FuriObject;
    showFuri?: boolean;
    render?: (props: { pairs: [string, string][] }) => ReactNode;
  }

  export const ReactFuri: React.FC<ReactFuriProps>;
}