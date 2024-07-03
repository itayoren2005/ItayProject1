// Add a new task to the table
function AddTask() {
    let task = document.getElementById("TaskContent");
    if (task.value === "") {
        return; // Do not add empty tasks
    }

    var table = document.getElementById("ToDoList").querySelector('tbody');
    var row = table.insertRow();
    
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";

    var EditButton = document.createElement('input');
    EditButton.type = "button";
    EditButton.value = "Edit";
    EditButton.onclick = function() {
        EditTask(this); // Pass the button to the EditTask function
    };

    var ul = document.createElement("ul");

    var MarkBox = document.createElement('input');
    MarkBox.type = "checkbox";

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    cell1.appendChild(checkbox);
    cell2.textContent = task.value;
    cell3.appendChild(ul);
    cell4.appendChild(EditButton);
    cell5.appendChild(MarkBox);

    task.value = "";
    task.focus();

    saveTableData(); // Save table data after adding a task
}

// Delete selected tasks
function DeleteTask() {
    var table = document.getElementById("ToDoList").querySelector('tbody');
    var rows = table.rows;
    for (var i = rows.length - 1; i >= 0; i--) {
        var row = rows[i];
        var checkbox = row.cells[0].querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            table.deleteRow(i);
        }
    }

    saveTableData(); // Save table data after deleting tasks
}

// Add a subtask to the selected task
function AddSubTask() {
    var table = document.getElementById("ToDoList").querySelector('tbody');
    var rows = table.rows;
    var checkedCount = 0;
    var selectedRow;

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var checkbox = row.cells[0].querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            checkedCount++;
            selectedRow = row; // Store the selected row
        }
    }

    if (checkedCount === 0) {
        return; 
    } else if (checkedCount > 1) {
        alert("You can choose only one task for a subtask.");
        return;
    }

    var ul = selectedRow.cells[2].querySelector('ul');
    var li = document.createElement("li");
    li.textContent = document.getElementById("SubTaskContent").value;

    if (li.textContent !== "") { // Check if the subtask input is not empty
        ul.appendChild(li);
        document.getElementById("SubTaskContent").value = "";
        saveTableData(); // Save table data after adding a subtask
    }
}

// Edit task function
function EditTask(button) {
    var row = button.parentNode.parentNode;
    var TaskCell = row.cells[1];

    var newTaskText = prompt("Enter a changed task", TaskCell.textContent);

    if (newTaskText !== null && newTaskText.trim() !== "") {
        TaskCell.textContent = newTaskText;
        saveTableData(); // Save table data after editing a task
    }
}

// Save table data to local storage
function saveTableData() {
    var table = document.getElementById("ToDoList").querySelector('tbody');
    var data = [];

    for (var i = 0; i < table.rows.length; i++) {
        var row = table.rows[i];
        var taskData = {
            task: row.cells[1].textContent,
            subtasks: []
        };

        var ul = row.cells[2].querySelector('ul');
        var subtasks = ul.querySelectorAll('li');
        subtasks.forEach(function(subtask) {
            taskData.subtasks.push(subtask.textContent);
        });

        data.push(taskData);
    }

    localStorage.setItem("tableData", JSON.stringify(data));
}

// Load table data from local storage
function loadTableData() {
    var table = document.getElementById("ToDoList").querySelector('tbody');
    table.innerHTML = ""; // Clear the current table body

    var data = JSON.parse(localStorage.getItem("tableData"));
        data.forEach(function(taskData) {
            var row = table.insertRow();
            
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";

            var EditButton = document.createElement('input');
            EditButton.type = "button";
            EditButton.value = "Edit";
            EditButton.onclick = function() {
                EditTask(this);
            };

            var ul = document.createElement("ul");
            taskData.subtasks.forEach(function(subtask) {
                var li = document.createElement("li");
                li.textContent = subtask;
                ul.appendChild(li);
            });

            var MarkBox = document.createElement('input');
            MarkBox.type = "checkbox";

            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);

            cell1.appendChild(checkbox);
            cell2.textContent = taskData.task;
            cell3.appendChild(ul);
            cell4.appendChild(EditButton);
            cell5.appendChild(MarkBox);
        });
       
   
}

// Load table data when the page is loaded
window.onload = loadTableData;
