---

comments: false
date: 2018-11-21 13:00:00+00:00
layout: post
slug: stacking-more-boxes
title: Stacking More Boxes in Unity
thumbnail: /assets/2018-11-21-stacking-more-boxes/thumbnail.png
tags:
- unity
- games
- physics
typora-root-url: ..
---



Resuming the research from my previous post. I'm examining the influence of some more parameters on the stability of a stack of boxes.



## Compound Colliders

First thing I tried is the influence of using boxes that are composed of multiple box colliders (on the same *GameObject*). I thought that this setup might be making things worse.



![compound-colliders](/assets/2018-11-21-stacking-more-boxes/compound-colliders.png)

The image shows the difference between a box made up of compound colliders (left) and a single box collider of the same size (right).

![compound-colliders-stacking](/assets/2018-11-21-stacking-more-boxes/compound-colliders-stacking.png)

So it turns out that the difference is negligible. That makes sense if you realize that the physics engine is probably processing the same contacts since the boxes are still all axis-aligned. The only cost is in computations, because there are 5 times as many (in my example) box colliders to deal with. I did see about a 20% increase in the time spent on the physics step.

## Stacking One-by-One

I saw that a stack of boxes immediately compresses after spawning, and then bounces back up as all the penetrations are solved. So I figured that perhaps placing the boxes one by one and letting the stack come to rest before spawning another block might help. 

![bouncy-stack](/assets/2018-11-21-stacking-more-boxes/bouncy-stack.gif)

The image above shows the bounce resulting from creating a stack all at once.

![one-by-one](/assets/2018-11-21-stacking-more-boxes/one-by-one.gif)

By spawning the boxes one-by-one as you see above I was hoping to reduce the bounciness.

The boxes bounce less, but the overall effect on stability? Negligible.

![one-by-one-results](/assets/2018-11-21-stacking-more-boxes/one-by-one-results.png)

What that means is that the instability comes from the physics computation intrinsically, and not from the initial setup. Which you can see as good or bad news, depending on what you want to do.

## Lessons so far

What I am coming to realize with these experiments is that aside from the number of solver steps, there are not many things that severely impact the stability of a stack of boxes. My session of randomly tweaking different parameters to get things working was ineffective because the physics engine is pretty stable in its instability ;)

I have a good idea now of how much I should expect from the physics engine, and how much I will need to fix with more game-specific mechanisms for stabilization.

Get the code at https://github.com/noio/box-stacking-stability to to run your own experiment.