# Unified - Frontend
**By The Unifiers**

## Table of Contents

- [About The Project](#about-the-project)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Features](#features)
- [Navigation Flow](#navigation-flow)
- [Techstack](#techstack)
- [Contact](#contact)

## About The Project 
<a href="#about-the-project"></a>

Open your Telegram application right now - what do you see? Numerous NUS chats and channels that are left unopened, some of which are even muted. You are left overwhelmed and clueless about the latest updates and news, such as bus route changes or event updates. It is difficult to keep track of university information due to the numerous channels available to obtain information.

To add on, it is even harder to identify channels for communication, especially for module discussions or finding items you have lost on campus. As such, we want to initiate a one-stop app for NUS students to keep track of information and to provide a safe and centralised channel for common discussions with peers and seniors.

UniFied is a mobile application that holds all public NUS news and education-related chatrooms.
Our app aims to model news dashboard apps like Bloomberg, as well as chat channels interfaces, inspired by Discord. Specific app features will be elaborated in the following sections.
We aim to centralise information sourcing for university news and discussions in a single platform, powered by university students as users.

## Getting Started
<a href="#getting-started"></a>

Install Expo Go on IOS or Android and scan the QR codes below:

IOS: <br />
<img src="https://github.com/tallkoh/TheUnifiers/assets/110431837/20c6a8ff-8471-468d-9a45-619f6da85a86" width="200"> <br />


Android: <br />
<img src="https://github.com/tallkoh/TheUnifiers/assets/110431837/c41e2f9a-11c2-4319-a452-e77243a3aeea" width="200"> <br />

Backend Repository: [Link](https://github.com/tallkoh/unified-backend/)

## Contributing
<a href="#contributing"></a>

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Features
<a href="#features"></a>

1. News dashboard: The news dashboard is a vertical display of NUS public news from subscribed channels in chronological order.
- Search bar: Users can do keyword searches for any news, and it will be highlighted in the relevant messages
- Add new channel: Users can add channel usernames of channels that have yet to be added and will be processed via Flask RESFUL API and Firestore
- Filter: Users can filter by choosing their selected channels, such that only selected channel messages will be displayed

2. Module chats: Module chats facilitate discussions for all available modules in NUS, open to all students.
- NUSMODS API: All CS modules have been scraped to create a chat collection within Firestore 
- Search bar: Users to search for a particular module that they are interested in.
- Filter: Users can also filter chats that are more relevant to them by using the filter button on the top right of the screen.
- Vulgarities filter API: External API is used to filter vulgarities from chats to ensure wholesome discussions only

3. Lost and Found: The Lost and Found feature helps students locate their missing items by browsing listings posted by other students who found items on campus.

- Users can post items they found using the button on the top right of the screen.
- Users will be required to provide an image, title, description, location of the found item and their tele handle. This will allow the rightful owner of the item to contact the finder on telegram with the provided tele handle.
- Once an item has been returned to the rightful owner, users can delete the item with the delete button on the top right of the listing. Should users find it difficult to find their items in the “All Listings” page, they can click on the “My Listings” page to view only the items that they have posted.
- All information will be uploaded to Firestore and Firebase Storage.


## Navigation Flow
<a href="#navigation-flow"></a>

<img src="https://drive.google.com/uc?export=view&id=1KguA4fXSgzPqHkHp4Rd766r2o-7R9r0_" width="800"> <br />

## Techstack:
<a href="#techstack"></a>

- React Native (JavaScript)
- Firebase
- Firestore
- Python
- Flask
- Figma

## Contact
<a href="#contact"></a>

| Name  | LinkedIn |
| ------------- | ------------- |
| Koh Xin Ning (Natasha)  | https://www.linkedin.com/in/natashakohxn/ |
| Tang Ming Jie, Ryan  | https://www.linkedin.com/in/ryan-tang-a0316-o1178/ |
