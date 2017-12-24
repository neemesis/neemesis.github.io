---
layout: post
title: Sharpening F#&colon; Part 2 - Records, lists, sequences…
comments: true
categories: [ 'F#', 'Sharpening-F#' ]
lang: en-US
author: Mirche Toshevski
image: /assets/covers/c5.jpg
image-sm: /assets/covers/c5s.jpg
---

## Previous posts
* [**Part 1 - Installation and Intro**](http://mirchetoshevski.com/blog/2017/12/17/sharpening-fsharp-part1/)
* **Part 2 - Records, lists, sequences…**
* [**Part 3 - Sample App: Consuming REST service**](http://mirchetoshevski.com/blog/2017/12/24/sharpening-fsharp-part3/)

## Intro 
This post will be extension to the previous one, as we will continue to explore other features of **F#**.

## Records / Types
Previous post ended with **tuples**, they are very usefull in many cases. The downside of tuples is that they are predefined, and it is hard to see what represents what - they lack naming / labels. **Records** are 'labeled' tuples.
```fsharp
type Season = {
    id: int;
    aid_date: DateTime;
    episode_count: int;
    poster_path: string;
    season_number: int;
}

// constructing record
let season1 = { id = 1; aid_date = DateTime.Now; episode_count = 3; poster_path = "some/url"; season_number = 1 }

// deconstructing record
let { id = sId; season_number = seasonNo } = season1
printfn "%A, %A" sId seasonNo // 1, 1

// accessing properties
printfn "%A, %A, %A" season1.id season1.episode_count season1.season_number
// result: 1, 3, 1
```
Important thing to notice: when you constructing type you need to specify all the properties, but when you deconstructing type, you can specify any number of properties.

## Lists
In **F#** list is ordered, immutable collection of related values and is equal to linked list in other languages.
```fsharp
let emptyList = []
let fixedList = [2; 4; 6; 8; 10]

// using List.init function
// generate 8 elements using this function
let listInit = List.init 8 (fun index -> index * 6)
// result: [0; 6; 12; 18; 24; 30; 36; 42]

// using range
let rangeList = [20 .. 28]
// result: [20; 21; 22; 23; 24; 25; 26; 27; 28]

let alphaList = ['x' .. 'z']	// ['x'; 'y'; 'z']

// using yield
let yieldList = [ for x in 8 .. 12 do yield x * x * 2 ]
// result: [128; 162; 200; 242; 288]

// add element at begining 
let consList = 1 :: rangeList
// result: [1; 20; 21; 22; 23; 24; 25; 26; 27; 28]

// add more elements
let consList2 = 1 :: 2 :: 3 :: rangeList
// result: [1; 2; 3; 20; 21; 22; 23; 24; 25; 26; 27; 28]

// concatenate two lists
let concatList = fixedList @ rangeList
// result: [2; 4; 6; 8; 10; 20; 21; 22; 23; 24; 25; 26; 27; 28]

// list properties
printfn "%A, %A, %A, %A, %A" concatList.Head concatList.IsEmpty concatList.Length concatList.Tail (concatList.Item 3)
// result: 2, false, 14, [4; 6; 8; 10; 20; 21; 22; 23; 24; 25; 26; 27; 28], 8

// list reversing
let reversedList = List.rev fixedList
// result: [10; 8; 6; 4; 2]

// list filtering
let filteredList = concatList |> List.filter (fun x -> x % 3 = 1)
// result: [4; 10; 22; 25; 28]

// map list to another list
let mappedList = fixedList |> List.map (fun x -> ("V: " + (x / 2).ToString()))
// result: ["V: 1"; "V: 2"; "V: 3"; "V: 4"; "V: 5"]
```

## Sequences
**Sequences** are similar to **lists** they also represent ordered collection of values, but unlike **lists**, **sequences** are computed as they are needed.
```fsharp
// sequences are defined using this syntax
seq { expr }

// range sequence
let rangeSeq = seq { 20 .. 50 }
// result: seq [20; 21; 22; 23; ...]
// as we can see only the first four values are computed

// backwards sequence by two
let skipSeq = seq { 50 .. -2 .. 20 }
// result: seq [50; 48; 46; 44; ...]

// we can also use functions as in lists
let funcSeq = seq { for x in 20 .. 30 do yield x * x / 2 }
// result: seq [200; 220; 242; 264; ...]

// get element from sequence
let elementSeq = Seq.item 8 funcSeq
// result: 392

// appending two sequences
let appendSeq = Seq.append funcSeq funcSeq
// result: seq [200; 220; 242; 264; ...]

// sequence distinct
let distinctSeq = Seq.distinct (seq [5;5;5;5;6;6;6;6])
// result: seq [5; 6]

// map sequence
let mapSeq = Seq.map (fun x -> x + 2) (seq [1;2;3;4;5;6])
// result: seq [3; 4; 5; 6; ...]
```

## Sets
**Sets** in **F#** are much like data containers, storing *distinct* data.
```fsharp
// creating sets
let fromEmptySet = Set.empty.Add(7).Add(3).Add(6).Add(1).Add(3)
// result: set [1; 3; 6; 7]

let fromListSet = Set.ofList [1 .. 10]
// result: set [1; 2; 3; 4; 5; 6; 7; 8; 9; ...]

let fromSeqSet = Set.ofSeq (seq { 1 .. 2 .. 10 })
// result: set [1; 3; 5; 7; 9]

// set difference
let diffSet = Set.difference fromListSet fromSeqSet
// result: set [2; 4; 6; 8; 10]

// set iteration
Set.iter (fun x -> printf "[%A]" x) diffSet
// prints: [2][4][6][8][10]

// check if set is subset
let isSubset = Set.isSubset diffSet fromListSet
// result: true

// union of two sets
let unionSet = fromListSet + fromSeqSet
// result: set [1; 2; 3; 4; 5; 6; 7; 8; 9; ...]
```

## Maps
**Maps** are similar to **sets** but they associate *keys* with *values*.
```fsharp
// creating map
let fromEmptyMap = Map.empty.Add("Key1", 1).Add("Key2", 2)
// result: map [("Key1", 1); ("Key2", 2)]

// accessing elements
let elementMap = fromEmptyMap.["Key1"]
// result: 1

// map from list
let fromListMap = Map.ofList ([("A", 1); ("B", 2); ("C", 3);])
// result: map [("A", 1); ("B", 2); ("C", 3)]
```

## Enumerations
**F#** enums are same as **C#** enums.
```fsharp
// defining enums
type Status = Invoked = 0 | Started = 1 | Processing = 2 | Finished = 3
type CharStatus = Invoked = 'i' | Started = 's' | Processing = 'p' | Finished = 'f'

let invokedEnum = Status.Invoked		// result: Invoked
let finishedCharEnum = CharStatus.Finished	// result: Finished
```

## Final
You can download the code from GitHub, or try to follow this post step by step.

# [Open on GitHub](https://github.com/neemesis/SharpeningFSharp/tree/master/Part2)