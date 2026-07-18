export function capitalizeWords(str: string): string {
  return str
    .split(/([ \-(])/g)
    .map((part) => {
      if (part === " " || part === "-" || part === "(") return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}

export const formatDate = (date: Date | string) =>
  new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const normalize = (text: string) =>
  text.toLowerCase().replace(/[\s-]/g, "");

export const formatTime = (duration: number) => {
  const minutes = Math.floor((duration / 60) % 60);
  const hours = Math.floor(duration / 3600);

  if (duration < 60) {
    return "1 min";
  }

  if (duration < 3600) {
    return `${minutes} min`;
  }

  return `${hours} hr${hours > 1 ? "s" : ""}${
    minutes > 0 ? ` ${minutes} min` : ""
  }`;
};

export const getLocalDateKey = (dateValue: Date | string) => {
  const date = new Date(dateValue);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export type WeightUnit = "kg" | "lb";

const KG_TO_LB = 2.2046226218;

const roundDisplayWeight = (weight: number) => Math.round(weight * 100) / 100;

const roundStoredWeight = (weight: number) =>
  Math.round(weight * 10000) / 10000;

export const toDisplayWeight = (weightInKg: number, unit: WeightUnit) => {
  const converted = unit === "lb" ? weightInKg * KG_TO_LB : weightInKg;

  return roundDisplayWeight(converted);
};

export const toStoredWeight = (enteredWeight: number, unit: WeightUnit) => {
  const converted = unit === "lb" ? enteredWeight / KG_TO_LB : enteredWeight;

  return roundStoredWeight(converted);
};

export const formatWeight = (weightInKg: number, unit: WeightUnit) => {
  return `${toDisplayWeight(weightInKg, unit)} ${unit}`;
};

export const formatHeight = (
  heightCm: number,
  unit: WeightUnit,
) => {
  if (unit === "kg") {
    return `${Math.round(heightCm * 10) / 10} cm`;
  }

  const totalInches = Math.round(heightCm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;

  return `${feet}'${inches}"`;
};
