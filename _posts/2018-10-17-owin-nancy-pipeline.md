---
layout: post
title: Creating simple OWIN pipeline with Nancy
comments: true
categories: [ 'C#', 'LINQ', 'Nancy', 'OWIN' ]
lang: en-US
author: Mirche Toshevski
image: /assets/covers/c14.jpeg
image-sm: /assets/covers/c14s.jpeg
short-desc: Create simple OWIN pipeline with Nancy integration on top of it, using the ASP.NET Empty template as a base.
---

# Intro

[**OWIN (Open Web Interface for .NET)**](http://owin.org/) is a standard for an interface between **.NET Web applications** and **Web servers**. **Nancy** is lightweight framework for building HTTP based services on **.NET**. This post will contain two main points, first creating simple **OWIN** pipline, and second implementing **Nancy** on top of it.

# Creating simple OWIN pipeline

To make this as simple as we can, we will use **ASP.NET empty template**. The empty template comes with a bare minimum dependencies and **web.config**. In order for this to be OWIN-based application we need to add some references, specifically **OWIN server** so we can host it in **IIS**.  

Install **Microsoft.Owin.Host.SystemWeb** from NuGet.  

```Install-Package Microsoft.Owin.Host.SystemWeb```

Now in order to make our application to be **OWIN-application** we need to have startup class to serve as entry point in the pipeline. We have few approaches of connecting the startup class with the runtime:

* **Naming Convention**: just create **Startup** class in base of the project with namespace that matches assembly name or the global namespace.
* **OwinStartup Attribute**: create class with any name and add OwinStartup attribute to it, where type is the namespace of our class.  
    ```[assembly: OwinStartup(typeof(TestProject.Startup2))]```
* **appSettings**: add new key **owin:appStartup** in **appSettings** section and set the value to the namespace of the class i.e:  
    ```<add key="owin:appStartup" value="TestProject.Startup2" />```

I will use the first approach with naming convention.  
Now that we are connected with the runtime, we will need a way to configure OWIN pipeline and register new middleware. **OWIN** makes this possible with method called **Configuration(IAppBuilder)** that we need to implement in our **Startup** class.

```csharp

// Startup.cs
namespace TestEmpty {
    public class Startup {
        public void Configuration(IAppBuilder app) {

        }
    }
}

```

We will register simple middleware that will return simple _Hello World!_ message for every request.

```csharp

// context: IOwinContext with request and response fields
// next: AppFunc with next middleware that should be executed
app.Use((context, next) => { return context.Response.WriteAsync("Hello World!"); });

```

Now if we run our application we will receive _Hello World!_ message in the browser.

# Adding Nancy to our OWIN application

Nancy doesn't have any dependencies on existing frameworks so we will need to reference **Nancy** and also **Nancy.Owin** so we can register it as **OWIN** middleware.

## Installing Nancy

We can install **Nancy.Owin** package and it will automatically install **Nancy** as a dependency.

```Install-Package Nancy.Owin```

## Creating modules

Modules are the lynchpin of any given Nancy application. Create folder named **Modules**, and create new class, i.e. **TestModule** class. In order for **Nancy** to recognize our class as a valid **Nancy** module we need to declare it public and inherit from **NancyModule**. Now we need to define what routes this module will handle.

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

Now if we run our project, and go to the defined route _localhost:35641/test_ we will receive our message from **Nancy**. But now if we try to go on another route we will get _404 - NotFound_ this is because **Nancy** collects every request and stops executing other middleware that comes after, and if there is no route defined in any of the modules we get _404_ error. But luckily there are few options to let request through **Nancy** into other middleware.

### Mapping specific route to **Nancy**

We can map **Nancy** middleware to be executed only on specific route.

```csharp
public class Startup {
    public void Configuration(IAppBuilder app) {
        // Every request that comes to /nfx will be handled with Nancy
        app.Map("/nfx", mapped => { mapped.UseNancy(); });
        app.Use((context, next) => { return context.Response.WriteAsync("Hello World!"); });
    }
}
```

### Using **PassThroughWhenStatusCodesAre** from **Nancy.Owin**

We can use **PassThroughWhenStatusCodesAre** function from **Nancy.Owin**.

```csharp
public class Startup {
    public void Configuration(IAppBuilder app) {
        // this will let every request through if Nancy returns
        // Not Found (404) status for that route
        app.UseNancy(conf => { conf.PassThroughWhenStatusCodesAre(Nancy.HttpStatusCode.NotFound); });
        app.Use((context, next) => { return context.Response.WriteAsync("Hello World!"); });
    }
}
```

*Photo by Izabella Bedő from Pexels https://www.pexels.com/photo/shallow-focus-photography-of-brown-conifer-cone-987648/*