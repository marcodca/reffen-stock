# Reffen stock

A full-stack web app for keeping track of missing products in an inventory. Built with Node, Express, React and GraphQL. The app fully responsive and is intended to give a good user experience on mobile. It has progressive web app functionality included.
<p align="center">
<img width="460" height="300" src="https://i.ibb.co/rbB0X5D/reffen.png">
</p>


## Getting Started

### NOTE: In order to run this project you are gonna need to have NodeJS installed in your computer. In addition, a mongoDB database needs to be set up.

1. **Clone this repository**

```sh
git clone https://github.com/marcodca/reffen-stock.git project-name
```

2. **Installation**

```sh
cd project-name
npm install
cd client
npm install
```

3. **Start developing**

```sh
cd project-name
npm start
cd client
npm start
```

## Acknowledgments
I started this project with the aim of getting a solid grasp on GraphQL, and as an chance of exercising working in both ends: client and server. Regarding this last one, I used express for the set up of the application. GraphQL is managed with express-graphql in the back-end and react-apollo in the client. MongoDB was my database of choice, and is implemented with mongoose. React was used in the front-end, and I managed styling with materialUI and css-in-js with styled-components. My goal was to give a native feel on mobile devices, so the responsiveness is quite good, and it also has PWA functionality. The app was, for a short period of time, actually being used at a former job of mine. 
