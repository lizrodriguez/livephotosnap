# Live Photo Snap
## General Assembly WDI Project 4 
## by Liz Rodriguez
![project4](https://github.com/lizrodriguez/livephotosnap/blob/master/public/images/LIvePhotoSnapCover.png)

I've decided to create an image gallery using Apple Live Photos. Live photos are taken with the iPhone 6/6S/7 and include movement before and after the picture is taken. Apple's [Live Photos JavaScript API](https://developer.apple.com/live-photos/) was recently released in April, so thought it would be fun to view Live Photos instead of regular images. Once the Live Photo is uploaded, a user can click on the ID of the image and be shown the make and model of the iPhone used as well as the location of where the image was taken.

The techology I've used in the project are:

[PureCSS](https://purecss.io/) for styling

Node.js

Express

PostgreSQL

[exif-js](https://www.npmjs.com/package/exif-js) to extract JPG metadata

[Google Maps API](https://developers.google.com/maps/) to display the map

[LivePhotosKit JS library]((https://developer.apple.com/live-photos/))

Wireframes:
![wireframe](https://github.com/lizrodriguez/livephotosnap/blob/master/public/images/wireframe.jpg)
![erd](https://github.com/lizrodriguez/livephotosnap/blob/master/public/images/erd.jpg)


Unsolved issues:

The major problem I ran into was that the Live Photos in the gallery don't display properly due to the nature of needing to upload 2 files at once, a .jpg and .mov. I will need to find a way for uploading straight from the iPhone to this web app. Ideally this would be a mobile phone app in the future. I also need to retrieve both .jpg and .mov from the database to my template engine. The ideal gallery would show up as in this [link](http://livephotosnap.herokuapp.com/gallery/goal).
