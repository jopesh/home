/** The site's single long-form date format, e.g. "30. Januar 2022". */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
