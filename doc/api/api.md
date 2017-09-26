# the-db@7.0.2

DB for the-framework

+ Functions
  + [create(args)](#the-db-function-create)
+ [`TheDB`](#the-db-classes) Class
  + [new TheDB(config)](#the-db-classes-the-d-b-constructor)
  + [b.load(ResourceClass, resourceName)](#the-db-classes-the-d-b-load)
  + [b.hasResource(resourceName)](#the-db-classes-the-d-b-hasResource)
  + [b.load(ResourceClass, resourceName)](#the-db-classes-the-d-b-load)
  + [b.hasResource(resourceName)](#the-db-classes-the-d-b-hasResource)

## Functions

<a class='md-heading-link' name="the-db-function-create" ></a>

### create(args) -> `TheDB`

Create a TheDB instance

| Param | Type | Description |
| ----- | --- | -------- |
| args | * |  |



<a class='md-heading-link' name="the-db-classes"></a>

## `TheDB` Class






<a class='md-heading-link' name="the-db-classes-the-d-b-constructor" ></a>

### new TheDB(config)

Constructor of TheDB class

| Param | Type | Description |
| ----- | --- | -------- |
| config | Object |  |
| config.name | string | Name of clay-lump |
| config.dialect | string | Database dialect. "mysql", "json", "memory", "localstorage", or "sqlite" |
| config.storage | string | Storage file name for "sqlite" or "json" dialect |
| config.database | string | Name of database schema |
| config.username | string | Database username |
| config.password | string | Database password |
| config.host | string | Database password |
| config.port | string | Database password |


<a class='md-heading-link' name="the-db-classes-the-d-b-load" ></a>

### b.load(ResourceClass, resourceName) -> `ClayResource`

Register resource form Resource Class

| Param | Type | Description |
| ----- | --- | -------- |
| ResourceClass | function | Resource class to register |
| resourceName | string | Name of resource |


<a class='md-heading-link' name="the-db-classes-the-d-b-hasResource" ></a>

### b.hasResource(resourceName) -> `boolean`

Check if resource exists

| Param | Type | Description |
| ----- | --- | -------- |
| resourceName | string |  |


<a class='md-heading-link' name="the-db-classes-the-d-b-load" ></a>

### b.load(ResourceClass, resourceName) -> `ClayResource`

Register resource form Resource Class

| Param | Type | Description |
| ----- | --- | -------- |
| ResourceClass | function | Resource class to register |
| resourceName | string | Name of resource |


<a class='md-heading-link' name="the-db-classes-the-d-b-hasResource" ></a>

### b.hasResource(resourceName) -> `boolean`

Check if resource exists

| Param | Type | Description |
| ----- | --- | -------- |
| resourceName | string |  |




