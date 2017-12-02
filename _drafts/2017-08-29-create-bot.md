---
layout: post
title: A few easy steps to create bot in .NET
comments: true
categories: [ 'mine', 'easy', 'steps', 'create', 'bot', '.net' ]
lang: en-US
author: Mirche Toshevski
---
http://aka.ms/bf-bc-vstemplate - template
%USERPROFILE%\Documents\Visual Studio 2015\Templates\ProjectTemplates\Visual C#\
%USERPROFILE%\Documents\Visual Studio 2017\Templates\ProjectTemplates\Visual C#\

How to create .NET / C# bot in Visual Studio

Prerequisites
1. > VS 2015 Up 3
2. Bot Template

This basically is Web API

Most important part is MessagesController

Second important part web.config

Download Bot Framework Emulator
https://github.com/Microsoft/BotFramework-Emulator/releases

Endpoint: http://localhost:3979/api/Messages
If you are testing locally leave other fields empty.

```cs
private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> 		result) {
    var activity = await result as Activity;

    // calculate something for us to return
    int length = ( activity?.Text ?? string.Empty ).Length;

    // return our reply to the user
	if (activity != null) await context
    	.PostAsync($"You sent {activity.Text} which was {length} characters");

	context.Wait(MessageReceivedAsync);
}
```



# Git Repository
[Link](https://github.com/neemesis/PrivateNuGetRepository)