function Events() {
    var toDos = new ToDos();

    var loadToDos = function() {
        $("div.user-information").append("<p>" + moment().format("MMM Do YYYY") + "</p>");
        setCounter();
        var addedToDos = toDos.getToDos();

        for (var index = addedToDos.length - 1; index >= 0; index--) {
            var currentToDo = addedToDos[index];

            $(".counter").after("<div class='todo' id='" + currentToDo.id + "'>" +
                "<input type='checkbox' /><div class='description'><p class='todo-description'>" +
                currentToDo.description + "</p><hr><p class='time-added'>Added " +
                moment(currentToDo.addedOn).fromNow() + "</p></div><hr></div>");

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
    };

    var setCounter = function () {
        var done = toDos.getNumberOfCompletedToDos();
        var toBeDone = toDos.getNumberOfToDos() - done;
        var startTag = "<strong>";

        var doneText;
        if (done != 1) {
            doneText = startTag + done + "</strong> items completed";
        }
        else {
            doneText = startTag + done + "</strong> item completed";
        }

        var toBeDoneText;
        if (toBeDone != 1) {
            toBeDoneText = startTag + toBeDone + "</strong> items to be done";
        }
        else {
            toBeDoneText = startTag + toBeDone + "</strong> item to be done";
        }

        $("div.counter").children("div.to-be-done").html(toBeDoneText);
        $("div.counter").children("div.done").html(doneText);
    };

    var addToDo = function () {
        var description = document.getElementById('description').value.trim();
        if (description.length > 0) {
            var td = new toDo();
            td.description = description;
            td.completed = false;
            td.addedOn = new Date().getTime();
            td.id = toDos.getLastId() + 1;

            toDos.addToDo(td);

            $(".add-todo").before("<div class='todo' id='" + td.id + "'><input type='checkbox'><div class='description'>" +
                "<p class='todo-description'>" + td.description + "</p><hr><p class='time-added'>Added " +
                moment(td.addedOn).fromNow() + "</p></div><hr></div>");
            $("p.add-button").html("Double click to add");
            setCounter();
        }
        else {
            $("p.add-button").html("Double click to add");
        }
    };

    var editToDo = function (editInput, toDoDiv) {
        var toDoId = parseInt(toDoDiv.attr('id'));
        var newDescription = editInput.val();
        if (newDescription.length > 0) {
            toDos.editToDo(toDoId, newDescription);
            $(editInput.parent()).html(newDescription);
        }
        else {
            $(editInput.parent()).html(toDos.getToDoById(toDoId).description);
        }
    };

    this.init = function() {
        var container = $(".round-corners");
        loadToDos();
        $("p.add-button").dblclick(function () {
            $("p.add-button").html("<input id='description' class='add' type='text' placeholder='Enter description' " +
                "/>");
        });

        container.on('keypress', 'input.add', function (ev) {
            if (ev.which === 13) {
                $(document).off('blur', 'input.add');
                addToDo();
                $(document).on('blur', "input.add", function () {
                    addToDo();
                });
            }
        });

        container.on('blur', "input.add", function () {
            addToDo();
        });
        // Edit ToDo events
        $('div.round-corners').on('dblclick', 'p.todo-description', function () {
            var currentDiv = $(this);
            var currentDescription = currentDiv.text();
            currentDiv.html("<input class='edit-description' value='" + currentDescription + "'/>");
        });

        container.on('keypress', 'input.edit-description', function (ev) {
            if (ev.which === 13) {
                $(document).off('blur', 'input.edit-description');
                editToDo($(this), $(this).parent().parent().parent());
                $(document).on('blur', "input.edit-description", function () {
                    editToDo($(this), $(this).parent().parent().parent());
                });
            }
        });

        container.on('blur', "input.edit-description", function () {
            editToDo($(this), $(this).parent().parent().parent());
        });
        // Checkbox click event
        container.on("click", "input[type=checkbox]", function () {
            var id = parseInt($(this).parent().attr("id"));
            var currentToDo = toDos.getToDoById(id);

            if (this.checked) {
                toDos.setCompletion(id, true);
                $("div.todo#" + id).children("div.description").css("text-decoration", "line-through");
                $("div.todo#" + id).children("div.description").append("<p class='time-completed'>Completed " +
                    moment(currentToDo.completedOn).fromNow() + "</p>")
            }
            else {
                toDos.setCompletion(id, false);
                $("div.todo#" + id).children("div.description").css("text-decoration", "none");
                var timeCompletedTarget = $("div.todo#" + id).children("div.description").children("p.time-completed");
                if (timeCompletedTarget) {
                    timeCompletedTarget.remove();
                }
            }
            setCounter();
        });
        // Hover over ToDo events
        container.on("mouseenter", "div.todo", function () {
            $("div.todo#" + this.id).children("div.description").after("<button class='remove-button'>Remove</button>");
        });

        container.on("mouseleave", "div.todo", function () {
            $("div.todo#" + this.id).children().remove("button");
        });
        // Remove button clicked event
        container.on("click", "button.remove-button", function () {
            var currentId = parseInt($(this).parent().attr("id"));
            toDos.removeToDo(currentId);
            $("div.todo#" + currentId).remove();
            $("div.todo#" + currentId + " +hr").remove();
            setCounter();
        });
    }
}
