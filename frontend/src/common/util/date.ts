export const convertISOStringToMonthDay = (date: string) => {
  const tempDate = new Date(date).toString().split(" ");
  const formattedDate = `${tempDate[1]} ${+tempDate[2]} ${tempDate[4]}`;
  return formattedDate;
};
