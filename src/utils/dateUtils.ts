// Format date to display in a user-friendly way
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format date as YYYY-MM-DD
export const formatDateYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get today's date as YYYY-MM-DD
export const getTodayFormatted = (): string => {
  return formatDateYYYYMMDD(new Date());
};

// Get day of week (0-6, where 0 is Sunday)
export const getDayOfWeek = (dateString: string): number => {
  return new Date(dateString).getDay();
};

// Get start of week (Sunday) for a given date
export const getStartOfWeek = (dateString: string): Date => {
  const date = new Date(dateString);
  const day = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
};

// Get end of week (Saturday) for a given date
export const getEndOfWeek = (dateString: string): Date => {
  const startOfWeek = getStartOfWeek(dateString);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return endOfWeek;
};

// Get array of dates for a week (Sunday to Saturday)
export const getWeekDates = (dateString: string): string[] => {
  const startDate = getStartOfWeek(dateString);
  const dates: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(formatDateYYYYMMDD(date));
  }
  
  return dates;
};

// Get month name
export const getMonthName = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'long' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Get short day name (Sun, Mon, etc.)
export const getShortDayName = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Check if date is today
export const isToday = (dateString: string): boolean => {
  const today = getTodayFormatted();
  return dateString === today;
};

// Check if date is in the past
export const isPastDate = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);
  return date < today;
};

// Get date for next day
export const getNextDay = (dateString: string): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return formatDateYYYYMMDD(date);
};

// Get date for previous day
export const getPreviousDay = (dateString: string): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  return formatDateYYYYMMDD(date);
};