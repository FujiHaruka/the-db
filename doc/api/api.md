# the-db@3.0.3

DB for the-framework

+ Functions
  + [create(args)](#the-db-function-create)
+ [`TheDb`](#the-db-classes) Class
  + [new TheDb(config)](#the-db-classes-the-db-constructor)
  + [db.load(ResourceClass, resourceName)](#the-db-classes-the-db-load)
  + [db.getResource(resourceName)](#the-db-classes-the-db-getResource)
  + [db.hasResource(resourceName)](#the-db-classes-the-db-hasResource)
  + [db.load(ResourceClass, resourceName)](#the-db-classes-the-db-load)
  + [db.getResource(resourceName)](#the-db-classes-the-db-getResource)
  + [db.hasResource(resourceName)](#the-db-classes-the-db-hasResource)

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
| config.name | string | Name of clay-lump |
| config.dialect | string | Database dialect. "mysql", "json", "memory", "localstorage", or "sqlite" |
| config.storage | string | Storage file name for "sqlite" or "json" dialect |
| config.database | string | Name of database schema |
| config.username | string | Database username |
| config.password | string | Database password |
| config.host | string | Database password |
| config.port | string | Database password |


<a class='md-heading-link' name="the-db-classes-the-db-load" ></a>

### db.load(ResourceClass, resourceName)

Register resource form Resource Class

| Param | Type | Description |
| ----- | --- | -------- |
| ResourceClass | function | Resource class to register |
| resourceName | string | Name of resource |


<a class='md-heading-link' name="the-db-classes-the-db-getResource" ></a>

### db.getResource(resourceName) -> `ClayResource`

Get a resource with name

| Param | Type | Description |
| ----- | --- | -------- |
| resourceName | string | Name of the resource |


<a class='md-heading-link' name="the-db-classes-the-db-hasResource" ></a>

### db.hasResource(resourceName) -> `boolean`

Check if resource exists

| Param | Type | Description |
| ----- | --- | -------- |
| resourceName | string |  |


<a class='md-heading-link' name="the-db-classes-the-db-load" ></a>

### db.load(ResourceClass, resourceName)

Register resource form Resource Class

| Param | Type | Description |
| ----- | --- | -------- |
| ResourceClass | function | Resource class to register |
| resourceName | string | Name of resource |


<a class='md-heading-link' name="the-db-classes-the-db-getResource" ></a>

### db.getResource(resourceName) -> `ClayResource`

Get a resource with name

| Param | Type | Description |
| ----- | --- | -------- |
| resourceName | string | Name of the resource |


<a class='md-heading-link' name="the-db-classes-the-db-hasResource" ></a>

### db.hasResource(resourceName) -> `boolean`

Check if resource exists

| Param | Type | Description |
| ----- | --- | -------- |
| resourceName | string |  |




