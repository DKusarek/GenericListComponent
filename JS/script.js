(function () {
    var storage = window.localStorage;
    var userData = [];
    var columnNames = [];
    var columnDataTypes = [];

    if (storage.userData !== undefined) {
        userData = JSON.parse(storage.userData);
    } else {
        localStorage.userData = JSON.stringify([]);
    }

    var adminFunctions = (function () {
        var createColumn = function (name, datatype) {
            columnNames.push(name);
            var inputFormat = "";
            switch (datatype) {
                case 0:
                    inputFormat = "text";
                    break;
                case 1:
                    inputFormat = "checkbox";
                    break;
                case 2:
                    inputFormat = "date";
                    break;
                default:
                    inputFormat = "text";
            }
            columnDataTypes.push(inputFormat);
        }
        var deleteDataFromStorage = function () {
            window.localStorage.clear();
        }
        var seedStorage = function () {
            this.createColumn("Name", 0);
            this.createColumn("Priority", 0);
            this.createColumn("Done", 1);
        }
        return {
            createColumn: createColumn,
            seedStorage: seedStorage
        }
    })();

    var tableConstruction = (function () {
        var addComponentButton = function () {
            var button = document.createElement("button");
            var addComponentDiv = document.getElementById("addComponentButtonDiv");
            var buttonText = document.createTextNode("Add Component");
            addComponentDiv.appendChild(button);
            button.appendChild(buttonText);
            var addComponentDiv = document.getElementById("addComponentDiv");
            button.addEventListener('click', function () {
                if (addComponentDiv.style.display == 'block')
                    addComponentDiv.style.display = 'none';
                else
                    addComponentDiv.style.display = 'block';
            });
        }
        var createAddContentForm = function () {
            var addComponentForm = document.getElementById("addComponentForm");
            columnNames.forEach(function (item, index) {
                var divRow = document.createElement('div');
                divRow.className = "row";
                var divColumn1 = document.createElement('div');
                var divColumn2 = document.createElement('div');
                divColumn1.className = "col-md-6";
                divColumn2.className = "col-md-6";
                addComponentForm.appendChild(divRow);
                divRow.appendChild(divColumn1);
                divRow.appendChild(divColumn2);
                var label = document.createElement('label');
                var input = document.createElement('input');
                var type = columnDataTypes[index];
                input.type = type;
                input.name = item + "Name";
                input.id = item + "Name";
                label.innerHTML = item;
                divColumn1.appendChild(label);
                divColumn2.appendChild(input);
            });

            var submit = document.createElement('input');
            submit.type = 'submit';
            addComponentForm.appendChild(submit);
            addComponentForm.addEventListener('submit', function () {
                var values = [];
                columnNames.forEach(function (item, index) {
                    var columnName = item + "Name";
                    var columnDataType = columnDataTypes[index];
                    var value = "";
                    if (columnDataType == 'checkbox') {
                        var checkbox = document.forms["addComponentForm"][columnName];
                        var value = checkbox.checked;
                        values.push(value);
                    } else {
                        value = document.forms["addComponentForm"][columnName].value;
                        if (value == "") {
                            alert("Fill up " + item + " field");
                        } else {
                            values.push(value);
                        }
                    }

                });
                if (values.length == columnNames.length) {
                    userData.push(values);
                    storage.userData = JSON.stringify(userData);
                    alert('Content successfully added');
                } else {
                    values = [];
                }
            });
        }
        var createTable = function () {
            var finalTable = document.getElementById("finalTable");
            var thead = document.createElement('thead');
            finalTable.appendChild(thead);
            var rowHeader = thead.insertRow(0);
            columnNames.forEach(function (item, index) {
                var th = document.createElement('th');
                rowHeader.appendChild(th);
                var button = document.createElement('button');
                button.id = item + 'Button';
                button.className = 'headerButton noSort';
                var buttonName = document.createTextNode(item);
                button.appendChild(buttonName);
                th.appendChild(button);
            });
            var tbody = document.createElement('tbody');
            tbody.id = "tableTbody";
            finalTable.appendChild(tbody);
            userData.forEach(function (item, index) {
                var nextRow = tbody.insertRow(index);
                item.forEach(function (item, index) {
                    var td = document.createElement('td');
                    td.innerHTML = item;
                    nextRow.appendChild(td);
                });
            });
            var tfoot = document.createElement('tfoot');
            finalTable.appendChild(tfoot);
            var row = tfoot.insertRow(0);
            var cell = row.insertCell(0);
            cell.innerHTML = "aaa";
            cell.colSpan = 3;
        }
        var updateTable = function (sort, columnIndex) {
            var copyOfUserData = userData.slice(0);
            switch (sort) {
                case 'sortAsc':
                    copyOfUserData.sort(function (a, b) {
                        if (a[columnIndex] === b[columnIndex]) {
                            return 0;
                        } else {
                            return a[columnIndex] < b[columnIndex] ? -1 : 1;
                        }
                    });
                    break;
                case 'sortDesc':
                    copyOfUserData.sort(function (a, b) {
                        if (a[columnIndex] === b[columnIndex]) {
                            return 0;
                        } else {
                            return a[columnIndex] > b[columnIndex] ? -1 : 1;
                        }
                    });
                    break;
                default:
                    copyOfUserData = userData.slice(0);
            }
            var tbody = document.getElementById('tableTbody');
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            copyOfUserData.forEach(function (item, index) {
                var nextRow = tbody.insertRow(index);
                item.forEach(function (item, index) {
                    var td = document.createElement('td');
                    td.innerHTML = item;
                    nextRow.appendChild(td);
                });
            });
        }
        var addSortingFunctionality = function () {
            columnNames.forEach(function (item, index) {
                var buttonName = item + 'Button';
                var button = document.getElementById(buttonName);
                button.addEventListener('click', function () {
                    if (button.className == 'headerButton noSort') {
                        button.className = 'headerButton sortAsc';
                        updateTable('sortAsc', index);
                        console.log("a");
                    } else if (button.className == 'headerButton sortAsc') {
                        button.className = 'headerButton sortDesc';
                        updateTable('sortDesc', index);
                        console.log("b");
                    } else {
                        button.className = 'headerButton noSort';
                        updateTable('noSort', index);
                        console.log("c");
                    }
                });
            });
        }
        
        return {
            addComponentButton: addComponentButton,
            createAddContentForm: createAddContentForm,
            createTable: createTable,
            addSortingFunctionality: addSortingFunctionality,
            updateTable: updateTable
        }
    })();






    tableConstruction.addComponentButton();
    adminFunctions.seedStorage();
    tableConstruction.createAddContentForm();
    tableConstruction.createTable();
    tableConstruction.addSortingFunctionality();


    console.log(storage.columnNames);
    console.log(storage.columnDataTypes);
    console.log(storage.userData);

    //Table


    //create Content Form



    //fill table 





}());
