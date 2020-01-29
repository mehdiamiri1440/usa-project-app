export const scrollIntoView = elementId => {
  const yOffset = -110;
  const element = document.getElementById(elementId);
  if (!element) return;
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: 'smooth' });
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
