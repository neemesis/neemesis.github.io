---
layout: post
title: Dapper Tutorial - Part 1&colon; Dapper Intro and Installation
comments: true
categories: [ 'tutorial', 'install', 'dapper', 'micro', 'mine', 'orm', 'mssql', 'mysql' ]
lang: en-US
author: Mirche Toshevski
---
* [Dapper Tutorial - Part 1: Dapper Intro and Installation](https://neemesis.github.io/blog/2017/08/07/dapper-tutorial-1/)
* [Dapper Tutorial - Part 2: Dapper Queries](https://neemesis.github.io/blog/2017/08/08/dapper-tutorial-2/)
* [Dapper Tutorial - Part 3: Simple CRUD](https://neemesis.github.io/blog/2017/08/09/dapper-tutorial-3/)

Intro to **Dapper**
------
**Dapper** is simple object mapper written in .NET and titled by many **Number 1 Micro ORM**. In terms of speed it is almost as fast as raw **ADO.NET** data reader. Basically **Dapper** extends **IDbConnection** object and provides additional methods and interfaces for querying data.

How **Dapper** works
------
* Instantiate **IDbConnection** object
* Write query or call stored procedure
* Pass the query and the parameters to one of the methods that **Dapper** provide

Install **Dapper**
------
Easiest way to install **Dapper** is through **NuGet**. The command to install the package is **Install-Package Dapper**, but you can also install it from **NuGet Package Explorer**
![too](/assets/images/dt1_1.jpg 'NuGet Package Explorer')

Database Requirements
------
**Dapper** will work across all **.NET ADO** provider including:
* SQLite
* SQL CE
* Firebird
* Oracle
* MySQL
* PostgreSQL
* SQL Server

**Dapper** methods
------
New methods that **Dapper** brings to **IDbConnection** interface:
* **Execute**: Executes command one or many times and return number of affected rows.
* **Query**: Execute query or stored procedure and maps the result.
* **QueryFirst**: Execute query or stored procedure and maps the first result. Throws exception if nothing found.
* **QueryFirstOrDefault**: Execute query or stored procedure and maps the first result. If nothing found return default.
* **QuerySingle**: Execute query or stored procedure and maps the first result. Throws exception if there are more results or none.
* **QuerySingleOrDefault**: Execute query or stored procedure and maps the first result. Throws exception if there are more results.
* **QueryMultiple**: Execute multiple queries and map results.

Parameters for **Dapper** methods
------
* **Anonymous**: new {Id = itemId, Type = importType}
* **Dynamic**
<script src="https://gist.github.com/neemesis/dfb3ffa31353b7fa73408e9191065fc1.js"></script>
* **List**: new {IdList = new[]{item1Id, item2Id, item3Id} }
* **String**: new {Id = new DbString {Id = "item1Id", IsFixedLength = false, Length = 6, IsAnsi = true}}

What **Dapper** methods return?
------
* **Anonymous**
* **Strongly Typed**
* **Multi-Mapping**
* **Multi-Result**
* **Multi-Type**

**Dapper** speed
------
Performance of SELECT mapping over 500 iterations - POCO serialization

| Method | Duration |
|--------|--------|
|SqlDataReader|47ms|
|Dapper|49ms|
|ServiceStack.OrmLite|50ms|
|PetaPoco|52ms|
|BLToolkit|80ms|
|NHibernate SQL|104ms|
|SubSonic Coding Horror|107ms|
|Linq 2 SQL|181ms|
|Entity Framework|631ms|

Performance of SELECT mapping over 500 iterations - dynamic serialization

| Method | Duration |
|--------|--------|
|Dapper|48ms|
|Massive|52ms|
|Simple.Data|95ms|

Performance of SELECT mapping over 500 iterations - typical usage

| Method | Duration |
|--------|--------|
|Linq 2 SQL CompiledQuery|81ms|
|NHibernate HQL|118ms|
|Linq 2 SQL|559ms|
|Entity Framework|859ms|
|SubSonic ActiveRecord.SingleOrDefault|3619ms|

The performance benchmarks are available [here.](https://github.com/StackExchange/Dapper/tree/master/Dapper.Tests.Performance)

##### Source
* [Dapper GitHub](https://github.com/StackExchange/Dapper)
* [Dapper Tutorial](http://dapper-tutorial.net/dapper)