const isToday = (date) => {
  const today = new Date();
  const inputDate = new Date(date);

  // Normalize the dates to remove the time component
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  // Compare the normalized dates
  return today.getTime() === inputDate.getTime();
};

export default isToday;
