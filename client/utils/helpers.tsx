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
