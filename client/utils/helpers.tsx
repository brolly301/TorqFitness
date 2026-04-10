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
  date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const normalize = (text: string) =>
  text.toLowerCase().replace(/[\s-]/g, "");
