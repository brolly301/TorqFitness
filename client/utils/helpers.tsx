export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const formatDate = (date: Date | string) =>
  date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
