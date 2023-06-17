# Contributing Guidelines

Thank you for your interest in contributing to our open-source social media web app! We welcome contributions from developers like you. By following these guidelines, you can help us maintain a collaborative and inclusive environment for all contributors.

## Table of Contents

1. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
2. [Contributing Process](#contributing-process)
    - [Issue Tracker](#issue-tracker)
    - [Branching](#branching)
    - [Commit Guidelines](#commit-guidelines)
    - [Code Style](#code-style)
    - [Testing](#testing)
3. [Code of Conduct](#code-of-conduct)
4. [License](#license)

## Getting Started

### Prerequisites

Make sure you have the following dependencies installed:

- [Node.js](https://nodejs.org/) (version X.X.X)
- [Database System] (e.g., MySQL, PostgreSQL, MongoDB)

### Installation

1. Clone the repository:

```shell
   git clone https://github.com/itsOdell/rupture.git
   cd rupture
   ```


2. Install the project dependencies:

```shell
   cd rupture
   npm install
   ```


3. Configure the database connection:

- Copy the `.env.example` file to `.env` and update the necessary configurations.

4. Build and run the project:

```shell
   npm run start
   ```


The application should now be running at `http://localhost:3001`.

## Contributing Process

### Issue Tracker

Before starting any work, please check the issue tracker on our GitHub repository to find any existing issues or feature requests. If you don't find a related issue, feel free to open a new one and discuss it with the community.

### Branching

1. Create a new branch for your contribution:

```shell
   git checkout -b feature/your-feature
   ```


For bug fixes, use `bugfix/your-fix` as the branch name.

2. Ensure that your branch name is descriptive and explains the purpose of your changes.

### Commit Guidelines

1. Make your commits atomic and focused on a single task.
2. Write clear and concise commit messages that explain the purpose of your changes.
3. Reference the relevant issue number in your commit message using the format `#issue-number`.

### Code Style

Follow the existing code style and conventions used in the project. Ensure that your changes adhere to the project's linting rules.

### Testing

Write tests for the code you contribute. Run the test suite before submitting your pull request to ensure that your changes pass all the tests.

## Code of Conduct

Please review and abide by our [Code of Conduct](CODE_OF_CONDUCT.md) to create a welcoming and inclusive community for everyone.

## License

By contributing to this project, you agree that your contributions will be licensed under the [LICENSE](LICENSE) file of this repository.

---

Thank you for your interest and we appreciate your contributions to our social media web app! If you have any questions, feel free to reach out to the project maintainers or join our community chat.

Happy coding!

