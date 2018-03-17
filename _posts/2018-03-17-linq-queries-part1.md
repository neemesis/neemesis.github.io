---
layout: post
title: LINQ Queries - 1
comments: true
categories: [ 'C#', 'LINQ' ]
lang: en-US
author: Mirche Toshevski
image: /assets/covers/c13.jpeg
image-sm: /assets/covers/c13s.jpeg
---
# Intro

**LINQ** is query language for **C#** and **VB** introduced in **.NET 3.5** and **VS 2008**. **LINQ** simplifies querying by offering one unified language to query different types of data sources. In order to use **LINQ** to query data source we need **LINQ provider**. Many providers are posted [**here**](https://blogs.msdn.microsoft.com/charlie/2006/10/05/links-to-linq/) and there is option to create our own providers, so basically you can query everything with the right provider. This means that a single query can be used to query data from DB, XML, lists etc..

# Query Syntax

**LINQ** queries can be written in two basic ways:

* **Query Expression Syntax**: similar to **SQL**

```csharp
var query =
    from student in students
    where student.Years > 20
    select student;
```

* **Method Extension Syntax**: extension methods defined for querying, that work with lamba expressions as parameter.

```csharp
var method = students.Where(x => x.Years > 20);
```

# Advantages of LINQ

* **One language - different sources**: **LINQ** can be used to query different data sources, without the need to learn data source specific language.
* **Readability**: easy to understand syntax.
* **Custom return data**: queried data can be shaped in any way we like.
* **Less code**: **LINQ** queries reduce the amount of **C#** code that is needed to acomplish the same thing.
* **IntelliSense**: errors, suggestions, etc..

# Initializing data

Let's create some classes and seed some random data so we can start querying :D.

```csharp
class Student {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Years { get; set; }
    public string City { get; set; }

    public Student(string name, int years, string city) {
        Id = Guid.NewGuid();
        Name = name;
        Years = years;
        City = city;
    }

    public override string ToString() {
        return $"[Student] Name: {Name}, Years: {Years}, City: {City}";
    }
}

class Subject {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Year { get; set; }

    public Subject(string name, int year) {
        Id = Guid.NewGuid();
        Name = name;
        Year = year;
    }

    public override string ToString() {
        return $"[Subject] Name: {Name}, Year: {Year}";
    }
}

class Enroll {
    public Guid StudentId { get; set; }
    public Guid SubjectId { get; set; }

    public Enroll(Student student, Subject subject) {
        StudentId = student.Id;
        SubjectId = subject.Id;
    }

    public override string ToString() {
        return $"[Enroll] Student: {StudentId}, Subject: {SubjectId}";
    }
}

class Exam {
    public Guid Id { get; set; }
    public Guid SubjectId { get; set; }
    public string Name { get; set; }

    public Exam(Subject subject, string name) {
        Id = Guid.NewGuid();
        SubjectId = subject.Id;
        Name = name;
    }

    public override string ToString() {
        return $"[Exam] Name: {Name}, Subject: {SubjectId}";
    }
}

class Result {
    public Guid StudentId { get; set; }
    public Guid ExamId { get; set; }
    public int Score { get; set; }

    public Result(Student student, Exam exam, int score) {
        StudentId = student.Id;
        ExamId = exam.Id;
        Score = score;
    }

    public override string ToString() {
        return $"[Result] Student: {StudentId}, Exam: {ExamId}, Score: {Score}";
    }
}
```

# Structure

Every **LINQ** query consists of three parts:

* Getting data
* Creating query
* Executing query

Simple **LINQ** query would look like this:

```csharp
// 1. getting data
var source = data.Students;

// 2. creating query
var query =
    from student in source
    where student.Years > 20
    select student;

// 3. executing
query.Print("Basic select");
```

The important part is **execution**, and that is because defined query is just stored as list of command and not executed until we start reading from it, and the term for this is **Deferred Execution**. If we want to execute the query immediately, we can use **ToList** or **ToArray** methods.

# Where

**Where** is used for filtering data using some criteria. There are two overloads for **Where**:

```csharp
Where<TSource>(IEnumerable<TSource>, Func<TSource, Boolean>)
// and
Where<TSource>(IEnumerable<TSource>, Func<TSource, Int32, Boolean>)
```

Simple usage:

```csharp
// query expression
var query1 =
    from student in students
    where student.Years > 20 && student.Years <= 22
    select student;

// method extension
var method1 = students.Where(x => x.Years > 20 && x.Years <= 22);
```

Using function for filtering:

```csharp
// defining inline function for filtering
bool FilterFunc1(Subject s) => s.Year > 2015 && s.Year < 2017;

var query2 =
    from subject in subjects
    where FilterFunc1(subject)
    select subject;

var method2 = subjects.Where(FilterFunc1);
```

**Where** can be used many times on the same result set.

# OrderBy, OrderByDescending, ThenBy, ThenByDescending, Reverse

Sorting list in ascending or descending order from one property or more.

**OrderBy**: first level order, ascending

```csharp
var query3 =
    from student in students
    where student.Years > 20 && student.Years <= 22
    orderby student.Name
    select student;

var method3 = students.Where(x => x.Years > 20 && x.Years <= 22).OrderBy(x => x.Name);
```

**OrderByDescending**: first level order, descending

```csharp
var query4 =
    from student in students
    where student.Years > 20 && student.Years <= 22
    orderby student.Name descending
    select student;

var method4 = students.Where(x => x.Years > 20 && x.Years <= 22).OrderByDescending(x => x.Name);
```

**ThenBy**: second level order, ascending

