export const aud = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

export const fmtH = (hours: number) => (Math.round(hours * 10) / 10).toString().replace(/\.0$/, "");

export const hrs = (hours: number) => fmtH(hours) + (hours === 1 ? " hr" : " hrs");

export const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

export const num = (value: string | number) => {
  const parsed = parseFloat(String(value).replace(/[^\d.]/g, ""));
  return parsed > 0 ? parsed : 0;
};

export const digits = (value: string) => value.replace(/[^\d.]/g, "");
