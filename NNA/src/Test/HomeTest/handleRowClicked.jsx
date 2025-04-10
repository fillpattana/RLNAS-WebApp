export const handleRowClick = (session, setTimestamp, navigate) => {
  const formattedTimestamp = session.sessionInfo.runtimestamp.replace("T", " ");
  setTimestamp(formattedTimestamp);
  navigate("/agents");
};
