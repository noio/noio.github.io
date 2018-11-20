---
comments: false
date: 2018-11-20 13:00:00+00:00
layout: post
slug: box-stacking
title: Stacking Boxes in Unity
thumbnail: /assets/2018-11-20-box-stacking/thumbnail.png
tags:
- unity
- games
- physics
typora-root-url: ..
---



While working on a prototype recently, I was mocking up a structure made of a tower of boxes in Unity's physics engine. I could not get them to stack in a stable way, which surprised me because it was 'only' 15 boxes high. I realized that I don't know how many boxes you can reasonable expect to stack in Unity's implementation of Physx. I did some searches, but "Unity Box Stacking Stability" did not turn up any numbers, except advice about different parameters to tweak. After an hour of tuning different physics settings back and forth, I decided to investigate a bit more thoroughly and share my findings.

The definition of "sucessfully stacking" that I used is whether a stack of boxes goes to *sleep*, or whether one of the boxes touches the ground after falling. When either of those things happens, I recorded how many frames that took. 



![animation-basic](/assets/2018-11-20-box-stacking/animation-basic.gif)



So, turns out that with Unity's default settings, you can stack up to about 12 unit-sized boxes (the thing you get when you do _GameObject > 3D Object > Cube_). However, with 10-12 boxes, they 'wobble' almost indefinitely, and it takes thousands of frames for them to go asleep, if they do so at all. I aborted the simulation at 1000 frames.

![chart](/assets/2018-11-20-box-stacking/unity-out-of-the-box.png)

Okay, so 20 boxes is definitely unstable. What can one do to make them stack nicely?

## Solver Iterations

The main factor in stability is the number of solver iterations steps that the physics engine applies per simulation frame. Good numbers for solver iterations are influenced by other factors. What counts is the number of solver steps relative to the amount of motion in a frame.

For example: with a longer `fixedDeltaTime`, objects with the same speed cover more distance in a single frame, so there are fewer solver iterations per distance of movement.

With a higher _gravity_, objects will fall faster in the same timespan, which also means fewer solver iterations per distance of movement.

From [Unity Docs: Physics Manager](https://docs.unity3d.com/Manual/class-PhysicsManager.html)

> **Note**: If you increase the gravity, you might need to also increase the **Default Solver Iterations** value to maintain stable contacts.

By decreasing the fixed timestep or the gravity, a stack of 20 boxes can be made stable:

![gravity](/assets/2018-11-20-box-stacking/gravity.png)

![timestep](/assets/2018-11-20-box-stacking/timestep.png)



However, it is likely that in a game the values for the fixed timestep and gravity are pinned by other considerations like gameplay. And because they influence stability in much the same way as the number of solver iterations does, I am just going to vary the number of iterations.

So, if you want to stack more boxes, increasing the solver iterations will eventually make it stable. The chart below shows how many you would need. Such high solver iterations counts are probably not feasible in a real game, but it gives an idea of what it costs to 'brute force' the stability. I ran each configuration multiple times, so the percentage below shows how many of those stacks eventually became stable and went to sleep.

![boxes-versus-solver-iterations](/assets/2018-11-20-box-stacking/boxes-versus-solver-iterations.png)



Of course, there are other, more thoughtful, ways to increase stability, depending on the gameplay you want to achieve. For example, you might not need all of the boxes to be simulated all the time, you could hold them in place with joints, etc. The goal of this post was simply to establish whether or not it is reasonable to expect a stack of boxes to stay in place without doing any of those things.

I used **Unity 2018.2**, which uses **PhysX 3.3.3** under the hood.

## Next post

I did some more experiments with boxes with compound colliders and a different method of stacking them in [the next post](/2018/11/stacking-more-boxes/)

