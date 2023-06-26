# Unified
**By The Unifiers**

| Name  | LinkedIn |
| ------------- | ------------- |
| Koh Xin Ning (Natasha)  | https://www.linkedin.com/in/natashakohxn/ |
| Tang Ming Jie, Ryan  | https://www.linkedin.com/in/ryan-tang-a0316-o1178/ |

## Table of Contents

- [Level of achievement](#about-the-project)
- [What's new](#built-with)
- [Motivation](#getting-started)
- [Vision](#roadmap)
- [User Stories](#contributing)
- [Features](#license)
- [Roadmap](#contact)
- [Work Log](#references)

## Level of achievement
Apollo II

## What's New (for Milestone 2)
In this milestone, we have integrated our backend into the app, and added in the features for module chats and lost & found.
* User authentication added with Firebase
* Tele-scraper set up with Telegram API
* Connecting firestore to our app to display dashboard
* Enabled chat functions for module chat, linked to Firestore
* Enabled lost and found section, linked to Firestore

## Motivation
Open your Telegram application right now - what do you see? Numerous NUS chats and channels that are left unopened, some of which are even muted. You are left overwhelmed and clueless about the latest updates and news, such as bus route changes or event updates. It is difficult to keep track of university information due to the numerous channels available to obtain information.

To add on, it is even harder to identify channels for communication, especially for module discussions or finding items you have lost on campus. As such, we want to initiate a one-stop app for NUS students to keep track of information and to provide a safe and centralised channel for common discussions with peers and seniors.

![The Unifiers (1)](https://github.com/tallkoh/TheUnifiers/assets/110431837/58fb64aa-1aeb-478f-a69a-9a8c7ee8f159)

## Vision
UniFied is a mobile application that holds all public NUS news and education-related chatrooms.

Our app aims to model news dashboard apps like Bloomberg, as well as chat channels interfaces, inspired by Discord.
Specific app features will be elaborated in the following sections.

We aim to centralise information sourcing for university news and discussions in a single platform, powered by university students as users.

## User Stories
As a student, I want:
* to easily access and view the latest updates and news from various NUS chats and channels in one place, so that I can stay informed about important information such as bus route changes and event updates without feeling overwhelmed.
* to be able to safely hold module discussions within the app, facilitating effective communication and collaboration with my classmates.

* to seek advice and guidance from seniors who have taken certain modules, leveraging their experience and knowledge.

* a centralized channel within the app where I can communicate and have discussions with my peers and seniors, for both academic and non-academic purposes, in a safe and convenient manner.

* to easily and securely find my lost items by accessing a dedicated platform within the app.

* to filter and prioritize the NUS chats and channels based on my interests and preferences, so that I can focus on the information that is most relevant to me and avoid being inundated with unnecessary updates.

* to provide notifications for important updates and announcements from the NUS chats and channels I follow, ensuring that I stay updated even when I'm not actively using the app.

* a feature that enables me to connect with alumni and industry professionals, opening up networking and mentorship opportunities to gain valuable insights for my future career.

## Features

### App demo
Install Expo Go on your mobile phone to preview our app:

![Unified App Preview](https://github.com/tallkoh/TheUnifiers/assets/74520346/93ea8cad-9d11-4b4c-837d-8693f6de61a1)

### Login Page
![Login Page Preview](https://github.com/tallkoh/TheUnifiers/assets/110431837/6f821029-af55-40c7-b74e-dd8b1d922fd2)
Users can log in with their username or email. 

New users can register a new account using the register button where they will be navigated to the registration page.

Upon successful login, users will be redirected to the home page displaying the news dashboard.

### Registration Page
![Registration Page Preview](https://github.com/tallkoh/TheUnifiers/assets/110431837/0f01a171-5ac2-4bd1-a319-306f074c03e3)
Users are required to input their desired username and email. 

Duplicate usernames or emails are not allowed for registration. 

After successful account creation, users will be redirected to the login page.

When an account is created, a new username and email field will be saved to the users collection in firebase.

There is also a button at the top left of the screen for users to get back to the login page if necessary.

#### News Dashboard
<img src="https://github.com/tallkoh/TheUnifiers/assets/74520346/cfbdc358-4950-434e-8fae-08615399387f" width="200">
![News Dashboard Preview](https://github.com/tallkoh/TheUnifiers/assets/110431837/258b557b-3efe-464b-ad0f-539cfa7afda2)
The news dashboard is a vertical display of NUS public news from subscribed channels in chronological order. 

News is generated by Telegram message scraping which can be found in the backend folder, the messages will first be output into a csv file and it will subsequently be uploaded to firebase.

There is a search bar at the top for users to keyword search for any news they are looking for.

Users can log out from the logout button on the top right of the screen.

#### Module Chats
<img src="https://github.com/tallkoh/TheUnifiers/assets/74520346/22a32708-2594-46e8-b7d9-a28588a88e7f" width="200">

<img src="https://github.com/tallkoh/TheUnifiers/assets/74520346/fccb1cef-37b1-4213-aad5-4efcb2c0a500" width="200">
Module chats facilitate discussions for all available modules in NUS, open to all students, including seniors who have taken the modules. 

Users can create new module chats if they don't exist using the button on the top right of the screen.

All chats are being stored under the chats collection in firebase.

#### Lost and Found
<img src="https://github.com/tallkoh/TheUnifiers/assets/110431837/67a0153b-0472-4452-9974-81916325c13f" width="200">
The Lost and Found feature helps students locate their missing items by browsing listings posted by other students who found items on campus. 

Users can post new items they found using the button on the top right of the screen.

<img src="https://github.com/tallkoh/TheUnifiers/assets/110431837/bbd14d74-1ff2-45b7-9b64-06d75c72318b" width="200">
Users will be required to provide a picture, title, description, and location of the found item. 

All information will be uploaded to firebase under the items collection.

## Timeline and Development Plan
Features to implement by Milestone 3:

- To automate scraping of Telegram messages, so as to automatically update the news dashboard
- To allow for customisation of dashboard design and selection of channels
- Lost & Found: Touchable listings and secure chat function within each listing
- Module Chats: Use NUSMODS' API to open list of modules
- Module Chats: Implementation of OpenAI's GPT to engage in Module Chats for users to query
- Security: Add a filter for messages in chat pages to make sure no vulgarities or any offensive language will be used

## Work Log
Our work log progress can be viewed [here](https://docs.google.com/spreadsheets/d/1evctZxslpMVcKZAfejuWrmujpLc73P-GATx4KaudZrY/edit?usp=sharing).
