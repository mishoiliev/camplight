# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

# Project Overview

This project uses tailwindcss, tanstack query, React Context and shadcn ui components. All very convenient and useful, but unfortunately timely to setup.

### Overall Architecture

I decided to split the project into pages directories, each holding their local environments (components, hooks, utils, etc.).
Other than that, we have main directories for components, utils, etc. which would be used throught the project. I prefer this design as it follow the separation of concern.

For the architecture, in this case we have a page which includes all of it's components. Althogh I have separated the most crucial parts of the page, there can be further optimization for sure. I decided to use React Context as it was the fastest and most convenient solution. In this case, prop drilling wouldn't be too bad, but obviously, with expansion, it gets very annoying. 
There is a custom hook that is responsible for the data we show on the page. Unfortunately, withouth BE pagination and proper cache, there are 3 states for the countries to be managed. In a better architecture, we would use `useInfiniteQuery` and get pagination from the BE withouth having to manage "big data" on the client. Still, using React's memo effects, I believe the performance is alright.

### Tradeoffs

I definately spent too much time on setup for things that are not that important at this stage. Therefore, I had to be faster in my implementation. Although, I believe, I achieved a fine result, I still feel like there are things missing and some things not optimized. I just would need more time to go and think throught the code to be perfectly happy with the implementation. But that is my mistake, I wanted to make things easier for myself by setting up convenient tools to use, but I fell into config hell and lost some time.

Most notable things that I would go through if I had more time are:
  1) Custom hook logic and can it be optimized
  2) Component separation and component offload. I feel like the components are a bit too busy atm.
