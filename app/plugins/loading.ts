export default defineNuxtPlugin((nuxtApp) => {
  const loadingSplashScreen = useLoadingSplashScreen();
  const loadingPage         = useLoadingPage();
  const appReady            = useAppReady();

  console.log('🔌 Plugin loading.client.ts Dijalankan');

  nuxtApp.hook('page:start', () => {
    console.log('▶️ page:start terpicu');
    if (appReady.value) {
      console.log('... app sudah siap, loadingPage = true');
      loadingPage.value = true;
    } else {
      console.log('... app BELUM siap, loadingPage diabaikan');
    }
  });

  nuxtApp.hook('page:finish', () => {
    console.log('✅ page:finish terpicu. loadingPage = false');
    loadingPage.value = false;
  });

  nuxtApp.hook('app:suspense:resolve', () => {
    console.log('✨ app:suspense:resolve terpicu. Splash = false, AppReady = true');
    loadingSplashScreen.value = false;
    appReady.value            = true;
  });

  nuxtApp.hook('app:error', () => {
    console.log('❌ app:error terpicu. Semua loading = false');
    loadingPage.value         = false;
    loadingSplashScreen.value = false;
  });
});
