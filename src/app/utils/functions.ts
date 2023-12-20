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
