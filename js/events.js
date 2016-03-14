// Load ToDos
(function () {
    $("div.user-information").append("<p>" + moment().format("MMM Do YYYY") + "</p>");
    addedToDos = JSON.parse(localStorage.getItem("addedToDos"));
    setCounter();
    for (var index = addedToDos.length - 1; index >= 0; index--) {
        var currentToDo = addedToDos[index];
        $(".counter").after("<div class='todo' id='" + currentToDo.id + "'>" +
            "<input type='checkbox' /><div class='description'><p class='todo-description'>" + currentToDo.description +
            "</p><hr>" +
            "<p class='time-added'>Added " + moment(currentToDo.addedOn).fromNow() + "</p></div></div><hr>");
        var toDoDiv = $("div#" + currentToDo.id);
        if (addedToDos[index].completed) {
            toDoDiv.children("input[type=checkbox]").prop("checked", true);
            toDoDiv.children("div.description").css("text-decoration", "line-through");
            toDoDiv.children("div.description").append("<p class='time-completed'>Completed " +
                moment(currentToDo.completedOn).fromNow() +
                "</p>")
        }
        else {
            toDoDiv.children().prop("checked", false);
        }
    }
    $(".counter").after("<hr>");
})();

// Double-click event
$(document).ready(function () {
    // Add ToDo events
    $("p.add-button").dblclick(function () {
        $("p.add-button").html("<input id='description' class='add' type='text' placeholder='Enter description' " +
            "/>");
    });

    $(document).on('keypress', 'input.add', function (ev) {
        if (ev.which === 13) {
            $(document).off('blur', 'input.add');
            addToDo();
            $(document).on('blur', "input.add", function () {
                addToDo();
            });
        }
    });

    $(document).on('blur', "input.add", function () {
        addToDo();
    });
    // Edit ToDo events
    $('div.round-corners').on('dblclick', 'p.todo-description', function () {
        var currentDiv = $(this);
        var currentDescription = currentDiv.text();
        currentDiv.html("<input class='edit-description' value='" + currentDescription + "'/>");
    });

    $(document).on('keypress', 'input.edit-description', function (ev) {
        if (ev.which === 13) {
            $(document).off('blur', 'input.edit-description');
            editToDo($(this), $(this).parent().parent().parent());
            $(document).on('blur', "input.edit-description", function () {
                editToDo($(this), $(this).parent().parent().parent());
            });
        }
    });

    $(document).on('blur', "input.edit-description", function () {
        editToDo($(this), $(this).parent().parent().parent());
    });
    // Checkbox click event
    $(document).on("click", "input[type=checkbox]", function () {
        var id = parseInt($(this).parent().attr("id"));
        var currentId = 0;
        for (var i = 0; i < addedToDos.length; i++) {
            if (addedToDos[i].id === id) {
                currentId = i;
                break;
            }
        }
        if (this.checked) {
            addedToDos[currentId].completed = true;
            addedToDos[currentId].completedOn = new Date().getTime();
            $("div.todo#" + id).children("div.description").css("text-decoration", "line-through");
            $("div.todo#" + id).children("div.description").append("<p class='time-completed'>Completed " +
                moment(addedToDos[currentId].completedOn).fromNow() + "</p>")
        }
        else {
            addedToDos[currentId].completed = false;
            addedToDos[currentId].completedOn = null;
            $("div.todo#" + id).children("div.description").css("text-decoration", "none");
            var timeCompletedTarget = $("div.todo#" + id).children("div.description").children("p.time-completed");
            if (timeCompletedTarget) {
                timeCompletedTarget.remove();
            }
        }
        localStorage.setItem("addedToDos", JSON.stringify(addedToDos));
        setCounter();
    });
    // Hover over ToDo events
    $(document).on("mouseenter", "div.todo", function () {
        $("div#" + this.id).append("<button class='remove-button'>Remove</button>");
    });

    $(document).on("mouseleave", "div.todo", function () {
        $("div#" + this.id).children().remove("button");
    });
    // Remove button clicked event
    $(document).on("click", "button.remove-button", function () {
        var currentId = parseInt($(this).parent().attr("id"));
        for (var i = 0; i < addedToDos.length; i++) {
            if (addedToDos[i].id === currentId) {
                addedToDos.splice(i, 1);
                break;
            }
        }
        $("div.todo#" + currentId).remove();
        // Aici trebuie sa scap de <hr> care raman dupa ce dau remove la un todo
        localStorage.setItem("addedToDos", JSON.stringify(addedToDos));
        setCounter();
    });

});

// Set counter
function setCounter() {
    var done = 0;
    var toBeDone = 0;
    for (var i = 0; i < addedToDos.length; i++) {
        if (addedToDos[i].completed) {
            done++;
        }
        else {
            toBeDone++;
        }
    }
    var doneText;
    if (done != 1) {
        doneText = "<strong>" + done + "</strong> items completed";
    }
    else {
        doneText = "<strong>" + done + "</strong> item completed";
    }

    var toBeDoneText;
    if (toBeDone != 1) {
        toBeDoneText = "<strong>" + toBeDone + "</strong> items to bo done";
    }
    else {
        toBeDoneText = "<strong>" + toBeDone + "</strong> item to be done";
    }


    $("div.counter").children("div.to-be-done").html(toBeDoneText);
    $("div.counter").children("div.done").html(doneText);
}
// Adding ToDos
function addToDo() {
    var td = new toDo();
    var description = document.getElementById('description').value.trim();
    if (description.length > 0) {
        td.description = description;
        td.completed = false;
        td.addedOn = new Date().getTime();
        if (addedToDos.length > 0) {
            td.id = addedToDos[addedToDos.length - 1].id + 1;
        }
        else {
            td.id = 1;
        }
        addedToDos.push(td);
        localStorage.setItem("addedToDos", JSON.stringify(addedToDos));

        $(".add-todo").before("<div class='todo' id='" + td.id + "'><input type='checkbox'><div class='description'>" +
            "<p class='todo-description'>" + td.description + "</p><hr><p class='time-added'>Added " +
            moment(td.addedOn).fromNow() + "</p></div></div><hr>");
        $("p.add-button").html("Double click to add");
        setCounter();
    }
    else {
        $("p.add-button").html("Double click to add");
    }
}
// Editing ToDo
function editToDo(editInput, toDoDiv) {
    var currentToDoId = parseInt(toDoDiv.attr('id'));
    var newDescription = editInput.val();
    var currentToDoIndex = null;
    for (var i = 0; i < addedToDos.length; i++) {
        if (addedToDos[i].id === currentToDoId) {
            currentToDoIndex = i;
            break;
        }
    }
    if (newDescription.length > 0) {
        addedToDos[currentToDoIndex].description = newDescription;
        $(editInput.parent()).html(addedToDos[currentToDoIndex].description);
    }
    else {
        $(editInput.parent()).html(addedToDos[currentToDoIndex].description);
    }
    localStorage.setItem("addedToDos", JSON.stringify(addedToDos));
}