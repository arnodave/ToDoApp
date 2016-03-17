function toDo() {
    this.id = null;
    this.description = null;
    this.addedOn = null;
    this.completedOn = null;
    this.completed = null;
}

function ToDos() {
    var addedToDos = JSON.parse(localStorage.getItem("addedToDos"));

    this.setCompletion = function (id, completed) {
        var td = this.getToDoById(id);
        if (completed == false) {
            td.completed = false;
            td.completedOn = null;
        }
        else {
            td.completed = true;
            td.completedOn = new Date().getTime();
        }
        saveToDos();
    };

    this.getToDos = function () {
        return addedToDos;
    };

    this.getToDoById = function (id) {
        for (var i = 0; i < addedToDos.length; i++) {
            if (addedToDos[i].id === id) {
                return addedToDos[i];
            }
        }
    };

    this.getLastId = function () {
        if (addedToDos.length > 0) {
            return addedToDos[addedToDos.length - 1].id;
        }
        else {
            return 0;
        }
    };

    var saveToDos = function () {
        localStorage.setItem("addedToDos", JSON.stringify(addedToDos));
    };

    this.addToDo = function (td) {
        addedToDos.push(td);
        saveToDos();
    };

    this.editToDo = function (id, description) {
        for (var i = 0; i < addedToDos.length; i++) {
            if (addedToDos[i].id === id) {
                addedToDos[i].description = description;
                break;
            }
        }
        saveToDos();
    };

    this.removeToDo = function (id) {
        for (var i = 0; i < addedToDos.length; i++) {
            if (addedToDos[i].id === id) {
                addedToDos.splice(i, 1);
                break;
            }
        }
        saveToDos();
    };

    this.getNumberOfToDos = function() {
        return addedToDos.length;
    };

    this.getNumberOfCompletedToDos = function () {
        var number = 0;
        for (var i = 0; i < addedToDos.length; i++) {
            if (addedToDos[i].completed) {
                number++;
            }
        }
        return number;
    }
}

