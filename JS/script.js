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
        var createExampleColumns = function () {
            this.createColumn("TaskName", 0);
            this.createColumn("Priority", 0);
            this.createColumn("Done", 1);
        }
        var seedStorage = function () {
            var seedData = JSON.parse(jsonData);
            seedData.forEach(function (item) {
                var data = [];
                data.push(item.TaskName, item.Priority, item.Done);
                userData.push(data)
            });
            storage.userData = JSON.stringify(userData);
        }
        return {
            createColumn: createColumn,
            createExampleColumns: createExampleColumns,
            seedStorage: seedStorage
        }
    })();

    var tableConstruction = (function () {
        var elementsPerPage = 5;
        var indexOfFirstElement = 1;
        var sortState = [];
        var addComponentButton = function () {
            var button = document.createElement("button");
            var addComponentDiv = document.getElementById("addComponentButtonDiv");
            var buttonText = document.createTextNode("Add Component");
            addComponentDiv.appendChild(button);
            button.className = "addComponentButton";
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
            var addComponentFormDiv = document.getElementById("addComponentDiv");
            var addComponentForm = document.createElement('form');
            addComponentForm.id = "addComponentForm";
            addComponentFormDiv.appendChild(addComponentForm);
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
            var finalTableDiv = document.getElementById("finalTableDiv");
            var finalTable = document.createElement('table');
            finalTable.className = "table table-hover finalTable";
            finalTable.id = "finalTable";
            finalTableDiv.appendChild(finalTable);
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
            var rowIndex = 0;
            var end = elementsPerPage > userData.length ? userData.length : indexOfFirstElement + elementsPerPage - 1;
            for (var index = indexOfFirstElement - 1; index < end; index++) {
                var nextRow = tbody.insertRow(rowIndex++);
                userData[index].forEach(function (item, index) {
                    var td = document.createElement('td');
                    if (columnDataTypes[index] == 'checkbox') {
                        var input = document.createElement('input');
                        var type = columnDataTypes[index];
                        input.type = type;
                        if (item) {
                            input.checked = 'checked';

                        }
                        td.appendChild(input);
                    } else {
                        td.innerHTML = item;
                    }
                    nextRow.appendChild(td);
                });
            }
            var tfoot = document.createElement('tfoot');
            finalTable.appendChild(tfoot);
            var row = tfoot.insertRow(0);
            var cell = row.insertCell(0);
            var footerDiv = document.createElement('div');
            cell.colSpan = columnNames.length;
            footerDiv.id = "footerDiv";
            cell.appendChild(footerDiv);
            for (var i = 0; i < columnNames.length; i++) {
                sortState.push('noSort');
            };

        }
        var updateTable = function (sort, columnIndex) {
            var copyOfUserData = userData.slice(0);
            if (arguments.length == 2) {
                sortState.forEach(function (item, index) {
                    if (index == columnIndex) {
                        sortState[columnIndex] = sort;
                    } else {
                        sortState[index] = "noSort";
                    }
                });
            }
            var noSortItems = 0;
            sortState.forEach(function (item, index) {
                switch (item) {
                    case 'sortAsc':
                        copyOfUserData.sort(function (a, b) {
                            if (a[index] === b[index]) {
                                return 0;
                            } else {
                                return a[index] < b[index] ? -1 : 1;
                            }
                        });
                        break;
                    case 'sortDesc':
                        copyOfUserData.sort(function (a, b) {
                            if (a[index] === b[index]) {
                                return 0;
                            } else {
                                return a[index] > b[index] ? -1 : 1;
                            }
                        });
                        break;
                    default:
                        noSortItems++;
                }
            });
            if (noSortItems == columnNames.length) {
                copyOfUserData = userData.slice(0);
            }

            var tbody = document.getElementById('tableTbody');
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            var rowIndex = 0;
            var end = indexOfFirstElement + elementsPerPage > userData.length ? userData.length : indexOfFirstElement + elementsPerPage - 1;
            for (var index = indexOfFirstElement - 1; index < end; index++) {
                var nextRow = tbody.insertRow(rowIndex++);
                copyOfUserData[index].forEach(function (item, index) {
                    var td = document.createElement('td');
                    if (columnDataTypes[index] == 'checkbox') {
                        var input = document.createElement('input');
                        var type = columnDataTypes[index];
                        input.type = type;
                        if (item) {
                            input.checked = 'checked';

                        }
                        td.appendChild(input);
                    } else {
                        td.innerHTML = item;
                    }
                    nextRow.appendChild(td);
                });
            }
        }
        var updateTableHeader = function (sort, columnIndex) {
            var buttonHeader = document.getElementById(columnNames[columnIndex] + 'Button');
            var buttonText = buttonHeader.firstChild;
            switch (sort) {
                case 'sortAsc':
                    buttonText = columnNames[columnIndex] + "a";
                    break;
                case 'sortDesc':
                    buttonText = columnNames[columnIndex] + "s";
                    break;
                default:
                    buttonText = columnNames[columnIndex] + "";
            }
        }
        var addSortingFunctionality = function () {
            columnNames.forEach(function (item, index) {
                var buttonName = item + 'Button';
                var button = document.getElementById(buttonName);
                button.addEventListener('click', function () {
                    if (button.className == 'headerButton noSort') {
                        button.className = 'headerButton sortAsc';
                        updateTable('sortAsc', index);
                        updateTableHeader('sortAsc', index);
                    } else if (button.className == 'headerButton sortAsc') {
                        button.className = 'headerButton sortDesc';
                        updateTable('sortDesc', index);
                        updateTableHeader('sortDesc', index);
                    } else {
                        button.className = 'headerButton noSort';
                        updateTable('noSort', index);
                        updateTableHeader('noSort', index);
                    }
                });
            });
        }
        var addPaginationFunctionality = function () {
            var footerDiv = document.getElementById('footerDiv');
            var span1 = document.createElement('span');
            var divText1 = document.createTextNode('Rows per page ');
            span1.appendChild(divText1);
            footerDiv.appendChild(span1);
            var paginatorSelecor = document.createElement('select');
            footerDiv.appendChild(paginatorSelecor);
            paginatorSelecor.id = "paginatorSelector";
            var option5 = document.createElement('option');
            var option5Text = document.createTextNode("5");
            option5.value = "5";
            option5.appendChild(option5Text);
            var option10 = document.createElement('option');
            var option10Text = document.createTextNode("10");
            option10.value = "10";
            option10.appendChild(option10Text);
            var option15 = document.createElement('option');
            var option15Text = document.createTextNode("15");
            option15.value = "15";
            option15.appendChild(option15Text);
            paginatorSelecor.appendChild(option5);
            paginatorSelecor.appendChild(option10);
            paginatorSelecor.appendChild(option15);

            paginatorSelecor.addEventListener('change', function () {
                elementsPerPage = parseInt(paginatorSelecor.options[paginatorSelecor.selectedIndex].value);
                updateTable();
            });
            var span2 = document.createElement('span');
            span2.id = 'spanInfo';
            footerDiv.appendChild(span2);
            updateSpan();

            var buttonPrev = document.createElement('button');
            var buttonPrevText = document.createTextNode('<');
            buttonPrev.className = "navigationButton";
            buttonPrev.appendChild(buttonPrevText);
            var buttonNext = document.createElement('button');
            var buttonNextText = document.createTextNode('>');
            buttonNext.className = "navigationButton";
            buttonNext.appendChild(buttonNextText);
            footerDiv.appendChild(buttonPrev);
            footerDiv.appendChild(buttonNext);
            buttonPrev.addEventListener('click', function () {
                if (indexOfFirstElement - elementsPerPage > 0) {
                    indexOfFirstElement -= elementsPerPage;
                    updateTable();
                    updateSpan();
                }
            });
            buttonNext.addEventListener('click', function () {
                if (indexOfFirstElement < userData.length) {
                    indexOfFirstElement += elementsPerPage;
                    updateTable();
                    updateSpan();
                }
            });
        }
        var updateSpan = function () {
            var span = document.getElementById('spanInfo');
            while (span.firstChild) {
                span.removeChild(span.firstChild);
            }
            var end = indexOfFirstElement + elementsPerPage > userData.length ? userData.length : indexOfFirstElement + elementsPerPage - 1;
            var spanText = document.createTextNode(indexOfFirstElement + ' - ' + end + ' of ' + userData.length);
            span.appendChild(spanText);
        }

        return {
            addComponentButton: addComponentButton,
            createAddContentForm: createAddContentForm,
            createTable: createTable,
            updateTable: updateTable,
            addSortingFunctionality: addSortingFunctionality,
            addPaginationFunctionality: addPaginationFunctionality
        }
    })();
    
    //window.localStorage.clear();
    
    //Commnent this to create our own table
    tableConstruction.addComponentButton();
    adminFunctions.createExampleColumns();
    if (userData.length == 0) {
        adminFunctions.seedStorage();
    }
    //end of comment
    
    //example how to create column:
    //First argument is columnName, second - column type: {0: 'text, 1:'boolean', 2:'date'}
    //    adminFunctions.createColumn("name", 0);
    tableConstruction.createAddContentForm();
    tableConstruction.createTable();
    tableConstruction.addSortingFunctionality();
    tableConstruction.addPaginationFunctionality();
}());
