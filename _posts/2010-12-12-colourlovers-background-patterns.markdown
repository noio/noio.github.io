---
author: admin
comments: true
date: 2010-12-12 15:14:02+00:00
layout: post
slug: colourlovers-background-patterns
title: Colourlovers Background Patterns
wordpress_id: 298
categories:
- scraps
tags:
- javascript
---




## Setting a Random Colourlovers Background Pattern


Hooray for APIs! I wrote a function that gives your site a random background pattern, picked from the top rated patterns on [Colourlovers](http://www.colourlovers.com). You're seeing it in action on this page!
[javascript highlight="5"]function setRandomColourloversBackground(element){
    var r = new Request.JSONP({
        'url':'http://www.colourlovers.com/api/patterns/top',
        'callbackKey':'jsonCallback',
        'data':{'format':'json','numResults':25},
        'onSuccess':function(j){
            patterns = Array.from(j);
            pattern = patterns.getRandom();
            url = "url('"+pattern.imageUrl+"')"
            $(element).setStyle('background',url)
        }
    }).send();
}[/javascript]
It's picked from the top 25 patterns, but you could change that.