```csharp
var query5 =
    from student in students
    where student.Years > 20 && student.Years <= 22
    orderby student.Name, student.Years
    select student;

var method5 = students
    .Where(x => x.Years > 20 && x.Years <= 22)
    .OrderBy(x => x.Name)
    .ThenBy(x => x.Years);
```

**ThenByDescending**: second level order, descending

```csharp
var query6 =
    from student in students
    where student.Years > 20 && student.Years <= 22
    orderby student.Name descending , student.Years descending 
    select student;

var method6 = students
    .Where(x => x.Years > 20 && x.Years <= 22)
    .OrderByDescending(x => x.Name)
    .ThenByDescending(x => x.Years);
```

We can use **ThenBy** and **ThenByDescending** many times on the same result set.

**Reverse**: reverse entire list

```csharp
var query7 =
    (from student in students
    where student.Years > 20 && student.Years <= 22
    orderby student.Name descending, student.Years descending
    select student)
    .Reverse();

var method7 = students
    .Where(x => x.Years > 20 && x.Years <= 22)
    .OrderByDescending(x => x.Name)
    .ThenByDescending(x => x.Years)
    .Reverse();
```

# Average

**Average** is extenion method that calculates average from list of numbers.

```csharp
// calculates average years from all students
var extMethod1 = students.Average(x => x.Years);

// avg year from students whoose name starts with 'Stu'
var extMethod2 = students.Where(x => x.Name.StartsWith("Stu")).Average(x => x.Years);
```

# Single, SingleOrDefault

* **Single** is extension method that must return exactly one element from the list. If there are more then one or none, an exception is thrown.
* **SingleOrDefault** returns one element that match the criteria or default value if none. If there are more then one an exception is thrown.

```csharp
var extMethod3 = students.Single(x => x.Name == "Student 1");

var extMethod31 = students.SingleOrDefault(x => x.Name == "Student 1xy"); // returns null
```

# Sum

**Sum** is extenion method that sums list of numbers.

```csharp
// not sure why would you need a total sum of scores,
// but anyway this is how you would do sum :D
var extMethod4 = results.Sum(x => x.Score);

// filtering, then sum
var extMethod5 = results
    .Where(x => x.ExamId == exams.Single(y => y.Name == "Subject 1: Exam 1").Id)
    .Sum(x => x.Score);
```

# Count

**Count** returns number of elements that match some criteria

```csharp
// count all exams that have 100 score.
var extMethod6 = results.Count(x => x.Score == 100);

// count all exams for 'Student 1' that have 100 score.
var extMethod7 = results
    .Where(x => x.StudentId == students.Single(y => y.Name =="Student 1").Id)
    .Count(x => x.Score == 100);
```

# All

**All** iterates over all the elements and checks if some statement is true or not, returns true if all elements return true, otherwise false.

```csharp
// checks if all studnets have names
var extMethod8 = students.All(x => !string.IsNullOrEmpty(x.Name));
```

Can be paired with **Where**.

# Any

**Any** is similar to **All** but returns true if at least one element meets the requirements.

```csharp
// return true if at least one student doesn't have name
var extMethod9 = students.Any(x => string.IsNullOrEmpty(x.Name));
```

Can be paired with **Where**.

# Max / Min

* **Max** finds greatest number in list.
* **Min** finds lowest number in list.

```csharp
// oldest student
var extMethod10 = students.Max(x => x.Years);

// youngest student
var extMethod11 = students.Min(x => x.Years);
```

Both of them can be paired with **Where**.

# First, FirstOrDefault

* **First** returns first element of the list, or exception if the list is empty.
* **FirstOrDefault** returns first element or default if the list is empty.

We can apply lambda expressions to both functions.

```csharp
var extMethod12 = students.First();

var extMethod13 = students.First(x => x.Name.StartsWith("Stu"));
```

We can replace **First** with **FirstOrDefault**.

# Last, LastOrDefault

* **Last** returns last element of the list, or exception if the list is empty.
* **LastOrDefault** returns last element or default if the list is empty.

We can apply lambda expressions to both functions.

```csharp
var extMethod12 = students.Last();

var extMethod13 = students.Last(x => x.Name.StartsWith("Stu"));
```

We can replace **Last** with **LastOrDefault**.

# Skip, Take

* **Skip** returns array with first **n** elements removed.
* **Take** returns array with first **n** elements.

This two functions are used for pagging.

```csharp
var extMethod14 = students.Skip(5);

var extMethod15 = students.Take(5);

// remove first 5 elements, then take next 5 elements and return them
var extMethod16 = students.Skip(5).Take(5);
```

# SkipWhile, TakeWhile

* **SkipWhile** skips elements from beggining that pass some condition until the element that fails, and return everything else
* **TakeWhile** takes elements from beggining that pass some condition until the element that fails, and returns them.

We pass lambda expressions as arguments.

```csharp
var extMethod17 = students.SkipWhile(x => x.Years < 19);

var extMethod18 = students.TakeWhile(x => x.Years < 19);
```

# Union

**Union** combine two or more lists in one list, removing duplicate elements

```csharp
// not sure why would you need union from students and subjects names,
// but here it is :D
var extMethod19 = students.Select(x => x.Name).Union(subjects.Select(y => y.Name));
```

You can download the code from GitHub, or try to follow this post step by step.

# Concat

**Concat** appends one list to another, without checking for duplicate entries.

```csharp
var extMethod20 = students.Select(x => x.Name).Concat(subjects.Select(y => y.Name));
```

## [Open on GitHub](https://github.com/neemesis/LINQQueries/blob/master/LINQQueries/Part1.cs)

*Photo by eberhard grossgasteiger from Pexels https://www.pexels.com/photo/white-glacier-mountain-776390/*