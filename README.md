# Pulse – Fitness Tracker

Pulse is a fitness tracking dashboard built with React and TypeScript. It allows users to record their activities, track daily steps and view an overview of their fitness data.

The project is being developed incrementally, with a focus on building practical frontend skills, writing reusable components and understanding how application state and data persistence work.

## Features

- **Fitness dashboard:** View activity statistics, including total steps, active minutes, calories and active days.
- **Activity tracking:** Add and view activities such as walking, running, cycling, strength training, swimming and yoga.
- **Activity management:** Edit and delete recorded activities.
- **Step tracking:** Add, edit and delete daily step entries.
- **Exercise breakdown:** View a breakdown of activity types, including their total duration and percentage of recorded activity.
- **Date range filtering:** Switch between weekly, monthly and yearly dashboard views.
- **Data persistence:** Activity and step entries are saved in the browser using localStorage, so data remains available after refreshing the page.

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- HTML
- Browser localStorage

## Getting Started

To run the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/Danielle73/pulse-fitness-tracker.git
   ```

2. Navigate into the project directory:

   ```bash
   cd pulse-fitness-tracker
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL provided by Vite in your browser.

## What I'm Learning

This project is an opportunity to develop my understanding of React and TypeScript through practical implementation.

Areas explored so far include:

- **Component-based architecture:** Breaking the interface into smaller, reusable components.
- **React state management:** Using `useState` to manage application data and interactive UI.
- **Props and TypeScript:** Passing data and callback functions between components with defined types.
- **Array methods:** Using methods such as `map()`, `filter()` and `reduce()` to transform and calculate data.
- **CRUD functionality:** Implementing create, read, update and delete operations for activities and step entries.
- **Data persistence:** Using `localStorage` and React's `useEffect` to save and retrieve application data.
- **Dynamic visualisation:** Using SVG and CSS to represent activity breakdowns visually.
- **Git and version control:** Working with incremental commits to track changes and document development progress.

## Future Improvements

Pulse is an ongoing project. Planned improvements include:

- Making the steps trend chart reflect recorded step entries.
- Improving dashboard calculations and date range filtering.
- Building a backend API using Node.js and Express.
- Integrating a PostgreSQL database.
- Introducing user authentication.
- Deploying the application.

## Project Status

Currently in development.