---
author: admin
comments: true
date: 2008-10-24 16:51:19+00:00
layout: post
slug: adding-favicons-to-links
title: Adding favicons to links
tags:
- wordpress
- javascript
---

For the new design of my website I wanted to add some favicons to the blogroll. Not only do favicons make links recognizable, but a list of links with favicons is also a colorful but regular graphical element. The problem is that not every site has it's favicon stored in the same place. So you need a way to retrieve either the favicon location, or the favicon itself, to show it next to a link. I didn't want to have to look up the favicon every time I added a link to my blogroll, so an automated method was what I was looking for.

There's a couple things to know. First of all, most websites just store their favicons in a location like `www.example.com/favicon.ico`. If all websites would do this, you might think, there wouldn't be a problem? Well, problems arise on websites with subdomains. Consider for example [`http://andr01d.newgrounds.com`](http://andr01d.newgrounds.com). As you can see, the favicon is not located by just [appending `/favicon` to the link](http://andr01d.newgrounds.com/favicon.ico).

The way these websites point the browser to the favicon is by a tag in the head of the HTML. Like on this website. My favicon is hardly in an extraordinary location, but it felt safe to tell the browser where to look anyway.

```html
<link rel="SHORTCUT ICON" href="http://www.noio.nl/favicon.ico"/>
```

The problem is that not all websites use the same method. Some have easy locations, some have a SHORTCUT ICON tag, some have both. 


### Google Shared Stuff

The best solution to a problem like this is letting someone else do the job. Google has an undocumented feature to retrieve the favicon for a certain link. I discovered this on some [recent blog posts](http://www.gtricks.com/2008/09/google-s2-share-stuff-and-also-favicon.html). This seems ideal, all you would have to do is create an image, and set the source to Google's url.

```html
<img src="http://www.google.com/s2/favicons?domain=famfamfam.com">
</img>
```


Unfortunately, the method has a few disadvantages. 




  * Not all favicons can be retrieved, for example, [andr01d.newgrounds.com](http://www.google.com/s2/favicons?domain=andr01d.newgrounds.com) still fails. You do get a nice default icon though. 

  * The favicons get a white background, even if they are transparent. This would be ok for a white website, but I wanted to show transparent icons like they were meant to look.

  * Since Google had no documentation on the feature, there is no guarantee that the service will be up forever. Depending on other sites is always a bit risky. (This even goes for Google)


The white background made me discard this method.



### Javascript


This is a method that actually came very close to being usable.
The code below is an adaptation of [this method by "the CSS guy"](http://www.askthecssguy.com/2006/12/hyperlink_cues_with_favicons.html), but using [mootools](http://www.mootools.net), to make it a bit shorter. The way you use it is as follows: just call the function as soon as the page is loaded, and specify what container you want to have the links faviconized in. For example: `faviconizeElements('.bookmark-list li', 'image/defaulticon.png')` would add favicons to all links inside a `'bookmark-list'`.

```javascript
function faviconizeElements(selectors, nofavimg){
  var links = $$(selectors + ' a');


  links.each( function(link, index){
    var href = link.get('href');
    var fvcurl = getDomainFaviconURL(href);
    if(!fvcurl) fvcurl = nofavimg;

    var fvc = new Element('img', {
      'class':'faviconimg',
      'src':fvcurl,
      'events':{
        'error':function(){
          this.src = nofavimg;
        }
      }
    });
    fvc.inject(link.getParent(), 'top');
  });
}
```


The critical part is, ofcourse, how to get the URL of the favicon? This simple regular expression basically adds `/favicon.ico` to the domain. This will not work for all links, that's why you can specify an icon to use as a default, if the favicon is not found.

```javascript
function getDomainFaviconURL(linkurl){
  var domain = linkurl.match(/(\w+):\/\/([^/:]+)(:\d*)?([^# ]*)/);
  domain = RegExp.$2;
  var faviconurl = "http://"+domain+"/favicon.ico";
  return faviconurl;
}
```

With this method we still don't catch the favicons that are not in a default location. To do that we would actually have to look into the HTML of the linked file, and find the SHORTCUT ICON tag. If we would load the HTML of every linked page to get the favicon, this would take a long time, and in the meantime there would be no favicons. With a lot of links, this might even take longer than the user spends looking at a page! And worse: the whole thing would be repeated every time the page loads. So, in a javascript approach, we are limited to fetching favicons with easily guessable locations.


### WordPress specific

So, in order to avoid the problems of having to fetch the favicons while the user is waiting, I decided to store the favicon locations permanently in the WP-Links table. Each link in wordpress can have an image specified, and I will use that field to store the locations of the favicons for each link. I am writing a plugin for wordpress that can check for the locations of favicons, first by appending `/favicon.ico`, if that fails by downloading the HTML and looking at the SHORTCUT ICON tag. Then the plugin will store the found locations in the table. This is nice because the locations are stored, so they will only have to be found once. I will share the plugin, keep an eye out for a future post.


### Plugin

The plugin is finished, check it out [here](http://www.noio.nl/2008/11/noio-iconized-bookmarks/).
