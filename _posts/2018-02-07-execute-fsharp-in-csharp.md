---
layout: post
title: Execute F# code in C# Program
comments: true
categories: [ 'C#', 'F#' ]
lang: en-US
author: Mirche Toshevski
image: /assets/covers/c12.jpeg
image-sm: /assets/covers/c12s.jpeg
---
## Intro

Functional programming is getting more and more attention lately, mostly because GPU's and multi-core processors all use parallel execution for performance and the fact that functional languages encourage the use of immutable data, that prevents many errors in writting parallel code. Many modern OO languages have implemented a way of doing functional proggraming like **LINQ** in **C#**.

## Benefits of Functional Programming

Functional programming is very appealing due to:

* **Convenience**: type definitions, comparisons, states, equality, etc are much simpler in functional languages.
* **Concurrency**: asynchronous programming is directly supported.
* **Brevity**: functional code is more concise.

## Problem

This all sounds good but how can we use this in our **C#** programs?

## F# and .NET

The greatest benefit from **F#**, is **F#** being **CLR** language and with that you can use everything from the appropriate **.NET** framework. Here I will create simple VS solution that show how **F#** is used in a **C#** application.

## Solution

I will create simple **C#** console application, with separate domain library, and **F#** class library.

### C# Domain Library

* Create new solution and add **C# Class Library** targeting **.NET Standard 2.0** and name it **Domain**.
* Create new class **Person.cs**.

```csharp
public class Person {
    public string Name { get; set; }
    public int Height { get; set; }
    public int Years { get; set; }

    public Person(string name, int height, int years) {
        Name = name;
        Height = height;
        Years = years;
    }
}
```

This is all we are going to need.

### F# Class Library

* Add new **F# Class Library** project to the solution named **FSharp**.
* Add reference to the **Domain** project.
* Lets write some functions in **Library.fs**.

First define the namespace:

```fsharp
namespace FSharp
```

Then create module:

```fsharp
module Say =
```

Now write some functions:

```fsharp
// returning string
let hello name =
    "Hello " + name

// calculating average height from Person list
let avgHeight xs =
    let sum = xs |> List.sumBy (fun (x : Person) -> x.Height) |> double
    let length = List.length xs |> double
    sum / length
```

### C# Console Application

Let's try out the **F#** class project.

* Create **C# Console Application**.
* Add reference to **Domain** and **FSharp** projects.

Lets try ```hello``` function (w/o parameters):

```csharp
var helloFsharp = FSharp.Say.hello("C#");
Console.WriteLine(helloFsharp);
// prints 'Hello C#'
```

Now ```avgHeight``` that needs list of Person objects. First lets initialize list of ```Person``` objects:

```csharp
var personList = new List<Person> {
    new Person("Person  1", 160, 22),
    new Person("Person  2", 172, 45),
    new Person("Person  3", 196, 63),
    new Person("Person  4", 154, 18),
    new Person("Person  5", 178, 64),
    new Person("Person  6", 187, 35),
    new Person("Person  7", 169, 27),
    new Person("Person  8", 186, 45),
    new Person("Person  9", 167, 36),
    new Person("Person 10", 190, 65),
};
```

If we want to send this list as argument, first we need to convert it to **F#** list (FSharpList). This is very easy since there is package (Microsoft.FSharp.Collections.ListModule) in **C#** that do this:

```csharp
// converting list
var fsharpList = ListModule.OfSeq(personList);
```

And now we can call the function for a result:

```csharp
var result = FSharp.Say.avgHeight(fsharpList);
// result: 175.9
```

## Conclusion

It is very easy to use **F#** in **C#** programs, and there are some nice reasons why you should. Next time you encounter some problems that are easier to solve using functional programming, try **F#**.

## Info

You can download the code from GitHub, or try to follow this post step by step.

## [Open on GitHub](https://github.com/neemesis/CFInterop)

*Photo by kagee vi.xii.xcvii from Pexels https://www.pexels.com/photo/male-peacock-photography-808533/*