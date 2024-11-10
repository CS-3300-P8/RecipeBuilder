const reportWebVitals = (onPerformanceEntry) => {
  const isValidFunction = onPerformanceEntry && typeof onPerformanceEntry === 'function';

  if (isValidFunction) {
    import('web-vitals').then((webVitals) => {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;

      getCLS(onPerformanceEntry);
      getFID(onPerformanceEntry);
      getFCP(onPerformanceEntry);
      getLCP(onPerformanceEntry);
      getTTFB(onPerformanceEntry);
    });
  }
};

export default reportWebVitals;
