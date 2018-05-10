# Frontend Developer Assignment - Reusable, generic UI list component

## Getting Started
To run this project it is required to have installed node.js

## Building project
Go to GenericListComponent Folder and type command: node app.js
It should generate communicate: "App is runing on PORT: 8000"
Open Browser and type adress: http://localhost:8000

In the initial version, the table already has sample columns with data. 
On this version, there is possibility to check all table's features - sorting, pagination, RWD design, adding new position and saving it to local storage.

## Making changes

* If you would like create your own table from scrach, please open script.js file in JS folder.
* First thing, that should be done, is clearing local storage. You can use commented line from script.js file (script.js:366), but remember that this is one-off operation - after clearing commend that line immediately.
```
//window.localStorage.clear();
```
* Comment lines from 369-373 in script.js to unable create table automaticly.
* Create column like in an example (script.js:379) using function adminFunction.CreateColumn(name, type), where first argument describes name of a column, and second applies to the data type (Second argument is number. Possible data types: 0 - text, 1 - boolean, 2 - data)
```
adminFunctions.createColumn("name", 0)
```