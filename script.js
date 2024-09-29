const dbName = "TodoDB";
const storeName = "TodoList";
const completedStoreName = "TodoListCompleted";

let db;

const request = indexedDB.open(dbName, 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const todoStore = db.createObjectStore(storeName, { keyPath: "id" });
    todoStore.createIndex("status", "status");
};

request.onsuccess = (event) => {
    db = event.target.result;
    populateDatabase();
};

request.onerror = (event) => {
    console.error("Database error: ", event.target.errorCode);
};

function populateDatabase() {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    for (let i = 1; i <= 100000; i++) {
        const status = (i <= 1000) ? 'completed' : 'in progress';
        store.add({ id: i, status: status });
    }

    transaction.oncomplete = () => {
        console.log("Database populated");
        readCompletedTasks();
    };
}











