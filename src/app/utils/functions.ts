export const calculateAge = (dateString: Date): number | null => {
  const birthDate = new Date(dateString);

  // Check if the date is valid
  if (isNaN(birthDate.getTime())) {
    return null;
  }

  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear();

  // Adjust age if the birthday hasn't occurred yet this year
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    return age - 1;
  }

  return age;
};

export const getCurrentYearMonth = (): string[] => {
  // prettier-ignore
  const months: string[]=["january","february","march","april","may","june","july",
    "august", "september", "october", "november", "december"];

  const currentYear: string = new Date().getFullYear().toString();
  const currentMonth: string = months[new Date().getMonth()];

  return [currentYear, currentMonth];
};

export function timeStringToMilliseconds(timeString: string): number {
  // Parse hours and minutes from the time string
  const [hoursStr, minutesStr] = timeString.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Convert hours and minutes to milliseconds
  const hoursInMilliseconds = hours * 60 * 60 * 1000;
  const minutesInMilliseconds = minutes * 60 * 1000;

  // Sum the milliseconds for hours and minutes
  const totalMilliseconds = hoursInMilliseconds + minutesInMilliseconds;

  return totalMilliseconds;
}
