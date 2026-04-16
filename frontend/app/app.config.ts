export default defineAppConfig({
  b24ui: {
    formField: {
      slots: {
        label: "font-semibold",
      },
    },
  },
  colorMode: false,
  colorModeTypeLight: "light" as const, // edge-dark | edge-light | light
});
