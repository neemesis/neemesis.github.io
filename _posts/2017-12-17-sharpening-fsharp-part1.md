---
layout: post
title: Sharpening F#&colon; Part 1 - Installation and Intro
comments: true
categories: [ 'sharpeningfsharp', 'mine', 'fsharp', 'net', 'functional', 'intro' ]
lang: en-US
author: Mirche Toshevski
---

## Posts
* **Part 1 - Installation and Intro**
* [**Part 2 - Records, lists, sequences…**](https://neemesis.github.io/blog/2017/12/17/sharpening-fsharp-part2/)

## Intro 
**F#** is mature, open source, cross-platform, functional programming language. **F#** is developed by [**F# Software Foundation**](http://foundation.fsharp.org/) and [**Microsoft**](https://docs.microsoft.com/en-us/dotnet/fsharp/). **F#** is a **meta language** and is implementation of **OCaml** for **.NET framework**. You can read more about it at [**Wikipedia**](https://goo.gl/D5S3r1) and [**F# Software Foundation**](http://fsharp.org/).

## Installation
There is a very comprehensive guide on the official site, so I will just post the links here.
- [F# on Mac](http://fsharp.org/use/mac/)
- [F# on Linux](http://fsharp.org/use/linux/)
- [F# on Windows](http://fsharp.org/use/windows/)
- [F# on Android](http://fsharp.org/use/android/)
- [F# on iOS](http://fsharp.org/use/ios/)
- [F# on JS/HTML](http://fsharp.org/use/html5/)
- [F# on GPU](http://fsharp.org/use/gpu/)
- [F# on FreeBSD](http://fsharp.org/use/freebsd/)
- [F# on Web](http://fsharp.org/use/web/)

*Note: These tutorials will be presented in [Visual Studio Code](https://code.visualstudio.com/) on Windows*

## Resources
You can find a lot of code snippets at [**F# Snippets**](http://fssnip.net/). And if you want to try out the language without installing anything you can always go to [**Try F#**](http://www.tryfsharp.org/). Also the official documentation is at [**F# Guide**](https://docs.microsoft.com/en-us/dotnet/fsharp/) and [**F# Language Reference**](https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/)

## Creating new project
Since we are going to use **VS Code**, I'll try to use as musch as I can **dotnet CLI**.
- First create folder where you will put you solution
- Open **PowerShell / Terminal** to that location
- The command for creating new **SLN** file is: ```dotnet new sln -n [NAME]```
- Create new console application: ```dotnet new console -n [NAME] -lang F#```
- Now lets add our console application to the solution: ```dotnet sln [NAME].sln add [PATH/TO/APP].fsproj```
- Let's build the project: ```dotnet build```
- Start the console application with: ```dotnet run --project [NAME]```

Usually **F#** programs don't have entry point which means everything is executed from top to bottom, but in case of console applications like this there is special annotation that marks function as entry point ```[<EntryPoint>]```. The created project structure should look something like this
![Project structure](/assets/images/sfsp1_1.png 'Project structure')
and the content of **Program.fs** will be
![Project structure](/assets/images/sfsp1_2.png 'Project structure')

## Data types in F#

| FSharp Type | .NET Type | Example |
|-------------|-----------|---------|
|sbyte|System.SByte|4y|
|byte|System.Byte|6uy|
|int16|System.Int16|10s|
|uint16|System.UInt16|80us|
|int|System.Int32|325|
|uint32|System.UInt32|325u|
|int64|System.Int64|9874L|
|uint64|System.UInt64|98741UL|
|float, double|System.Double|2.01|
|float32, single|System.Single|2.0f|
|nativeint|System.IntPtr|324n|
|unativeint|System.UIntPtr|324un|
|decimal|System.Decimal|324m|
|bigint|Microsoft.FSharp.Math.BigInt|123I|
|char|System.Char|'a'|
|string|System.String|"abc"|
|bool|System.Bool|true|

**F#** has very strong type inference mechanism, which means in most cases the compiler will know the type. Let see this in few examples

```fsharp
let varSbyte = 4y		// sbyte
let varByte = 6uy		// byte

let varInt16 = 10s		// int16
let varUint64 = 98741UL		// uint64

let varNativeint = 324n		// nativeint
let varDecimal = 324m		// decimal

let varBigint = 123I		// bigint
    
let varChar = 'a'		// char
let varString = "abc"		// string

let varBool = true		// boolean
```

## Variables
Variables in **F#** are immutable, once they are bound to a value, they can't be changed. They are compiled as static read-only properties. In case you need mutable variable, then we can use **mutable** keyword for such variable. Declaring variables in **F#** is done with **let** keyword.

```fsharp
let a = 10				// a: 10
let b = 15				// b: 15
let c = a + b				// c: 25
```

If we need to specify type of the variable we can do it like this
```fsharp
let a : int32 = 10			// a: 10
let b : int32 = 15			// b: 15
let c : int32 = a + b			// c: 25
```

Specifying mutable variables
```fsharp
let mutable d = 10		// d: 10
d <- 15				// d: 15
d <- 30				// d: 30
```

## Operators
#### Arithmetic Operators
```fsharp
let x = 20
let y = 10
let z = 5I

let add = x + y
let sub = x - y
let mul = x * y
let div = x / y
let modu = x % y
let exp = z ** y

// result: 30, 10, 200, 2, 0, 9765625
```

#### Comparison operators
```fsharp
let u = 20
let p = 10

let equ = u = p
let dif = u <> p
let grl = u > p
let grr = u < p
let gel = u >= p
let ger = u <= p

// result: false, true, true, false, true, false
```

#### Bolean operators
```fsharp
let i = true
let o = false

let band = i && o
let bor = i || o
let bnot = not (i && o)

// result: false, true, true
```

#### Bitwise operators
```fsharp
let s = 20
let d = 14

let binaryAdn = s &&& d
let binaryOr = s ||| d
let binaryXor = s ^^^ d
let binaryOnesComplement = ~~~ s
let binaryLeftShift = s <<< 2
let binaryRightShift = d >>> 2

// result: 4, 30, 26, -21, 80, 3
```

## Control statements
```fsharp
// if - then
if s > 0 then printfn "S is larger then 0"

// if - then - else
if s = d then printfn "S == D"
else printfn "S != D"

// if - then - elif - else
if s = 0 then printfn "S == 0"
elif s > 0 then printfn "S > 0"
else printfn "S < 0"

// nested statements
if s > 0 then 
	if d < 100 then printfn "S > 0 and D < 100"
	elif d > 100 then printfn "S > 0 and D > 100"
	else printfn "S > 0 and D == 100"
else printfn "S <= 0"
```

## Loops
```fsharp
for it = 0 to 15 do
	printf "%A " it
// result: 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
    
for it = 15 downto 0 do
	printf "%A " it
// result: 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 0
    
for ch in "abcdefg" do // or array
	printf "%A " ch
// result: 'a' 'b' 'c' 'd' 'e' 'f' 'g'

let mutable it2 = 10
while it2 > 0 do
	printf "%A " it2
	it2 <- it2 - 1
// result: 10 9 8 7 6 5 4 3 2 1

for it = 0 to 3 do
	for it2 = 3 downto 0 do
		printf "%A - %A" it it2
// result: [0-3][0-2][0-1][0-0][1-3][1-2][1-1][1-0][2-3][2-2][2-1][2-0][3-3][3-2][3-1][3-0]
```

## Functions
In **F#** functions are like data types, we need to declare them like a variable, and use them in the sam way as variables. Syntax for defining functions is
```fsharp
// Non-recursive function definition.
let [inline] function-name parameter-list [ : return-type ] = function-body
// Recursive function definition.
let rec function-name parameter-list = recursive-function-body
```
- **function-name**: is the name of the function
- **parameter-list**: list of parameters separated by space
- **function-body**: F# expressions
- **return-type**: optional return type, if not specified compiler determines the return type

Examples of functions
```fsharp
let multiplyBy2 x = x * 2

let res1 = multiplyBy2 8
let res2 = multiplyBy2 10
printfn "%A, %A" res1 res2 // 16, 20

let multiply x y = x * y

let res3 = multiply 2 3
let res4 = multiply 8 9
printfn "%A, %A" res3 res4 // 6, 72

// defining recursive fibonacci
let rec fib n = if n < 2 then 1 else fib (n - 1) + fib (n - 2)

let res5 = fib 4
let res6 = fib 10
printfn "%A, %A" res5 res6 // 5, 89
```
The important thing to notice when writting functions in **F#** is the arrow notation
![Arrow notation](/assets/images/sfsp1_3.png 'Arrow notation')
we can see here: **int -> int -> int** this means this function takes two int varables and returns int variable.

#### Composing and pipelining functions
Composing means creating one function from other functions, and pipelining means transfering result from one function to another
```fsharp
let add5 x = x + 5
let mul10 x = x * 10
let sub3 x = x - 3

let compositeFunction = add5 >> mul10 >> sub3

let res7 = compositeFunction 10
printfn "%A" res7 // (10 + 5) * 10 - 3 = 147

// pipelining of functions
let res8 = 10 |> add5 |> sub3 |> mul10
printfn "%A" res8 // (10 + 5 - 3) * 10 = 120
```

## Options
Options in **F#** are used when there may not exist a value for some variable. An variable marked with **option** has value of **None** or **Some(value)**
```fsharp
let returnsOption x = 
	if x > 0 then Some(x)
	else None

let res9 = returnsOption 10
let res10 = returnsOption -10
printfn "%A, %A" res9 res10 // Some 10, <null>
```

## Tuples
Tuple is comma - separated values, containg one or more values.
```fsharp
let res11 = ("Name", 2017, 3, 2)
printfn "%A" res11 // ("Name", 2017, 3, 2)

// matching tuples
let printTuple x =
	match x with
	| (name, year, month, day) -> printfn "Name: %A, Year: %A, Month: %A, Day %A" name year month day

printTuple res11 // Name: "Name", Year: 2017, Month: 3, Day 2
```

## Final
You can download the code from GitHub, or try to follow this post step by step.

# [Open on GitHub](https://github.com/neemesis/SharpeningFSharp/tree/master/Part1)