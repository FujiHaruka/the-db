# the-db@3.0.0

DB for the-framework

+ Functions
  + [create(args)](#the-db-function-create)
+ [`TheDb`](#the-db-classes) Class
  + [new TheDb(config)](#the-db-classes-the-db-constructor)
  + [db.load(resourceClasses)](#the-db-classes-the-db-load)
  + [db.loadResourceFromClass(resourceName, ResourceClass)](#the-db-classes-the-db-loadResourceFromClass)

## Functions

<a class='md-heading-link' name="the-db-function-create" ></a>

### create(args) -> `TheDb`

Create a TheDb instance

| Param | Type | Description |
| ----- | --- | -------- |
| args | * |  |



<a class='md-heading-link' name="the-db-classes"></a>

## `TheDb` Class






<a class='md-heading-link' name="the-db-classes-the-db-constructor" ></a>

### new TheDb(config)

Constructor of TheDb class

| Param | Type | Description |
| ----- | --- | -------- |
| config | Object |  |
| config.env | Object | Env variables. Upper case keys will be converted lower key. `{DIALECT: 'mysql'}` -> `{dialect: 'mysql'}` |
| config.env.dialect | string | Database dialect. "mysql", "json", "memory", "localstorage", or "sqlite" |
| config.env.storage | string | Storage file name for "sqlite" or "json" dialect |
| config.env.database | string | Name of database schema |
| config.env.username | string | Database username |
| config.env.password | string | Database password |
| config.env.host | string | Database password |
| config.env.port | string | Database password |
| config.resources | Object | Resource classes |


<a class='md-heading-link' name="the-db-classes-the-db-load" ></a>

### db.load(resourceClasses) -> `TheDb`

Load resource classes

| Param | Type | Description |
| ----- | --- | -------- |
| resourceClasses | Array.&lt;function()&gt; |  |


<a class='md-heading-link' name="the-db-classes-the-db-loadResourceFromClass" ></a>

### db.loadResourceFromClass(resourceName, ResourceClass)

Register resource form Resource Class

| Param | Type | Description |
| ----- | --- | -------- |
| resourceName | string | Name of resource |
| ResourceClass | function | Resource class to register |




