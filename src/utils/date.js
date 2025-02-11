export const formatDate = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  } else {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }
};

