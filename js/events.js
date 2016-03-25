function Events() {
    var toDos = new ToDos();
    var container = $(".round-corners");
    var listContainer = container.find(".todo-list");
    var toDosTemplate = _.template($("#to-do-item-template").html());

    var loadToDos = function () {
        $("div.user-information").append("<p>" + moment().format("MMM Do YYYY") + "</p>");
        setCounter();
        var reversedToDos = toDos.getToDos().slice().reverse();
        var template = new CollectionView({
            items: reversedToDos,
            template: '#to-do-item-template',
            childContentContainer: '.todo-list'
        });
        template.render();
    };

    var setCounter = function () {
        var done = toDos.getNumberOfCompletedToDos();
        var toBeDone = toDos.getNumberOfToDos() - done;
        var template = new CollectionView({
            items: [{done: done, toBeDone: toBeDone}],
            template: '#counter-template',
            childContentContainer: '.counter'
        });
        template.render();
    };

    var addToDo = function () {
        var description = container.find('textarea.add-todo').val().trim();
        if (description.length > 0) {
            var td = new toDo();
            td.description = description;
            td.completed = false;
            td.addedOn = new Date().getTime();
            td.id = toDos.getLastId() + 1;
            toDos.addToDo(td);

            var template = new CollectionView({
                items: [td],
                template: '#to-do-item-template',
                childContentContainer: '.todo-list'
            });
            template.render("prepend");

            container.find("p.add-button").html("Double click to add");
            setCounter();
        }
        else {
            $("p.add-button").html("Double click to add");
        }
    };

    var editToDo = function (editInput, listElement) {
        var toDoId = parseInt(listElement.attr('data-todo'));
        var newDescription = editInput.val();
        if (newDescription.length > 0) {
            toDos.editToDo(toDoId, newDescription);
            $(editInput.parent()).html(newDescription);
        }
        else {
            $(editInput.parent()).html(toDos.getToDoById(toDoId).description);
        }
    };

    this.init = function () {
        loadToDos();
        container.find("p.add-button").dblclick(function () {
            $(this).html("<textarea class='add-todo' type='text' placeholder='Enter description' " + "/>");
        });

        container.on('keypress', 'textarea.add-todo', function (ev) {
            if (ev.which === 13) {
                container.off('blur', 'textarea.add-todo');
                addToDo();
                container.on('blur', "textarea.add-todo", function () {
                    addToDo();
                });
            }
        });

        container.on('blur', "textarea.add-todo", function () {
            addToDo();
        });
        // Edit ToDo events
        container.on('dblclick', 'p.todo-description', function () {
            var currentDiv = $(this);
            var currentDescription = currentDiv.text();
            currentDiv.html("<textarea class='edit-description' >" + currentDescription + "</textarea>");
        });

        container.on('keypress', 'textarea.edit-description', function (ev) {
            if (ev.which === 13) {
                $(document).off('blur', 'textarea.edit-description');
                editToDo($(this), $(this).parent().parent());
                $(document).on('blur', "textarea.edit-description", function () {
                    editToDo($(this), $(this).parent().parent());
                });
            }
        });

        container.on('blur', "textarea.edit-description", function () {
            editToDo($(this), $(this).parent().parent());
        });
        // Checkbox click event
        container.on("click", "input[type=checkbox]", function () {
            var id = parseInt($(this).parent().attr("data-todo"));
            var currentToDo = toDos.getToDoById(id);
            var listElement = listContainer.find("[data-todo='" + id + "']");

            if (this.checked) {
                toDos.setCompletion(id, true);
                listElement.children("p.todo-description").css("text-decoration", "line-through");
                listElement.children("p.time-added").after("<p class='time-completed'>Completed " +
                    moment(currentToDo.completedOn).fromNow() + "</p>")
            }
            else {
                toDos.setCompletion(id, false);
                listElement.children("p.todo-description").css("text-decoration", "none");
                var timeCompletedTarget = listElement.children("p.time-completed");
                if (timeCompletedTarget) {
                    timeCompletedTarget.remove();
                }
            }
            setCounter();
        });

        // Remove button clicked event
        container.on("click", "button.remove-button", function () {
            var currentId = parseInt($(this).parent().attr("data-todo"));
            toDos.removeToDo(currentId);
            $(this).parent().remove();
            setCounter();
        });
    }

}
