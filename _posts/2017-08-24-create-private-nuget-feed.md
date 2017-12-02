---
layout: post
title: Create private NuGet Server
comments: true
categories: [ 'mine', 'create', 'private', 'nuget', 'server', 'feed' ]
lang: en-US
author: Mirche Toshevski
---
**NuGet** is the package manager for .NET, and **NuGet Gallery** is the place where most of the wide used packages rest and are publicly available. If you want to make you packages available only to your team / company you have few options, you will either pay for private feed, share packages via file transfer / storage sites or make your own **NuGet Server**.
## What we need for NuGet server?
**NuGet** team provides us with great package called **[NuGet.Server](https://github.com/NuGet/NuGet.Server)**, and we will use it here.

## How to create the actual server?
###### Create empty Web Project in Visual Studio.
Your solution should be looking like this
![Visual Studio Solution](/assets/images/cpnf_1.png 'Visual Studio Solution')
###### Install NuGet.Server package
From NuGet Package Explorer
![NuGet Package Explorer](/assets/images/cpnf_2.png 'NuGet Package Explorer')
Or from **Package Manager Console** type **Install-Package NuGet.Server**.
Your solution should look like this
![Visual Studio Solutin](/assets/images/cpnf_3.png 'Visual Studio Solution')

With this configuration you can just put your packages in the **Packages** folder and start using them right away. You can also set up you packages folder in another directory in **web.config**
```xml
<appSettings>
    <add key="packagesPath" value="D:\MyNuGetPrivateRepository" />
</appSettings>
```
###### Starting the server
You can start the project in Visual Studio and you will be greeted with this screen
![NuGet Server Screen](/assets/images/cpnf_4.png 'NuGet Server Screen')

## Pushing packages to your server
In order to publish packages from **NuGet Console** you will need to:
- Copy your packages to the folder printed on the screen **D:\Projects\NemesisNuGet\NemesisNuGet\Packages**
- Setup API key in **web.config** (if you want to publish packages from NuGet Console)
	- ```<add key="apiKey" value="YOUR_API_KEY"/>```
	- This key will also be used for deleting packages

I manualy added few packages in the **Packages** directory for testing purposes.
## Testing
###### First we need to add our feed to **NuGet Package Explorer**
*I added the solution to my local **IIS** now the link to our feed is **http://nuget.nemesis.local:8080/nuget***
- Right click on yout project / solution -> **Manage NuGet Packages**
- In **NuGet Package Explorer** click on the gear icon on the right side of **Package Source**
![NuGet Package Explorer](/assets/images/cpnf_5.png 'NuGet Package Explorer')
![NuGet Package Explorer](/assets/images/cpnf_6.png 'NuGet Package Explorer')
Click on the **+** icon and set **Name** to the name of the feed, and **Source** to the url of the feed, in this case **http://nuget.nemesis.local:8080/nuget**

###### Usage
Set the **Package Source** to the feed that you added, and click on the **Browse** tab, and you will get the list of all the packages that you have in your **Packages** folder.
![NuGet Package Explorer](/assets/images/cpnf_7.png 'NuGet Package Explorer')

# Git Repository
[Link](https://github.com/neemesis/PrivateNuGetRepository)