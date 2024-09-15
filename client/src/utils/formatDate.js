const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export default formatDate;
