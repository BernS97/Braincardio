# BrainCard.

<img src="https://raw.githubusercontent.com/BernS97/Braincardio/main/public/appIcon.png" 
     width="250" height="250" />

## About.

_BrainCardio_ is a lightweight, fast and gamified flashcard application to support and fortify learning.
With this project, we, the makers of Braincard, attempt bring a mobile, cross-device and interactive platform to reality: fast, free of charge, no clutter. If you like, toggle on our gamified elements to fuel motivation, interact with you co-learners and get the most out of your learning with competitve elements.

Happy learning.

## How to contribute.

We use the following branch naming convention:

- features -> story/
- bugfixes -> bugfix/

## What tech we use.

- persistence: :fire:Firebase
- framework: :eyes: vue.js
- UI elements: :bomb: ionic

### Packages.

- NodeJS == 14.0.0
- Ionic == 7.0.2
- Capacitor == 4.7.3
- Vue == 3.2.47
- Pinia == 2.0.34
- Firebase = 9.19.1
- Vuefire = 3.1.0
- Npm == 8

## How to get started.

Install all dependencies with npm. 
In the root folder call:

`npm install`

### Start.

Start the project with the following command:

#### Web App.

`npx ionic serve`

Afterwards the code will be availible on the following route:
`localhost:9100`

#### IOS App on Simulator.

`npx ionic cap run ios --target=TARGET_UUID  --livereload `

### Debug project.

Use the source maps in the browser of your chosen, to debug the javascript code.

## How to build.

The following commands for building development:

### Development.

`npx ionic build && npx cap copy`
`npx cap sync --inline`
`npx cap sync --inline`
