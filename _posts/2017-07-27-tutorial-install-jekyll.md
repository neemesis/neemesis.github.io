---
layout: post
title: Jekyll Tutorial - Part 1: Install Jekyll on Windows in few easy steps
comments: true
categories: [ 'tutorial', 'install', 'jekyll', 'windows' ]
lang: en-US
author: Mirche Toshevski
---

- First install **Chocolatey**
	- Open **PowerShell** with admin privileges
	- Check execution policy
		- Type **Get-ExecutionPolicy** if it return **Restricted**, type **Set-ExecutionPolicy AllSigned**
	- Install Chocolatey
		- Type **iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))**
- Restart **PowerShell** with admin privileges
- Install **Ruby**. Type **choco install ruby -y**
- Restart **PowerShell** again
- Install **Bundler**. Type **gem install bundler**
- Install **Jekyll**. Type **gem install jekyll**
- Check **Jekyll** version with **jekyll --version**