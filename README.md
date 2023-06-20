# Rupture 

[![License: CC BY-NC](https://img.shields.io/badge/License-CC%20BY--NC-crimson.svg)](https://github.com/itsOdell/rupture/LICENSE)
![GitHub contributors](https://img.shields.io/github/contributors/itsOdell/rupture?color=blue)
![GitHub pull requests](https://img.shields.io/github/issues-pr/itsOdell/rupture?color=lavender)



**Rupture** is a social media web app developed with the goal of being open source for everyone to view it, understand the internal workings and contribute to it. The coding style follows a lot of the conventions and best practices of popular organizations, repos and online articles.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Overview

Rupture is a social media web app that allows users to connect with one another and share their thoughts, photos, experiences and message eaech other. It provides a modern and intuitive user interface with a seamless user experience. The application is designed to prioritize clean code and best practices followed by many world-leading organzations but without the __bias__, __agenda__ and __censorship__ big tech corporations push.

## Features

- User authentication and authorization
- User profiles with customizable settings
- Post creation, editing, and deletion
- Commenting and liking on posts
- User-to-user messaging
- Real-time notifications

## Tech Stack

The Rupture project utilizes the following technologies:

- **TypeScript**: A statically-typed superset of JavaScript that improves developer productivity and code maintainability.
- **MongoDB**: A NoSQL database used to store and retrieve data efficiently but with the flexibility that most SQL RDMS's don't have.
- **Redis**: An in-memory disk, caching database used to store and retrieve data efficiently without having multiple duplicate request and blazingly fast performance.
- **Express**: A minimal and flexible web application framework for Node.js used to handle server-side logic and API endpoints.
- **NextJS**: A popular React library for building user interfaces, enabling interactive/dynamic components with server-side rendering capabilities.
- **Tailwind CSS**: A utility-first CSS framework that provides a collection of pre-built classes for rapid UI development.

## Getting Started

To get a local copy of the Rupture project up and running, follow these steps:

1. Clone the repository:

   ```shell
   git clone https://github.com/itsOdell/rupture
   cd rupture
   ```

2. Install the dependencies for the all workspaces:

   ```shell
   npm install
   ```

3. Set up the environment variables:

   - Set your own variables in the new files 'rupture/.env.development' and 'rupture/.env.production' by creating it. Make sure __NOT__ to delete the __.env.development.example__ or __.env.production.example__ files

4. Start the server:

   ```shell
   npm run start:dev
   ```

If you haven't change the default port which is set to 3001 in the .env files, you should be able to access the Rupture api locally at http://localhost:3001/api

## Contributing

Contributions to Rupture are welcome and encouraged! To contribute and learn more about the codebase, read [CONTRIBUTING.md](https://github.com/itsOdell/rupture/blob/main/CONTRIBUTING.md) to get started

If you have no idea on how to get started on contributing, watch [this video](https://www.youtube.com/watch?v=c6b6B9oN4Vg&list=PLZhVtg0EdgcebCl8g2KNAKKUz22uwrJO7&index=1&ab_channel=MetaOpenSource)

## License

This project is licensed under the [CC BY-NC License](https://github.com/itsOdell/rupture/blob/main/LICENSE). Feel free to use and modify the code as per the terms of this license.
