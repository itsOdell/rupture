# Rupture 

[![License: CC BY-NC](https://img.shields.io/badge/License-CC%20BY--NC-crimson.svg)](https://github.com/itsOdell/rupture/LICENSE)
![GitHub contributors](https://img.shields.io/github/contributors/itsOdell/rupture?color=blue)


**Rupture** is a social media web app developed with the goal of being open source for everyone to view it, understand the internal workings and contribute to it. The coding style follows a lot of the conventions and best practices of popular organizations, repos and online articles.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Overview

Rupture is a social media web app that allows users to connect and share their thoughts, photos, experiences and message eaech other. It provides a modern and intuitive user interface with a seamless user experience. The application is designed to prioritize clean code and follows the monorepo structure, making it easy to maintain and scale.

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
- **MongoDB**: A NoSQL database used to store and retrieve data efficiently.
- **Express**: A minimal and flexible web application framework for Node.js used to handle server-side logic and API endpoints.
- **React**: A popular JavaScript library for building user interfaces, enabling interactive and dynamic components.
- **Tailwind CSS**: A utility-first CSS framework that provides a collection of pre-built classes for rapid UI development.

## Getting Started

To get a local copy of the Rupture project up and running, follow these steps:

1. Clone the repository:

   ```shell
   git clone https://github.com/your-username/rupture.git
   cd rupture
   ```

2. Install the dependencies for the all workspaces:

   ```shell
   npm install
   ```

3. Set up the environment variables:

   - Set your own variables in the files 'rupture/.env.development' and 'rupture/.env.production' respectively

4. Start the server:

   ```shell
   npm run start:dev
   ```

Now you should be able to access the Rupture web application locally at http://localhost:PORT

## Contributing

Contributions to Rupture are welcome and encouraged! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make the necessary changes and commit them.
4. Push your branch to your forked repository.
5. Open a pull request in the original repository.
6. Please ensure that your code follows the project's coding style and conventions. Additionally, make sure to include appropriate tests for any new features or changes.

## License

This project is licensed under the CC BY-NC License. Feel free to use and modify the code as per the terms of this license.
