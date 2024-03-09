$(document).ready(function () {
  loadTasks();
  $("#addTask").click(function () {
    addTask();
  });
});

function deleteTask(taskId) {
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  let updatedTasks = tasks.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  loadTasks();
}

// Map task function from list of objects to HTML

function mapTask(task) {
  return `
          <div class="bg-white rounded-lg shadow-md p-6 mb-4">
              <div class="flex justify-between items-center mb-2">
                  <h2 class="text-xl font-bold">${task.title}</h2>
                  <div class="flex space-x-2">
                      <button class="text-gray-600 hover:text-gray-900 focus:outline-none" onclick="editTask(${task.id})">
                          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-2-9-9-2-2 9zM9 9l9 2-2-9-9-2-2 9z"></path>
                          </svg>
                      </button>
                      <button class="text-red-600 hover:text-red-900 focus:outline-none" onclick="deleteTask(${task.id})">
                          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                      </button>
                  </div>
              </div>
              <p class="text-gray-700">${task.description}</p>
              <p class="text-gray-700">Assigned To: ${task.assignedTo}</p>
              <p class="text-gray-700">Due Date: ${task.dueDate}</p>
              <p class="text-gray-700">Priority: ${task.priority}</p>
          </div>`;
}

// Load tasks function

function loadTasks() {
  let tasksList = JSON.parse(localStorage.getItem("tasks") || "[]");
  let lowPriorityTasks = tasksList.filter((task) => task.priority === "low");
  $("#lowPriorityTasks").html(lowPriorityTasks.map(mapTask).join(""));
  let mediumPriorityTasks = tasksList.filter(
    (task) => task.priority === "medium"
  );
  $("#mediumPriorityTasks").html(mediumPriorityTasks.map(mapTask).join(""));
  let highPriorityTasks = tasksList.filter((task) => task.priority === "high");
  $("#highPriorityTasks").html(highPriorityTasks.map(mapTask).join(""));
}

// Edit task function.

function editTask(taskId) {
  openModal();
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  let task = tasks.find((t) => t.id === taskId);
  $("#taskTitle").val(task.title);
  $("#taskDescription").val(task.description);
  $("#dueDate").val(task.dueDate);
  $("#assignedTo").val(task.assignedTo);
  $("#priority").val(task.priority);

  $("#addTask").text("Update Task");
  $("#addTask").off("click");
  $("#addTask").click(function () {
    addTask(taskId); // Pass taskId to addTask function
  });
}

// Search tasks function

function searchTasks(value) {
  if (!value) {
    loadTasks();
    return;
  }

  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  let filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(value.toLowerCase()) ||
      task.description.toLowerCase().includes(value.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(value.toLowerCase()) ||
      task.priority.toLowerCase().includes(value.toLowerCase())
  );

  let lowPriorityTasks = filteredTasks.filter(
    (task) => task.priority === "low"
  );
  $("#lowPriorityTasks").html(lowPriorityTasks.map(mapTask).join(""));

  let mediumPriorityTasks = filteredTasks.filter(
    (task) => task.priority === "medium"
  );
  $("#mediumPriorityTasks").html(mediumPriorityTasks.map(mapTask).join(""));

  let highPriorityTasks = filteredTasks.filter(
    (task) => task.priority === "high"
  );
  $("#highPriorityTasks").html(highPriorityTasks.map(mapTask).join(""));

  if (filteredTasks.length === 0) {
    $("#lowPriorityTasks").html("<p class='text-gray-700'>No tasks found.</p>");

    $("#mediumPriorityTasks").html(
      "<p class='text-gray-700'>No tasks found.</p>"
    );

    $("#highPriorityTasks").html(
      "<p class='text-gray-700'>No tasks found.</p>"
    );
  }
}

function openModal() {
  $("#modal").removeClass("hidden");
}

function addTask(taskId) {
  let title = $("#taskTitle").val();
  let description = $("#taskDescription").val();
  let dueDate = $("#dueDate").val();
  let assignedTo = $("#assignedTo").val();
  let priority = $("#priority").val();

  if (!title || !description || !dueDate || !assignedTo || !priority) {
    alert("Please fill in all fields.");
    return;
  }

  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  let task = {
    id: taskId != null ? taskId : Math.floor(Math.random() * 1000), // Use existing taskId if provided, otherwise generate a new one
    title: title,
    description: description,
    dueDate: dueDate,
    assignedTo: assignedTo,
    priority: priority,
  };

  if (taskId != null) {
    let updatedTasks = tasks.map((t) => (t.id === taskId ? task : t));
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  } else {
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  closeModal();
}

function closeModal() {
  $("#modal").addClass("hidden");
  $("input, textarea").val("");
  loadTasks();
}
