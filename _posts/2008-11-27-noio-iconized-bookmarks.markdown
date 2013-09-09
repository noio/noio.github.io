---
comments: true
date: 2008-11-27 23:13:46+00:00
layout: post
slug: noio-iconized-bookmarks
title: Noio Iconized Bookmarks
tags:
- coding
- plugin
- wordpress
---

As promised, I am releasing a plugin to help manage favicons in WordPress blogrolls. The plugin is still in an early stage, but it works fine for this site. If there is interest, I will polish it and add functions. I might eventually even add it to the WordPress plugin store if that is needed. The plugin has three features.


### List bookmarks with favicons

Upon activation there is a function available that works just like WordPress' built-in `wp_list_bookmarks`. The function is called `list_iconized_bookmarks()`, and it takes the same arguments as the original. The function takes images from the _link_image_ field of each link. The images are displayed in front of the link, with `class="favicon"`, and it is up to the user to define a proper style.


### Iconized Links Widget

There is also a replacement Links widget available, to get iconized bookmarks into your blogroll. This widget has one option, which is the arguments string, with the same [arguments](http://codex.wordpress.org/Template_Tags/wp_list_bookmarks) that are passed to `wp_list_bookmarks`. 


### Iconizing

Iconizing might be a bit of a stupid name, but what this function does is add favicon-URLs to each of your links' image fields! So you can just add a bunch of links to your blogroll, then run the plugin, and all favicons will be correctly set. You can start the plugin from the N.I.B. (Noio Iconized Bookmarks) panel in the settings screen. It allows you to define a default favicon, for when the real favicon cannot be found or doesn't exist. It also allows you to define a specific word that will 'lock' the favicon if you put it in the _Notes_ field of a link. Suppose you want to set another icon for a website, and you don't want N.I.B. to overwrite your custom icon when you run an update. Then you just put this locking word in the link's notes, and N.I.B. won't change the icon. 


### Download

To use the plugin, just copy `noio_iconized_bookmarks.php` into your plugin folder, and activate it on the Plugins panel.
**[Get it from the WordPress repository.](http://wordpress.org/extend/plugins/noio-iconized-bookmarks/)**



### References

I used a number of resources to help me build N.I.B. Here is some credit.

	
  * [Lonewolf-online's tutorial about widget control panels.](http://lonewolf-online.net/computers/wordpress/create-widgets-control-panels/)
	
  * [Devlounge's tutorial for constructing admin panels.](http://www.devlounge.net/articles/constructing-an-wordpress-plugin-admin-panel)

  * [Jeff Minard's function for retrieving favicon locations.](http://jrm.cc/)


If you use the plugin, please tell me what you think about it! I'm very open to suggestions for improvements. Finally, if you want to donate money towards development of this plugin, go [here](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=donate%40noio%2enl&lc=GB&item_name=noio%2enl%2fnoio%2diconized%2dbookmarks&item_number=plugin%2dpage&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG_global%2egif%3aNonHosted). 


