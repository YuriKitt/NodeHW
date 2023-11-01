# NodeHW

## Running Tests

This project uses [Jest](https://jestjs.io/) as the test runner. Below are the instructions to run the tests.

### Prerequisites

- Node.js
- npm

If Node.js and npm are not installed, you can download and install them from the [official Node.js website](https://nodejs.org/).

### Running All Tests

To run all tests, navigate to the root directory of the project and run the following command:

`npm test`

This will execute all the test files (files ending in `.test.ts`) located in the `src/tests` directory.

### Running Tests with Coverage Report

To generate a test coverage report, use the following command:

`npm run test:cov`

This will display a coverage report in the terminal and also generate a more detailed report in the `coverage/` directory. 
The report enforces coverage thresholds for branches, functions, lines, and statements. 
If any of these metrics fall below the threshold, the script will fail.
