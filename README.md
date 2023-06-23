# The Unifiers - Unified

## Level of achievement
Apollo II

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
As a student, I want to obtain information easily on one channel.
As a student, I want to easily and safely hold module discussions.  
As a student, I want to seek advice from seniors who have taken certain modules.  
As a student, I want to reach out to find my lost items easily and securely.

## Features

### App demo
Install Expo Go on your mobile phone to preview our app:

![Unified App Preview](https://github.com/tallkoh/TheUnifiers/assets/74520346/93ea8cad-9d11-4b4c-837d-8693f6de61a1)

### Login Page
Users can login with their username or email.

New users are also able to use the register button to create a new account.

Upon log in, users will be redirected to the home page which displays the news dashboard.

### Registration Page
Users are required to input their desired username and email.

To prevent users from signing up with the same username or email, duplicate username or emails will not be allowed to register an account.

After an account has been successfully created, the user will be redirected to the login page

#### News Dashboard
![News Dashboard Preview] (https://github.com/tallkoh/TheUnifiers/assets/110431837/ce74cea1-835a-4336-9e0e-3b6e2d1ade22)
Vertical dashboard consisting of NUS public news from channels that you subscribe to in chronologically order.

News from dashboard is powered by Telegram message scraping.

Logout button is available at the top left of the page if users wish to log out of their current account.

#### Module Chats
![Module Chats Preview](https://github.com/tallkoh/TheUnifiers/assets/110431837/008d39aa-52c7-4820-b7f4-aaa0987d78b8)
Discussions for all available modules in NUS that is powered by user accounts.

Every module discussion is open to all students including seniors who might have already taken the module.

Users can create a new module chat if it does not exist with the button that is on the top right of the screen.

#### Lost and Found
![Lost And Found Preview](https://github.com/tallkoh/TheUnifiers/assets/110431837/4a99e5fc-3ee8-4413-a42f-422e35344752)
Students can now locate their missing items by looking through listings posted by other students about the items they have found in school.

A button can be found on the top right of the screen for users to post new items that they might have found around campus.

The user will be required to upload a picture, title, description and location of the item that is being found.

## Timeline and Development Plan

## Work Log
Our work log progress can be viewed [here](https://docs.google.com/spreadsheets/d/1evctZxslpMVcKZAfejuWrmujpLc73P-GATx4KaudZrY/edit?usp=sharing).
