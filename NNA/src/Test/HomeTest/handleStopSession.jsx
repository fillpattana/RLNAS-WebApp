export const handleStopSession = async (
  sessions,
  setShowStopAlert,
  fetchData
) => {
  try {
    const activeSession = sessions.find(
      (session) => session.sessionInfo.endtimestamp === null
    );

    console.log(activeSession);

    if (!activeSession) {
      console.warn("No active session to stop.");
      return;
    }

    const now = new Date();
    const formattedTimestamp = now
      .toISOString()
      .replace("T", " ")
      .replace("Z", "");

    const response = await fetch(`http://localhost:3000/api/stopsession`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionid: activeSession.sessionInfo.sessionid,
        endtimestamp: formattedTimestamp,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to stop the session");
    }

    console.log("Session stopped successfully");
    fetchData();
    setShowStopAlert(true);
  } catch (error) {
    console.error("Error stopping session:", error);
  }
};
