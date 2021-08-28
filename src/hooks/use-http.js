const useHttp = (
  type, //"POST" or "GET"
  url, // "https://custom-hooks-e260f-default-rtdb.firebaseio.com/tasks.json"
  setIsLoading,
  setError,
  setTasks, //only "GET"
  taskText, //only "POST"
  onAddTask //only "POST"
) => {
  const runRequest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (type === "GET") {
        response = await fetch(url);
      } else if (type === "POST") {
        response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({ text: taskText }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        throw new Error("Inappropriate request!");
      }
      if (!response.ok) {
        throw new Error("Request failed!");
      }
      const data = await response.json();
      if (type === "POST") {
        const generatedId = data.name; // firebase-specific => "name" contains generated id
        const createdTask = { id: generatedId, text: taskText };

        onAddTask(createdTask);
      } else if (type === "GET") {
        const loadedTasks = [];

        for (const taskKey in data) {
          loadedTasks.push({ id: taskKey, text: data[taskKey].text });
        }

        setTasks(loadedTasks);
      }
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
    setIsLoading(false);
  };
  return runRequest;
};

export default useHttp;
