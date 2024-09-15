const formatTime = (timeString) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString();
};

export default formatTime;
