export const ft3m3 = (capacity: number) => {
  const m3 = (capacity / 35.31469989).toFixed(2);

  return {
    ft3: capacity,
    m3,
    html: `${capacity} ft<sup>3</sup> / ${m3} m<sup>3</sup>`,
  };
};
