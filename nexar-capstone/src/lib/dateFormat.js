

  export const getWeekRange = (date = new Date()) => {
    const start = new Date(date);
    const day = start.getDay();
  
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
  
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
  
    return { start, end };
  };

  export const formatDate = (date, locale = undefined) => {
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    });
  };

  export const formatDateRange = (date = new Date(), locale) => {
    const { start, end } = getWeekRange(date);
  
    return `${formatDate(start, locale)} – ${formatDate(end, locale)}`;
  };

  export const isSameDay = (a, b) => {
    return a.toDateString() === b.toDateString();
  };

  export const isInCurrentWeek = (date) => {
    const { start, end } = getWeekRange(new Date());
    return date >= start && date <= end;
  };