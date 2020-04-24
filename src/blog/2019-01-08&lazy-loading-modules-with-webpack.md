![](https://thepracticaldev.s3.amazonaws.com/i/b14q99oadv8qik76vqe3.png)

Webpack is a great tool and it's really great to know at least basics of it. If we are working with Angular CLI, or Create React App, we already have webpack setup there, but if we are working on a web application that's not using a Javascript Framework, we should probably user a bundler. Sure, we could go with no-setup-needed Parcel but if we want more control, go with Webpack. My personal web site is all Javascript, only one HTML file and no framework. I'me using webpack as a bundler and lazy loading to improve performance and I'm really happy with it!

To get started, run npm init -y and create the following structure:

```
src / 
--- notLazyLoaded.js
--- lazyLoaded.js
index.html
main.js
webpack.config.js
```

Run the following command to install webpack:
```
npm install webpack webpack-cli html-webpack-plugin webpack-dev-server --save-dev
```
We've installed webpack, webpack plugin for adding our index.html into the bundle and dev server.

Let's add some code to our webpack config
```
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./main.js",
  output: {
    filename: "[name].[hash].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ]
};

```
Inside our package.json, add a script to bundle and run.
```
 "webpack": "webpack-dev-server --open"
```
Pretty basic but it will bundle our application and open our web application on port 9000.

Inside the HTML file, I've added 2 buttons, one will call notLazyLoaded.js and the other one will lazyLoaded.js

```
<body>
    <button id="alert">Alert</button> 
    <button id="lazyAlert">Lazy Alert</button>
  </body>
```

lazyLoaded.js and notLazyLoaded.js have basically same code.
# lazyLoaded.js

```
const showLazyAlert = () => {
  alert("Hello from lazyLoaded.js");
};

export { showLazyAlert };

```

# notLazyLoaded.js

```
const showAlert = () => {
  alert("Hello from notLazyLoaded.js");
};

export { showAlert };

```

In our main.js, we will add code to show an alert depending of the button clicked.

```
import { showAlert } from "./src/notLazyLoaded";

window.onload = () => {
  const alertBtn = document.querySelector("#alert");
  const lazyAlertBtn = document.querySelector("#lazyAlert");

  alertBtn.addEventListener("click", () => {
      showAlert();
  });
};

```

Currently, if we open the app, we see in the network tab that only main.js is loaded on initial load, we click the 'Alert' button and an alert shows up which is already loaded in the bundle. Now comes the main part, making changes so when user clicks on 'Lazy Alert' button, lazyLoaded.js module loads and executes.

Inside main.js, add following code
```
lazyAlertBtn.addEventListener("click", () => {
    import(/* webpackChunkName: "lazyLoaded" */ './src/lazyLoaded').then(module => {
        module.showLazyAlert();
    });
```
Save and open the app. On initial load, we only have the main.js bundle loaded, when we click the Lazy Alert button, lazyLoaded.js bundle loads and executes code. That's it. It will load only when it needs to load and will improve initial load time and overall performance of the app.

Source code is hosted on Github.
```
git clone https://github.com/BrsJsk/webpack-lazy-loading
cd webpack-lazy-loading
npm i
npm run webpack
```