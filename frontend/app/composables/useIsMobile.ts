export const useIsMobile = (maxWidth = 767) => {
  const isMobile = ref(false);
  let mediaQuery: MediaQueryList | null = null;
  const updateIsMobile = (event?: MediaQueryListEvent) => {
    if (!mediaQuery) {
      return;
    }

    isMobile.value = event?.matches ?? mediaQuery.matches;
  };

  onMounted(() => {
    mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`);

    updateIsMobile();

    mediaQuery.addEventListener("change", updateIsMobile);
  });

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener("change", updateIsMobile);
  });

  return isMobile;
};
