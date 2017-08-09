---
layout: post
title: Dapper Tutorial - Part 2&colon; Dapper Queries
comments: true
categories: [ 'tutorial', 'install', 'dapper', 'micro', 'mine', 'orm', 'mssql', 'mysql' ]
lang: en-US
author: Mirche Toshevski
---
* [Dapper Tutorial - Part 1: Dapper Intro and Installation](https://neemesis.github.io/blog/2017/08/07/dapper-tutorial-1/)
* [Dapper Tutorial - Part 2: Dapper Queries](https://neemesis.github.io/blog/2017/08/08/dapper-tutorial-2/)
* [Dapper Tutorial - Part 3: Simple CRUD](https://neemesis.github.io/blog/2017/08/09/dapper-tutorial-3/)

Setup
-------
First we need to create connection to the database:
```csharp
public IDbConnection Db => new SqlConnection(_options.DefaultConnection);
```
**DefaultConnection** is our default **connectionString**. We will use **Db** for all queries.

Single table query
------
Selecting all the object from the table and mapping them to class
```csharp
var result = Db.Query<Models.Model>("select * from Models");
```
and the result is (JSON printed)
```json
[
  {
    "Id": 1,
    "Name": "CL_MODELS",
    "Title": "CL Models (4)",
    "SViews": 0,
    "BrandId": 1,
    "Brand": null
  },
  {
    "Id": 2,
    "Name": "2.2CL",
    "Title": " - 2.2CL",
    "SViews": 0,
    "BrandId": 1,
    "Brand": null
  },
  ...
]
```
as we can see we have our **Model**'s but **Brand** is missing. Luckilly Dapper can map multiple object from same row.

Multi table query
------
The best use case for this type of query is when we have **1:1** relations
```csharp
var result = Db.Query<Models.Model, Models.Brand, Models.Model>(
"select top 10 * from Models left join Brands on Models.BrandId = Brands.Id",
	(m, b) => { m.Brand = b;
    return m;
});
```
and the result is 
```json
[
  {
    "Id": 1,
    "Name": "CL_MODELS",
    "Title": "CL Models (4)",
    "SViews": 0,
    "BrandId": 1,
    "Brand": {
      "Id": 1,
      "Name": "ACURA",
      "Title": "Acura",
      "SViews": 0,
      "CountryId": null,
      "Country": null
    }
  },
  {
    "Id": 2,
    "Name": "2.2CL",
    "Title": " - 2.2CL",
    "SViews": 0,
    "BrandId": 1,
    "Brand": {
      "Id": 1,
      "Name": "ACURA",
      "Title": "Acura",
      "SViews": 0,
      "CountryId": null,
      "Country": null
  },
  ...
]
```
The syntax for querying multiple tables is
```csharp
var result = Db.Query<TClass1, TClass2, ..., TClassN, TResult>(
"select * from Table1 
 left join TResult on TResult.T2Id = Table2.Id
 ...
 left join TableN on TableM.TNId = TableM.Id",
 (tres, tc2, ..., tcN) => { 
    	tres.TC2 = tc2;
        ...
        tres.TCM = tcN;
    	return tres;
 });
```
you can use other join's as well. The main thing here is that **TClass1** should correspond to **Table1**. **Dapper** splits row on **Id** column by default if you have tables with other name for **Id** you should use **splitOn** variable in **Query** method, like this
```csharp
var result = Db.Query<Model1, Model2, ..., ModelN, ModelResult>(stringQuery, mappingFunction, splitOn: "Id, ColumnId, AnotherId");
```

Get single row
------
```csharp
var result = Db.QuerySingle<Models.Model>("select * from Brands where Id = 15");
```
returns
```json
{
    "Id": 35,
    "Name": "LAN",
    "Title": "Lancia",
    "SViews": 0,
    "BrandId": 0,
    "Brand": null
}
```

Working with parameters
------
Using parameters while querying database. I'm using console application for all the examples.
```csharp
var id = Console.ReadLine();
var result = Db.QuerySingle<Models.Model>("select * from Brands where Id = @Id", new {Id = id});
```
returns
```json
{
    "Id": 20,
    "Name": "FIAT",
    "Title": "FIAT",
    "SViews": 0,
    "BrandId": 0,
    "Brand": null
}
```
this way you can pass all the parameters you need.

Querying scalar values
------
We can also query scalar values, this is usefull if we need to count entries for specific query
```csharp
var count = Db.ExecuteScalar<int>("select count(*) from Countries");
```
and the result is integer value of **246**.

Stored Procedures
------
**Dapper** also allow us to execute and map stored procedures in the same way we did with queries.
```sql
create procedure [dbo].[spGetModelsForBrand] @Id int as
select * from Models where BrandId = @Id
```
and then we can call it like this
```csharp
var id = Console.ReadLine();
var result = Db.Query<Models.Model>("spGetModelsForBrand", new { Id = id },
                            commandType: CommandType.StoredProcedure)
```
and the result is
```json
[
  {
    "Id": 596,
    "Name": "AMIGO",
    "Title": "Amigo",
    "SViews": 0,
    "BrandId": 30,
    "Brand": null
  },
  {
    "Id": 597,
    "Name": "ASCENDER",
    "Title": "Ascender",
    "SViews": 0,
    "BrandId": 30,
    "Brand": null
  },
  {
    "Id": 598,
    "Name": "AXIOM",
    "Title": "Axiom",
    "SViews": 0,
    "BrandId": 30,
    "Brand": null
  },
  {
    "Id": 599,
    "Name": "HOMBRE",
    "Title": "Hombre",
    "SViews": 0,
    "BrandId": 30,
    "Brand": null
  },
  ...
]
```
we can also map **Brands** table in the stored procedure like we did before in query.

Multiple Results
------
We can also select multiple result sets and map them separately
```csharp
var sql = @"select top 2 * from Brands
			select top 2 * from Models
            select top 2 * from Countries";
using (var many = Dapper.Db.QueryMultiple(sql)) {
	var brands = many.Read<Models.Brand>().ToList();
    var models = many.Read<Models.Model>().ToList();
    var countries = many.Read<Models.Country>().ToList();
}
```
and the result is
Brands
Total: 2
```json
[
  {
    "Id": 1,
    "Name": "ACURA",
    "Title": "Acura",
    "SViews": 0,
    "CountryId": null,
    "Country": null
  },
  {
    "Id": 2,
    "Name": "ALFA",
    "Title": "Alfa Romeo",
    "SViews": 0,
    "CountryId": null,
    "Country": null
  }
]
```
Models
Total: 2
```json
[
  {
    "Id": 1,
    "Name": "CL_MODELS",
    "Title": "CL Models (4)",
    "SViews": 0,
    "BrandId": 1,
    "Brand": null
  },
  {
    "Id": 2,
    "Name": "2.2CL",
    "Title": " - 2.2CL",
    "SViews": 0,
    "BrandId": 1,
    "Brand": null
  }
]
```
Countries
Total: 2
```json
[
  {
    "Id": 1,
    "Short": "AF",
    "Name": "Afghanistan",
    "PhoneCode": "93",
    "SViews": 0
  },
  {
    "Id": 2,
    "Short": "AL",
    "Name": "Albania",
    "PhoneCode": "355",
    "SViews": 0
  }
]
```