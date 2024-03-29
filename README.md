# Mitca

## Table of Contents

- [Description](#description)
  - [Tree Diagram](#tree-diagram)
  - [Data Model](#data-model)
  - [Figma](#figma)
  - [User Cases](#user-cases)
  - [User Requirements](#user-requirements)
- [Technology Stack](#technology-stack)
  - [Technology Comparison](#technology-comparison)
- [Installation](#installation)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [.env Files](#env-files)
  - [Frontend .env](#frontend-env)
  - [Backend .env](#backend-env)
- [Certs Files](#certs-files)
- [HTTPS](#https)
  - [HTTPS Backend](#https-backend)
  - [HTTPS Frontend](#https-frontend)
- [Database Setup](#database-setup)
  - [MongoDB](#mongodb)
  - [MongoDB Atlas](#mongodb-atlas)
- [User Guide](#user-guide)
  - [Signing Up and Log In](#Signing-Up-and-Log-In)
  - [Loading Data](#Loading-Data)
  - [Admin Guide](#Admin-Guide)
  - [User Guide](#User-Guide)
  - [Company Guide](#Company-Guide)
  - [Demo Data](#demo-data)
- [Usability and Accessibility](#usability-and-accessibility)
- [Repository](#repository)
  - [Planning](#planning)
- [Bibliography](#bibliography)
- [Conclusion](#conclusion)

---

## Description

This is a personal CRUD API built with Mongoose, Express and React project built for my own evaluation as a student. I chose a marathon themed webpage intended for creating users, runners, sponsors and the races they are interested in. 

This theme was chosen randomly, and is supposed to serve as a web tool to make registrations and management easier. This was made to mimic the overall style of the Mitca Studios main webpage, given this was meant to be training for my next project, which will be an actual request from them for me and a partner to work on.

### Tree Diagram

![Descripción de la imagen](backend/public/images/tree.png)

### Data Model

The entire model is built around the Race model, since the backend was built with NoSQL I was adviced not to push it too far with the complexity of each model. Other than Race related models, we have users, which can store both runners and a sponsor, and then we have suscriptions, only used to store suscriptions for a notification system.

Given this is Mongo the key for each model is the object id (_id) so there's not much to discuss here, only that in most cases I changed the default object id to make references easier. Most of them have their object id replaced by a String, except for the route and status given you barely get to work on with them since they are tied one to one to Race. The rest of models are tied to Races One to Many or Many to Many.

Most of the edited _id are, the email for the user, the DNI for the runner, the CIF for the sponsor and the name for the race. User and runner have unique phone numbers.

### Figma

https://www.figma.com/file/mDUmI5VHpPj3gcEzFkaQgf/Untitled?type=design&node-id=0%3A1&mode=design&t=VmI30zvQUszgq1ry-1

### User Cases

![Descripción de la imagen](backend/public/images/VisualParadigm.png)

### User Requirements

This wasn't an actual request from a company, but a personal project made for a made up situation. The problem to be solved would be the need of a website for the creation and publication of public races, and a easy way to join them as a runner from a normal user, and a quick way for companies to join as sponsors for the race (later having a proper formal reunion to discuss the sponsorship of course). 

To solve this issue I though of a website capable of creating users for both normal people wanting to join as runners as well as a special type of user dedicated exclusively to fill in as a company and represent it to join each race as a sponsor, as reflected in the user cases. Administrators can delete and modify users companies or runners to ban them from the event or modify wrong information, although they can't add them simply because this might be used to force unrelated companies or people to be assigned to a race, and while the admin role can only be given by other admins and one would guess you would only give this role to someone trustfull, you're never too sure or safe.

## Technology Stack

As said previously, this project was worked on using Mongoose, Express and React. I used JavaScript and not TypeScript. It should also be mentioned that I used a lot of components imported from Ant Design. The main features of this technology stack are working with Mongo, which means the use of NoSQL and in consequence an ODM. As of right now, this is a web project, although it could be repurposed to an hybrid application. It is not native nor hybrid, it was developed to work on any platform it may need as a web. This has the benefit of not needing to make a different app for each system, but it comes with the dissadventage of not being as fast and optimized as an actual native or hybrid
app. It could not be considered a WPA because despite storing some data locally (although it has a functioning chat which will more or less work locally to some extend, as long as you eventually connect to the network so all of your local chatting is uploaded), it won't get you that far other than maybe being already logged in with your token, so it's just a traditional web app.

### Advantages:
Cross-Platform Compatibility: Web apps can run on any device with a web browser, regardless of the operating system, which enhances accessibility for users across different platforms.
Easy Updates: Unlike native apps, which often require users to download updates manually, web apps can be updated instantly for all users by simply updating the server-side code.
Cost-Effective Development: Developing a single web app that works across multiple platforms can be more cost-effective than building separate native apps for each platform.
Faster Deployment: Web apps can be deployed instantly, without the need for app store approvals or lengthy review processes.
Easy Maintenance: Since web apps have a single codebase, maintenance and bug fixes can be applied uniformly across all platforms.

### Disadvantages:
Performance: Web apps may not perform as well as native apps, especially for graphics-intensive applications or tasks requiring access to device hardware.
Limited Functionality: Web apps may have limited access to device features such as GPS, camera, or push notifications compared to native apps.
Dependency on Internet Connection: Web apps require an internet connection to function, which can be a disadvantage in areas with poor connectivity or for users who frequently travel offline.
Security Concerns: Web apps may be more vulnerable to security threats such as cross-site scripting (XSS) or cross-site request forgery (CSRF) compared to native apps.
User Experience: While modern web technologies have made significant advancements in replicating native app experiences, some users may still perceive web apps as less polished or intuitive compared to their native counterparts.


### Technology Comparison

Comparing this stack to alternatives like SQL databases and frameworks such as Ionic, MongoDB and Express signifies a departure from rigid structures to embrace adaptability. The NoSQL model provides a responsive environment for swift data structure adjustments, a stark contrast to the more static nature of SQL databases. Utilizing Express for the backend introduced a minimalist, unopinionated approach, affording me the freedom to choose components based on project needs, unlike more structured frameworks. The frontend, built on React and augmented by Ant Design components, contributed to an efficient and maintainable user interface. The choice of this technology stack reflects a deliberate balance, prioritizing adaptability, scalability, and development efficiency based on the project's unique requirements.

In my personal opinion, if I were to choose the technology stack myself, I would have probably stayed with Express and React, although I'm also fine with Ionic. I would not like to use Mongo/Mongoose or any kind of NoSQL though, I'm way more comfortable with, say MySQL + Spring or any other basic SQL toolkit. 

## Installation

```bash
git clone https://github.com/DanielMesaGarcia/mitca.git
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd ../backend
npm install
npm start
```

### .env Files

Generate your Vapid keys with this command in the console:

```bash
npx web-push generate-vapid-keys --json
```

#### Frontend .env

Create a `.env` file in the `frontend` directory with the following content:

```bash
REACT_APP_API_URL=your_api_url
REACT_APP_WEB_URL=your_web_url
REACT_APP_PUBLIC_KEY=your_public_key
REACT_APP_PRIVATE_KEY=your_private_key
```

#### Backend .env

Create a `.env` file in the `backend` directory with the following content:

```bash
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_user_password
DB_NAME=your_database_name
DB_URL=your_database_URL

PUBLIC_KEY=your_public_key
PRIVATE_KEY=your_private_key
```

### Certs files

You will need to install your own certificates to work with https.

To do so you will need first to install mkcert:

```bash
choco install mkcert
yarn install mkcert
npm install mkcert
```

Once the mkcert is installed you'll need to create the folder called cert in both backend and frontend folders.

Once created you will have to execute the follow command in order to create your own personal certificate:

```bash
mkcert -cert-file cert.crt -key-file cert.key localhost
```

Once you execute that command you will see your private and public key those keys must be added to your .env files located in both backend and fronted like this:

```bash
PUBLIC_KEY="public key"
PRIVATE_KEY="private key"
```

Remember that you're gonna execute the mkcert command not only in the backend but in frontend so the keys could be different so make sure to put the right keys in their .env files.

### HTTPS

Once the certs files are created we need to set the parameter of the https.

#### HTTPS Backend

In the .env of the backend you'll need to add this:

```bash
USING_HTTPS=true
```

#### HTTPS Frontend

In the .env of the frontend you'll need to add this:

```bash
USING_HTTPS=true
HOST=localhost
PORT=443
```

Once you add those lines in the .env of the frontend you will need to execute the follow command: 

```bash
npm run build
```

This will create a build folder which contains your react project.

Remember to execute it every time you do a change in the frontend.

## Database Setup

### MongoDB

To install MongoDB locally, follow the instructions [here](https://docs.mongodb.com/manual/installation/).

### MongoDB Atlas

To use MongoDB Atlas, sign up [here](https://www.mongodb.com/cloud/atlas), create a cluster, and follow the setup instructions.

## User Guide

### Signing Up and Log In

You can create your own account by signing up. if you do, you will create a normal user by default. As a normal user, you will be able to create runners and join them to races. If during the sign up you open the company modal, you will be able to create a company account by filling the company form, which will allow you to sponsor a Race. If you're an admin, you just have to create a normal user account and ask another admin to give you the admin role.

Given this system, of course you would need an original admin to make other users admin. That's why there's an admin user always present, with admin@admin.com as the email and admin1 as the password.

### Loading Data

Of course, the first time you open the web page there will be no data, and as a user or company there won't be much to do other than check your own user settings. At this point, it would be wise to log in as an admin (or ask one) to create races for you to join or sponsors. Given this webpage is mainly for formation purposes and not something a real company will use, there's also a "demo data" option in the header menu, which after clicking and reloading the page will create 3 demostration user (one with two runners and the other two with one company each), 2 demostration races with one runner and one sponsor each.

### Admin Guide

If you're an admin, you will be able to create races from the get go once you've logged in. This will create a race, route, and the current status of the race (it will always start as not started). Once you click on a race, you have a button to modify the status (one click will just start the race and notify every user subscribed to the webpage about the race starting, and the second click will trigger a little form asking you who won the race and what was his time. Any click after the second one will just allow you to edit the winner and time). There is no "update route" or "update race", given I consider changing, say, the location, goal or name of the race would be counter efficient given most users may not see the notification and this may result in them showing up at the old location or whatever. If you want to change the race location, it would be wise to simply delete it and create a new one. 

Also, as an admin, you have access to the company, runner and user CRUD in your user settings. Just click on the header and go to your user settings, you will have a modal button which will redirect you to each one. Here you can kick runners, companies or users or change their information if needed. You can't create for security, given some malicious user with admin role may sign non-related companies or people against without their consent and that may lead to some issues.

### User Guide

As an user, you will be able to click on each created race and check it's details, check who sponsors each race, and sign your runners into a particular race. In your user settings you can change your user info and create runners. This works this way because one family could use a single account, and it's more convinient to fill a form for each family member once per account instead of once each time you join a race. In case of some runner not popping up in the runner list, try refreshing the page and doing the transaction again, it's safer to always double check.

### Company Guide

Your guide is pretty much the same as the normal user one, but with the main difference being that you can sign your company in and out of a company as a sponsor, and you can update your company details in your user settings. You can only do one company per account.

### Demo Data

Preinstalled: admin@admin.com / admin1 (admin)

After clicking create demo data:
user1@example.com / password1 (user)
user2@example.com / password2 (sponsor)
user3@example.com / password3 (sponsor)

## Usability and Accessibility

Alternative text for images:

![Descripción de la imagen](backend/public/images/ALT.png)

Mostly keyboard accessible:

![Descripción de la imagen](backend/public/images/keyboard.png)

Good color contrast:

![Descripción de la imagen](backend/public/images/contrast.png)


Clear validation errors:

![Descripción de la imagen](backend/public/images/validation.png)

Text-to-speech:

![Descripción de la imagen](backend/public/images/tts.png)

Jump button (to prevent movement without repeating screens):

![Descripción de la imagen](backend/public/images/contrast.png)

Hover effects:

Hovered:
![Descripción de la imagen](backend/public/images/hover.png)

Unhovered:
![Descripción de la imagen](backend/public/images/unhover.png)

Labels for forms:

![Descripción de la imagen](backend/public/images/label.png)

Font easy to read and understand:
![Descripción de la imagen](backend/public/images/font.png)

Responsive

## Repository

The local repository was worked with Git and the remote with Github
https://github.com/DanielMesaGarcia/mitca

I mainly worked with feature branches but slacked off a bit when working on the features themselves, given there are some branches with pushes unrelated to the purpose of the branch itself, but nothing too major

### Planning

Mainly focuses on the backend for the first 2 weeks and then slowly started implementing the frontend while fixing the backend as I went, given I was mostly new with Mongoose and NoSQL. The project tab in my repository may seem to be empty from the middlepoint of the development, this is because we were instructed to make a roadmap half way through the project so I scrambled one as fast as I could.

![Descripción de la imagen](backend/public/images/planning.png)

I worked with a BACKLOG / READY / IN PROGRESS / DONE roadmap as I was told.

## Bibliography

Most used components:
https://ant.design

Multer tutorial:
https://www.djamware.com/post/5c98220080aca754f7a9d1f0/nodejs-expressjs-and-multer-restful-api-for-image-uploader

Push Notification tutorial:
https://www.telerik.com/blogs/implementing-web-push-notifications-mern-stack-application

HTML oddities:
https://www.w3.org

## Conclusion

Working with a full-stack project from scratch and specially with a technology as unknown to me as NoSQL has been certainly a challenge, but also a test for my skills as a developer and a gaze at what will hopefully be my job in not too long. I don't consider NoSQL and specially Mongoose a technology pleasant to work with and would never work with it voluntarily, but it sure wasn't as difficult as some may think. I definetly think this project does not go well with having to work with Odoo at the same time in other subjects but I do understand there's not really anyway to integrate an enviroment like that in a project like this. # mitca2
