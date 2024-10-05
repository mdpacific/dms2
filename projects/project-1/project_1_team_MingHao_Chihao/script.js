// Open (or create) the IndexedDB
const openRequest = indexedDB.open("TodoDB", 1);

// Handle the onupgradeneeded event to create the object stores
openRequest.onupgradeneeded = function (event) {
  console.log("Upgrading...");
  let db = event.target.result;

  // Create the object store named "TodoList" with an auto-incrementing id
  if (!db.objectStoreNames.contains("TodoList")) {
    let objectStore = db.createObjectStore("TodoList", {
      keyPath: "id",
      autoIncrement: true,
    });
    objectStore.createIndex("status", "status", { unique: false });
    console.log("Object store 'TodoList' created with 'status' index.");
  }

  // Create the object store named "TodoListCompleted"
  if (!db.objectStoreNames.contains("TodoListCompleted")) {
    db.createObjectStore("TodoListCompleted", { keyPath: "id" });
    console.log("Object store 'TodoListCompleted' created.");
  }
};

openRequest.onsuccess = function (event) {
  console.log("Database opened successfully!");
  let db = event.target.result;

  // Start a new transaction to add data
  let transaction = db.transaction("TodoList", "readwrite");
  let objectStore = transaction.objectStore("TodoList");

  // Function to generate random tasks with specified statuses
  function generateRandomTask(id) {
    const tasks = [
      "Finish the monthly report",
      "Update website content",
      "Prepare for client presentation",
      "Review team feedback",
      "Organize office meeting",
      "Plan the next sprint",
      "Refactor codebase",
      "Perform code review",
      "Analyze marketing data",
      "Test new software release",
    ];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

    // Generate a random future due date
    const dueDate = new Date(
      Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    // Set status based on the id: first 1000 are 'completed', the rest 'in progress'
    const status = id <= 1000 ? "completed" : "in progress";

    return {
      id: id,
      task: randomTask,
      status: status,
      dueDate: dueDate,
    };
  }

  // Insert 100,000 randomly generated tasks into the database
  for (let i = 1; i <= 100000; i++) {
    let newTask = generateRandomTask(i);
    objectStore.add(newTask);
  }

  transaction.oncomplete = function () {
    console.log("All 100,000 tasks have been added to the TodoList.");

    // Start a new transaction to copy completed tasks
    let copyTransaction = db.transaction(
      ["TodoList", "TodoListCompleted"],
      "readwrite"
    );
    let todoStore = copyTransaction.objectStore("TodoList");
    let completedStore = copyTransaction.objectStore("TodoListCompleted");

    // Read all completed tasks and copy them to TodoListCompleted
    let completedTasks = [];
    let request = todoStore
      .index("status")
      .openCursor(IDBKeyRange.only("completed"));

    request.onsuccess = function (event) {
      let cursor = event.target.result;
      if (cursor) {
        // Add the completed task to the completed store
        completedStore.add(cursor.value);
        completedTasks.push(cursor.value); // Store the completed task
        cursor.continue();
      } else {
        console.log(
          `Copied ${completedTasks.length} completed tasks to 'TodoListCompleted'.`
        );

        // Now let's measure the time to read tasks from 'TodoListCompleted'
        let readTransaction = db.transaction("TodoListCompleted", "readonly");
        let readStore = readTransaction.objectStore("TodoListCompleted");

        // Start time measurement
        const startTime = performance.now();

        let readCompletedTasks = [];
        let readRequest = readStore.openCursor();
        readRequest.onsuccess = function (event) {
          let readCursor = event.target.result;
          if (readCursor) {
            readCompletedTasks.push(readCursor.value); // Store the read task
            readCursor.continue();
          } else {
            // End time measurement
            const endTime = performance.now();
            const duration = endTime - startTime; // Calculate duration
            console.log(
              `Time taken to read all 'completed' tasks from 'TodoListCompleted': ${duration} milliseconds`
            );

            // Optionally display the number of completed tasks
            console.log(
              `Total completed tasks read from 'TodoListCompleted': ${readCompletedTasks.length}`
            );
          }
        };

        readTransaction.onerror = function (event) {
          console.error("Read transaction failed: ", event.target.error);
        };
      }
    };

    copyTransaction.onerror = function (event) {
      console.error("Copy transaction failed: ", event.target.error);
    };
  };

  transaction.onerror = function (event) {
    console.error("Transaction failed: ", event.target.error);
  };
};

openRequest.onerror = function (event) {
  console.error("Database failed to open: ", event.target.error);
};
