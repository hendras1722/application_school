export const useLoadingSplashScreen = () => {
  return useState<boolean>('isLoadingSplashScreen', () => true);
}

export const useLoadingPage = () => {
  return useState<boolean>('isLoadingPage', () => false);
}

export const useAppReady = () => {
  return useState<boolean>('isAppReady', () => false);
}
