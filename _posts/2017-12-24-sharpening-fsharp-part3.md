---
layout: post
title: Sharpening F#&colon; Part 3 - Sample App&colon; Consuming REST service
comments: true
categories: [ 'F#', 'Sharpening-F#' ]
lang: en-US
author: Mirche Toshevski
image: /assets/covers/c11.jpeg
image-sm: /assets/covers/c11s.jpeg
---
## Previous posts

* [**Part 1 - Installation and Intro**](http://mirchetoshevski.net/blog/2017/12/17/sharpening-fsharp-part1/)
* [**Part 2 - Records, lists, sequences…**](http://mirchetoshevski.net/blog/2017/12/17/sharpening-fsharp-part2/)
* **Part 3 - Sample App: Consuming REST service**

## Intro

In the previous two posts we saw some basic **F#** stuff, mostly syntax but also records, sequences, lists etc. Now we will continue with some more practical things.

## Description

The application will be Movies repository. I'll try to implement some basic project which will include: consuming REST api's, reading / writting to DB, web site and project layering. The project will be splitted in few posts and the first one (this one :)) will be defining of the models and querying [**TMDb**](https://www.themoviedb.org/) for data.

## TMDb

**The Movie Database (TMDb)** is community build database for movies and tv shows, it is incredibly developers friendly. They offer free API which is well [documented](https://developers.themoviedb.org/3/) and fairly simple to use.

### # Using TMDb

In order to use TMDb first we need to get our API key, which is required with every request.

* Register account on this [**link**](https://www.themoviedb.org/account/signup)
* Open API settings on this [**link**](https://www.themoviedb.org/settings/api)
* The API key that we will use is **API Key (v3 Auth)**

## Creating solution

Since we are going to have more projects that are interconnected we should start with creating solution. This is single command in **dotnet cli**

* Let's create **Movies** folder
* Open **PowerShell** in **Movies** folder
* Execute ```dotnet new sln --name Movies```

In your **Movies** folder you should have **Movies.sln** file. We will use the solution to manage all our projects as a single unit.

## Models project

First I will define some of the models that I'm going to use in the project, mostly for parsing responses from **TMDb**. Nice thing about **TMDb** is that they have defined schema for every response in the documentation. For example if we want to see the response schema for popular movies, we can open in documentation on [popular movies](https://developers.themoviedb.org/3/movies/get-popular-movies) and scroll down, we will see **Responses** section:
![Response section](/assets/images/sfsp3_1.png 'Response section')
Next to **Schema** is **Example** section containing sample response. And maybe the most useful feature is **Try it out** where we can enter all of the required parameters and send request directly from the browser.
![try it out](/assets/images/sfsp3_2.png 'try it out')
And at the end is **Code Generation** which generates code snippets for various languages, but unfortunately **F#** is not among them.

### # Creating Models project

Our **Models** project will be simple class library containing all of the models we need for **TMDb**

* Creating project from **dotnet cli**:
  * ```dotnet new classlib -n Movies.Models --lang F#```
* Add project reference in solution:
  * ```dotnet sln Movies.sln add Movies.Models/Movies.Models.fsproj```

If we open **Movies.sln** file, there should be reference to **Movies.Models** project.
![try it out](/assets/images/sfsp3_3.png 'try it out')

### # 'Movie' model

Let's write **F#** record that represents movie returned from **TMDb** ([link](https://developers.themoviedb.org/3/movies/get-movie-details)).

One **very important** thing to understand when programming in **F#** is that the order of importing and referencing files is important. If we have *FileB* that depends on *FileA*, in the project file, *FileA* should always be included before *FileB*. This is very different compared to **C#**, and proper planning is required to avoid breaking things :). The first type we want to implement is **Movie**, but before going and actually writting this down, we need to see what other types are contained in **Movie**. If we look at the schema, which looks like this:
![movie schema](/assets/images/sfsp3_4.png 'movie schema')
we can notice **array[object]** types, this means that **Movie** contains list of other types, so we need to define them first, before actually defining **Movie**. As we can see from the picture we need to implement first: *Genre*, *Company*, *Country*, *Language*.

* Create *Genre.fs*, *Company.fs*, *Country.fs*, *Language.fs* files in **Movies.Models** project.
* First we need to write up the *namespace* where we would like to 'group' our models, and that will be *Movies.Models* namespace. Namespace is the first line of the file.
* We define models by using *type* keyword, and annotate them with ```[<CLIMutable>]```.

For example *Genre.fs* should look like this:

```fsharp
namespace Movies.Models

[<CLIMutable>]
type Genre = {
    id: int;
    name: string;
}
```

Define other models like this by looking at **TMDb** schema.

Next we need to include all created files in *.fsproj* file.

Include using **VS Code**

* If you are using **VS Code** (which I highly recommend), open **Command Pallete** and write *F#: Add Current File To Project* press enter, and now your file should be added in **Movies.Models.fsproj**.

Include manualy, by editing *.fsproj* file.

* Open *Movies.Models.fsproj* file. By default there is already created *ItemGroup*  with included *Library.fs*.
* After *Library.fs* in a new row write ```<Compile Include="Genre.fs" />```
* Include other *.fs* files in the same fashion.

Since we created all models that *Movie* depends on, now we can continue to create *Movie.fs*.

* Create **Movie.fs** file in **Movies.Models** folder
* Enter the same namespace as in the other models, so they can be used in *Movie.fs*
* And write all variables from [*TMDb*](https://developers.themoviedb.org/3/movies/get-movie-details).

```fsharp
namespace Movies.Models
open System

[<CLIMutable>]
type Movie = {
    adult: bool;
    backrop_path: string;
    budget: int;
    genres: Genre list; // list of Genre
    homepage: string;
    id: int;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: double;
    poster_path: string;
    production_companies: Company list; // list of Company
    production_countries: Country list; // list of Country
    release_data: DateTime;
    revenue: int;
    runtime: int;
    spoken_languages: Language list; // list of Language
    status: string;
    tagline: string;
    title: string;
    video: bool;
    vote_average: double;
    vote_count: int;
}
```

Include *Movie.fs* in *Movies.Models.fsproj* file. Now we have our *Movie* model defined.

[*Movie.fs on GitHub*](https://github.com/neemesis/SharpeningFSharp/blob/master/Movies/Movies.Models/Movie.fs)

### # 'TV' model

We also want our application to work with TV Shows as well. Since [**TMDb**](https://developers.themoviedb.org/3/tv/get-tv-details) has api for this, we will use the same approach for this model from *Movie* model.

* Open schema from [**TMDb**](https://developers.themoviedb.org/3/tv/get-tv-details).
* Find all models that *TV* is dependant on and create them.
* Create *TV* model.
* Include all *.fs* files in *.fsproj* file.

[*TV.fs on GitHub*](https://github.com/neemesis/SharpeningFSharp/blob/master/Movies/Movies.Models/TV.fs)

## TMDb wrapper project

Now we have two models from *TMDb*, we can write some basic request for querying *TMDb*, and displaying data in our application.

### # Creating project

* Creating project from **dotnet cli**:
  * ```dotnet new classlib -n Movies.TMDB --lang F#```
* Add project reference in solution:
  * ```dotnet sln Movies.sln add Movies.TMDB/Movies.TMDB.fsproj```
* Add *Movies.Models* reference to *Movies.TMDB*
  * ```dotnet add Movies.TMDB/Movies.TMDB.fsproj reference Movies.Models/Movies.Models.fsproj```
* Add *FSharp.Data* package to the project:
  * ```dotnet add Movies.TMDB/Movies.TMDB.fsproj package FSharp.Data```
* Add *Newtonsoft.Json* for deserializing data:
  * ```dotnet add Movies.TMDB/Movies.TMDB.fsproj package Newtonsoft.Json```

### # Creating common *.fs* file

Since almost all request to *TMDb* are GET request and they all need *API Key* appended, we can create separate file in which we will define some generic *GET* function that will call from our library with different url and parameters, and the function will return string data (the response) back.

* Create *Constants.fs* in *Movies.TMDB*.
* Set the namespace to *module Movies.TMDB.Constants*.
* Set base url ```let BASEURL = "http://api.themoviedb.org/3/"```
* Set API key ```let APIKEY = "YOUR_API_KEY_FROM_TMDB"```

And our custom function will look like this:

```fsharp
// url: base url where to send request
// qry: list of key - value pairs
// method: GET / POST
// path: path variable
let makeRequest url (qry : (string * string) list) method path =
    let getQuery = ("api_key", APIKEY) :: qry // append api key to query parameters
    Http.RequestString(url + path, query = getQuery, httpMethod = method)
```

Include this file in *Movies.TMDB.fsproj* file.

### # Querying Movies from TMDb

Create *Movie.fs* file in *Movies.TMDB* folder. Here we will write all of the functions we need for communication with *TMDb*. At the beggining of the file set the namespace and the module name to *module Movies.TMDB.Movies*. Next open *Movies.Models* namespace and *Constants* module.

```fsharp
module Movies.TMDB.Movies
open Movies.TMDB.Constants
open Newtonsoft.Json
open Movies.Models
```

#### + Search by name function

Documentation of *search movies by name* is at this [*link*](https://developers.themoviedb.org/3/search/search-movies). Response schema for this request contains this properties: *page*, *results* (list of movies), *total_results*, *total_pages*. We need to define type so we can deserialize the response. I've created *FindMovies* in *Movies.Models* project.

[*FindMovies.fs on GitHub*](https://github.com/neemesis/SharpeningFSharp/blob/master/Movies/Movies.Models/FindMovies.fs)

*Search* function

```fsharp
let Search (x : string) =
    // we want first page of the results
    // x is the string that we are sending
    // SEARCHMOVIE is the url endpoint
    let qry = ["page", "1"; "query", x]
    let result = makeRequest SEARCHMOVIE qry "GET" ""
    // result is string response from TMDb
    let movies : FindMovies = JsonConvert.DeserializeObject<FindMovies>(result);
    // return movies back
    movies
```

#### + Get movie by ID

[Documentation link.](https://developers.themoviedb.org/3/movies/get-movie-details)

*Get* function

```fsharp
let Get (x : int) =
    // x is the ID of the movie and is path parameter
    // we dont have anything in our query parameters except API Key
    // so we send empty list and 'makeRequest' just append the key
    let result = makeRequest GETMOVIE List.empty "GET" (x.ToString())
    let movie = JsonConvert.DeserializeObject<Movie>(result);
    // return single movie
    movie
```

#### + Get movie reviews

We need to create [*Review*](https://github.com/neemesis/SharpeningFSharp/blob/master/Movies/Movies.Models/Review.fs) model first and [*ReviewsList*](https://github.com/neemesis/SharpeningFSharp/blob/master/Movies/Movies.Models/ReviewsList.fs).

[Documentation link.](https://developers.themoviedb.org/3/movies/get-movie-reviews)

*Reviews* function

```fsharp
// url: /movie/{movie_id}/reviews
let Reviews (x : int) =
    let result = makeRequest GETMOVIE List.empty "GET" (x.ToString() + REVIEWS)
    let reviews = JsonConvert.DeserializeObject<ReviewsList>(result);
    reviews
```

#### + Get images for movie

We need to create [*Backdrop*](https://github.com/neemesis/SharpeningFSharp/blob/master/Movies/Movies.Models/Backdrop.fs), [*Posters*](https://github.com/neemesis/SharpeningFSharp/blob/master/Movies/Movies.Models/Poster.fs) and [*ImageList*](https://github.com/neemesis/SharpeningFSharp/blob/master/Movies/Movies.Models/ImageList.fs).

[Documentation link.](https://developers.themoviedb.org/3/movies/get-movie-images)

*Images* function

```fsharp
// url: /movie/{movie_id}/images
let Images (x : int) =
    let result = makeRequest GETMOVIE List.empty "GET" (x.ToString() + IMAGES)
    let images = JsonConvert.DeserializeObject<ImageList>(result);
    images
```

#### + Get similar movies to movie

This function will return movies that are similar to given movie by sending movie ID and receiving *FindMovies* type.

[Documentation link.](https://developers.themoviedb.org/3/movies/get-similar-movies)

*Similar* function

```fsharp
// url: /movie/{movie_id}/similar
let Similar (x : int) =
    let result = makeRequest GETMOVIE List.empty "GET" (x.ToString() + SIMILAR)
    let movies : FindMovies = JsonConvert.DeserializeObject<FindMovies>(result);
    movies
```

#### + Get popular movies

This function will return top 20 popular movies right now.

[Documentation link.](https://developers.themoviedb.org/3/movies/get-popular-movies)

*Popular* function

```fsharp
// url: /movie/popular
let Popular =
    let result = makeRequest GETPOPULARMOVIES List.empty "GET" ""
    let movies : FindMovies = JsonConvert.DeserializeObject<FindMovies>(result);
    movies
```

We could also get:

* Latest: */movie/latest*
* Now playing: */movie/now_playing*
* Top rated: */movie/top_rated*
* Upcoming: */movie/upcoming*

[*Link to Movies.fs on GitHub*](https://github.com/neemesis/SharpeningFSharp/blob/master/Movies/Movies.TMDB/Movies.fs)

### # Querying TV Shows from TMDb

Our *TV.fs* implementation is almost identical to *Movies.fs* except for the endpoint URL's and the different types.

```fsharp
module Movies.TMDB.TV
open Movies.TMDB.Constants
open Newtonsoft.Json
open Movies.Models

let Get (x : int) =
    let result = makeRequest GETTV List.empty "GET" (x.ToString())
    let tv = JsonConvert.DeserializeObject<TV>(result);
    tv

let Images (x : int) =
    let result = makeRequest GETTV List.empty "GET" (x.ToString() + IMAGES)
    let images = JsonConvert.DeserializeObject<ImageList>(result);
    images

let Similar (x : int) =
    let result = makeRequest GETTV List.empty "GET" (x.ToString() + SIMILAR)
    let tvs : FindTV = JsonConvert.DeserializeObject<FindTV>(result);
    tvs

let Popular =
    let result = makeRequest GETPOPULARTV List.empty "GET" ""
    let tvs : FindTV = JsonConvert.DeserializeObject<FindTV>(result);
    tvs

let Search (x : string) =
    let qry = ["page", "1"; "query", x]
    let result = makeRequest SEARCHTV qry "GET" ""
    let tvs : FindTV = JsonConvert.DeserializeObject<FindTV>(result);
    tvs
```

[*Link to TV.fs on GitHub*](https://github.com/neemesis/SharpeningFSharp/blob/master/Movies/Movies.TMDB/TV.fs)

## Testing everything up

To test everything we wrote here, let's create simple console app.

* Creating project from **dotnet cli**:
  * ```dotnet new console -n Movies.Test --lang F#```
* Add project reference in solution:
  * ```dotnet sln Movies.sln add Movies.Test/Movies.Test.fsproj```
* Add *Movies.Models* reference
  * ```dotnet add Movies.Test/Movies.Test.fsproj reference Movies.Models/Movies.Models.fsproj```
* Add *Movies.TMDB* reference
  * ```dotnet add Movies.Test/Movies.Test.fsproj reference Movies.TMDB/Movies.TMDB.fsproj```

Now in *Program.fs* we can open our modules and call the functions to test them.

```fsharp
open System
open Movies.Models
open Movies.TMDB

[<EntryPoint>]
let main argv =
    let searchedMovies = Movies.Search "Zodiac"
    let movie = Movies.Get 550
    let reviews = Movies.Reviews 550
    let images = Movies.Images 550
    let similar = Movies.Similar 550
    let popular = Movies.Popular
    let tv = TV.Get 1399
    let tvImages = TV.Images 1399
    let tvSimilar = TV.Similar 1399
    let tvPopular = TV.Popular
    let tvSearch = TV.Search "Doctor Who"
    0 // return an integer exit code
```

## Final

You can download the code from GitHub, or try to follow this post step by step.

## [Open on GitHub](https://github.com/neemesis/SharpeningFSharp/tree/master/Movies)


*Photo by Riccardo Bresciani from Pexels https://www.pexels.com/photo/autumn-car-color-environment-228095/*