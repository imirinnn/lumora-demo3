import { createContext, useContext } from 'react';

/** `true` once the preloader has finished (or was skipped). The hero waits for it before animating. */
export const IntroContext = createContext(true);
export const useIntroDone = () => useContext(IntroContext);
