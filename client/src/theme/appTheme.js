export function getAppTheme(themeMode = 'dark') {
  const isDark = themeMode === 'dark';
  return {
  token: {
    colorPrimary: '#20d0a3',
    colorInfo: '#37a9ff',
    colorTextBase: isDark ? '#e7eefb' : '#102033',
    colorBgBase: isDark ? '#07111f' : '#f5f8fc',
    colorBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)',
    borderRadius: 18,
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  components: {
    Button: {
      controlHeight: 46,
      borderRadius: 999,
      fontWeight: 700
    },
    Card: {
      colorBgContainer: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.82)',
      colorBorderSecondary: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.1)'
    },
    Select: {
      controlHeight: 44
    },
    Input: {
      controlHeight: 44
    }
  }
};
}
