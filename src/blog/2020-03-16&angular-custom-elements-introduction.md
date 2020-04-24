![logo](https://dev-to-uploads.s3.amazonaws.com/i/1in1ws6i5rq5a14mjclq.png)

In a land of framework wars, one thing that could help us are web components. Creating components and being able to use them in any javascript framework would be nice..in this series we will explore creating web components using Angular, publishing them and using them in plan javascript, React etc.


Lets start by creating a new application
```
ng new br-date
```
Add @angular/elements package
```
ng add @angular/elements
```
Generate new component (I created br-date but you can use whatever you want)
```
ng generate component br-date
```

We need to update entryComponents inside app.module.ts to include our newly created component  and also define a custom element.

App module will look like this:

```
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector } from "@angular/core";
 
import { AppComponent } from "./app.component";
import { BrDateComponent } from "./components/br-date/br-date.component";
 
import { createCustomElement } from "@angular/elements";
@NgModule({
 declarations: [AppComponent, BrDateComponent],
 imports: [BrowserModule],
 providers: [],
 entryComponents: [BrDateComponent]
})
export class AppModule {
 constructor(private injector: Injector) {}
 
 ngDoBootstrap() {
   const element = createCustomElement(BrDateComponent, {
     injector: this.injector
   });
 
   customElements.define('br-date', element);
 }
}

```

Inside ngDoBootstrap function, we are creating a custom element using createCustomElement method from @angular/elements and defining br-date component.

We also need to update our angular.json. Inside projects->br-date->architect->build->scripts object we need to add:

```
{
   "input": "node_modules/document-register-element/build/document-register-element.js"
}

```

By default, angular will hash outputs inside dist directory, which is not really useful when building a web component we plan to publish.

Lets create custombuild.sh file with following content:
It will build application without hashing and concat source files inside index.js file.

```
#!/bin/sh
ng build br-date --prod --output-hashing=none && cat dist/br-date/runtime-es5.js dist/br-date/polyfills-es5.js dist/br-date/scripts.js dist/br-date/main-es5.js > dist/br-date/index.js
```

Now we can test this.
Fastest way, in my opinion to test this, is to create a example folder with index.html and index.js.

index.html will have following content

```
<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Document</title>
</head>
<body>
   <br-date></br-date>
   <script src="./index.js"></script>
</body>
</html>
```

and inside index.js we will just import our built component.

```
import '../dist/br-date/index';
```

We can run example app using Parcel or whatever you like.
Inside the example directory, run parcel index.html
You can get more info if you are interested at : https://parceljs.org/

When you open your app in browser, you should see something like this:
![End REsult](https://dev-to-uploads.s3.amazonaws.com/i/3ig3spse7cxbcvlpnmmx.png)

If you encounter some problems, you can leave a comment here.
Source code is hosted at: https://github.com/BrsJsk/br-date