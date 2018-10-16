---
layout: post
title: Creating simple OWIN pipeline with Nancy
comments: true
categories: [ 'C#', 'LINQ', 'Nancy', 'OWIN' ]
lang: en-US
author: Mirche Toshevski
image: /assets/covers/c13.jpeg
image-sm: /assets/covers/c13s.jpeg
---

# Intro

[**OWIN (Open Web Interface for .NET)**](http://owin.org/) is a standard for an interface between **.NET Web applications** and **Web servers**. **Nancy** is lightweight framework for building HTTP based services on **.NET**. This post will contain two main points, first creating simple **OWIN** pipline, and second implementing **Nancy** on top of it.

# Creating simple OWIN pipeline

To make this as simple as we can, we will use **ASP.NET empty template**. The empty template comes with a bare minimum dependencies and web.config just so we can run it. In order for this to be OWIN-based application we need to add some references, specifically **OWIN server** so we can host it in **IIS**.  

Install **Microsoft.Owin.Host.SystemWeb** from NuGet.  
```Install-Package Microsoft.Owin.Host.SystemWeb```

Now in order to make our application to be OWIN-application we need to have startup class to serve as entry point. We have few approaches of connecting our startup class with the runtime:

* **Naming Convention**: just create **Startup** class in base of the project with namespace that matches assembly name or the global namespace.
* **OwinStartup Attribute**: create class with any name and add attribute to it, where type will be the namespace of our class.  
    ```[assembly: OwinStartup(typeof(TestProject.Startup2))]```
* **appSettings**: add new key with **owin:appStartup** and for value put the namespace of the class i.e:  
    ```<add key="owin:appStartup" value="TestProject.Startup2" />```

I will use the first approach with naming convention. Now that we are connected with the runtime, we will need a way to configure OWIN pipeline and register new middleware. OWIN makes this possible with method called **Configuration(IAppBuilder)** that we need to implement in our **Startup** class.

```csharp
// Startup.cs
namespace TestEmpty {
    public class Startup {
        public void Configuration(IAppBuilder app) {

        }
    }
}
```

We will register simple middleware that will return simple _Hello World!_ message.

```csharp
// context: IOwinContext with request and response fields
// next: AppFunc with next middleware that should be executed
app.Use((context, next) => { return context.Response.WriteAsync("Hello World!"); });
```

Now if we run our application we will receive _Hello World!_ message in the browser.

# Adding Nancy to our OWIN application

Nancy doesn't have any dependencies on existing frameworks so we will need a reference to Nancy and also Nancy.Owin. 

## Installing Nancy

We can install Nancy.Owin package and it will automatically install Nancy as a dependency.

```Install-Package Nancy.Owin```

## Creating modules

Modules are the lynchpin of any given Nancy application. Create folder named **Modules**, and create some test class so we can try out Nancy, i.e. **TestModule**. In order for NancyFx to recognize our class as a valid Nancy module we need to declare it public and inherit from **NancyModule**. Now we need to define what routes this module will handle.

```csharp
public class TestModule : NancyModule {
    public TestModule() {
        Get["/test"] = parameters => "Hello World from Nancy!";
    }
}
```

Now if we run our application we will see _Hello World!_ insted of _Hello World from Nancy!_ this is because we didn't register **Nancy** in the OWIN pipeline. Nancy provides very simple helper method **UseNancy** that we can put in our **Startup** class in the configuration.

```csharp
public class Startup {
    public void Configuration(IAppBuilder app) {
        app.UseNancy();
        app.Use((context, next) => { return context.Response.WriteAsync("Hello World!"); });
    }
}
```

Now if we run our project, and go to the defined route _localhost:35641/test_ we will receive our message from **Nancy**. But now if we try to go on the index page we will get _404 - NotFound_ this is because **Nancy** collects every request and stop executing other middleware that comes after, and if there is no route defined in any of the modules we get 404 error. But luckily there are few options to let request through **Nancy** into other middleware.

### Mapping specific route to **Nancy**

We can map **Nancy** middleware to be executed only on specific route.

```csharp
public class Startup {
    public void Configuration(IAppBuilder app) {
        //app.UseNancy();
        app.Map("/nfx", mapped => { mapped.UseNancy(); });
        app.Use((context, next) => { return context.Response.WriteAsync("Hello World!"); });
    }
}
```

### Using **PassThroughWhenStatusCodesAre** from **Nancy.Owin**

We can use **PassThroughWhenStatusCodesAre** from **Nancy.Owin**

```csharp
public class Startup {
    public void Configuration(IAppBuilder app) {
        //app.UseNancy();
        
        // this will let every request through if Nancy returns Not Found status
        // for that route
        app.UseNancy(conf => { conf.PassThroughWhenStatusCodesAre(Nancy.HttpStatusCode.NotFound); });
        app.Use((context, next) => { return context.Response.WriteAsync("Hello World!"); });
    }
}
```