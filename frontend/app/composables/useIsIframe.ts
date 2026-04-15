export const useIsIframe = () => {
  const detectIsIframe = () => {
    if (!import.meta.client) {
      return false;
    }

    try {
      return (
        window.frameElement !== null ||
        window.self !== window.top ||
        window.parent !== window
      );
    } catch {
      return true;
    }
  };

  const isIframe = ref(detectIsIframe());

  onMounted(() => {
    isIframe.value = detectIsIframe();
  });

  return isIframe;
};
