---
layout: post
title: Localisation in ASP.NET MVC
comments: true
categories: [ 'localisation', 'asp.net', 'mvc', 'mine' ]
lang: en-US
author: Mirche Toshevski
---

Localisation is a process of customizing our project to respond to different
culture and locale.

First of all there is a great Visual Studio tool called
[ResXManager](https://marketplace.visualstudio.com/items?itemName=TomEnglert.ResXManager).
This tool gives you language sheet (similar to Excel) where every column
represent one language. We will use this tool to manage our resource files.

![](https://cdn-images-1.medium.com/max/800/1*4gh3YNpbHaMBrmHwaA55nA.png)
<span class="figcaption_hack">ResXManager for Visual Studio</span>

### Routes

First we need to see how we like to manage our language changes. I like to use
Microsoft way of doing this, they specify language code after the initial URL
i.e.: **[microsoft.com/en-US](http://microsoft.com/en-US)** **for the USA version
or** **[microsoft.com/de-DE ](http://microsoft.com/de-DE)for the German version of
the site**.

In order our project to work with this technique we need to modify our routes in
**RouteConfig.cs** to accept language code before the controller name.

<script src="https://gist.github.com/neemesis/1e9372d34e4390b638de33b41708f550.js"></script>

This is the default **RouteConfig** with default routes mapped, we need to change
this to look like the following:

<script src="https://gist.github.com/neemesis/d62b177f3b9176f67b8c038691cedde0.js"></script>

We define another route names **Localisation** where we set our **url** to start
with language code. In **constraints** we can define which language codes we
accept.

Then we need to define action filters that is going to control resources
invokation.

First create folder **ActionFilters** in base of the project, and add new class
named **LocalisationAttribute** inherited from **ActionFilterAttribute.**

![](https://cdn-images-1.medium.com/max/800/1*lTECrGedjyOtwemgN2dzhA.png)

And the **LocalisationAttribute** class:

<script src="https://gist.github.com/neemesis/c12c3cfa99c5d896e9b3511f9931d9ba.js"></script>

Now we have defined our action filter and specified the languages we accept.
Next we need to set this attribute to the controllers we want to use. We have
two ways of doing this:

1.  We can create **BaseController** class and set the localisation attribute, and in
every other controller we will inherit from **BaseController** instead of
**Controller.**
1.  We will add localisation attribute to every controller we want to use manually.

### Resources

Our next step is to define resources specific to culture and locale.

![](https://cdn-images-1.medium.com/max/600/1*IqgaTb80UJUggAK5e6-hAg.png)
<span class="figcaption_hack">Folder structure</span>

Create folder **Resources** in base of the project and add new **Resource File**
named **Resources.resx**

Right-click on **Resources.resx** file and click **Open with ResX Manager**, and add
new language.

<span class="figcaption_hack">ResX Manager UI</span>

You can add as many languages as you want, for this example we will add two
languages **en-US** and **mk-MK**, and we will define some keys.

![](https://cdn-images-1.medium.com/max/800/1*2p9fp0nnXyu9CjjXuTT1QA.png)
<span class="figcaption_hack">Keys</span>

### Usage
![](https://cdn-images-1.medium.com/max/600/1*3H84yLP3WSZfhSsbkkpffA.png)
<span class="figcaption_hack">Usage of Resources</span>

In order to test if everything works properly we will use **HomeController** with
changed **ViewBag.Message**, to be one of our defined keys.

We can run this example to see the resulting views.
![](https://cdn-images-1.medium.com/max/800/1*K4iTJOxyl5fY-WOnIdZCKw.png)
<span class="figcaption_hack">en-US</span>
![](https://cdn-images-1.medium.com/max/800/1*6j1o9Ihb9j5yzpGtZCtRTg.png)
<span class="figcaption_hack">mk-MK</span>

### Razor

We can also use **Resources** in razor pages in similar fashion. First we need to
open **Resources.resx** in **ResX Manager** and set them as public like this:
![](https://cdn-images-1.medium.com/max/800/1*F3W2WbtIhNEj4zT-zzNKGg.png)
<span class="figcaption_hack">Setting Resources public</span>

And in our view file, for example **Contact.cshtml**, we add following lines:

<script src="https://gist.github.com/neemesis/0cf62dd121dfdaafde6cfe95eeac342a.js"></script>

Now we have localized project.

GitHub repository: [P1:
Localisation](https://github.com/neemesis/MediumPosts/tree/master/P1_Localisation)
