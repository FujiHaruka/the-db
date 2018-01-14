# the-db@9.0.2

DB for the-framework

+ Functions
  + [create(args)](#the-db-function-create)
+ [`TheDB`](#the-db-classes) Class
  + [new TheDB(config)](#the-db-classes-the-d-b-constructor)
  + [b.load(ResourceClass, resourceName)](#the-db-classes-the-d-b-load)
  + [b.loadFromMapping(ResourceMapping)](#the-db-classes-the-d-b-loadFromMapping)
  + [b.hookFromMapping(HookMapping, HookMapping)](#the-db-classes-the-d-b-hookFromMapping)
  + [b.hasResource(resourceName)](#the-db-classes-the-d-b-hasResource)
  + [b.updateVersion(version)](#the-db-classes-the-d-b-updateVersion)
  + [b.unref()](#the-db-classes-the-d-b-unref)
  + [b.load(ResourceClass, resourceName)](#the-db-classes-the-d-b-load)
  + [b.loadFromMapping(ResourceMapping)](#the-db-classes-the-d-b-loadFromMapping)
  + [b.hookFromMapping(HookMapping, HookMapping)](#the-db-classes-the-d-b-hookFromMapping)
  + [b.hasResource(resourceName)](#the-db-classes-the-d-b-hasResource)
  + [b.updateVersion(version)](#the-db-classes-the-d-b-updateVersion)
  + [b.unref()](#the-db-classes-the-d-b-unref)

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


<a class='md-heading-link' name="the-db-classes-the-d-b-loadFromMapping" ></a>

### b.loadFromMapping(ResourceMapping)

Load resources from mapping object

| Param | Type | Description |
| ----- | --- | -------- |
| ResourceMapping | Object.&lt;string, function()&gt; | Resource name and class |


<a class='md-heading-link' name="the-db-classes-the-d-b-hookFromMapping" ></a>

### b.hookFromMapping(HookMapping, HookMapping)

Hook from mapping

| Param | Type | Description |
| ----- | --- | -------- |
| HookMapping |  |  |
| HookMapping | Object.&lt;string, function()&gt; | Resource name and hook creators |


<a class='md-heading-link' name="the-db-classes-the-d-b-hasResource" ></a>

### b.hasResource(resourceName) -> `boolean`

Check if resource exists

| Param | Type | Description |
| ----- | --- | -------- |
| resourceName | string |  |


<a class='md-heading-link' name="the-db-classes-the-d-b-updateVersion" ></a>

### b.updateVersion(version) -> `Promise.boolean`

Update database migration version

| Param | Type | Description |
| ----- | --- | -------- |
| version | string | Version string |


<a class='md-heading-link' name="the-db-classes-the-d-b-unref" ></a>

### b.unref() -> `TheDB`

Aut close before exit

<a class='md-heading-link' name="the-db-classes-the-d-b-load" ></a>

### b.load(ResourceClass, resourceName) -> `ClayResource`

Register resource form Resource Class

| Param | Type | Description |
| ----- | --- | -------- |
| ResourceClass | function | Resource class to register |
| resourceName | string | Name of resource |


<a class='md-heading-link' name="the-db-classes-the-d-b-loadFromMapping" ></a>

### b.loadFromMapping(ResourceMapping)

Load resources from mapping object

| Param | Type | Description |
| ----- | --- | -------- |
| ResourceMapping | Object.&lt;string, function()&gt; | Resource name and class |


<a class='md-heading-link' name="the-db-classes-the-d-b-hookFromMapping" ></a>

### b.hookFromMapping(HookMapping, HookMapping)

Hook from mapping

| Param | Type | Description |
| ----- | --- | -------- |
| HookMapping |  |  |
| HookMapping | Object.&lt;string, function()&gt; | Resource name and hook creators |


<a class='md-heading-link' name="the-db-classes-the-d-b-hasResource" ></a>

### b.hasResource(resourceName) -> `boolean`

Check if resource exists

| Param | Type | Description |
| ----- | --- | -------- |
| resourceName | string |  |


<a class='md-heading-link' name="the-db-classes-the-d-b-updateVersion" ></a>

### b.updateVersion(version) -> `Promise.boolean`

Update database migration version

| Param | Type | Description |
| ----- | --- | -------- |
| version | string | Version string |


<a class='md-heading-link' name="the-db-classes-the-d-b-unref" ></a>

### b.unref() -> `TheDB`

Aut close before exit



