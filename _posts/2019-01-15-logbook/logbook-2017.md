---
title: Garbage Country Logbook 2017
slug: garbage-country-logbook-2017
layout: post
typora-root-url: ../../
---


- [Intro](/2019/01/garbage-country-logbook)
- [Logbook 2017](/2019/01/garbage-country-logbook-2017) 👈 You are here.
- [Logbook 2018 Part 1](/2019/01/garbage-country-logbook-2018-pt-1)
- [Logbook 2018 Part 2](/2019/01/garbage-country-logbook-2018-pt-2)
- [Logbook 2018 Part 3](/2019/01/garbage-country-logbook-2018-pt-3)
- [Logbook 2019](/2019/01/garbage-country-logbook-2019)
- [Gallery](/2019/01/garbage-country-logbook-gallery)

---

## Week 41

Setting up a project and workspace.

## Week 42
Work on synchronizing multiplayer controls. If multiple players are to live inside the same simulation, they all have to be able to affect the simulation in a deterministic way.

- [x] Mouse controls camera angle
- [x] Blocks respond to size
- [x] Blocks should be simulated on the server side

# Week 44
Blocks can be placed in the world now, but there is no 'construction' because the blocks cannot be stacked. Need to create a mechanicsm for actually building constructions out of multiple blocks. This means stacking and snapping the blocks when they are created. 

- [x] Blocks snap to nearest block
- [x] Being able to create ceiling supported by pillars


![image](/assets/2019-01-15-logbook/2017-11-01%20at%2014.34.57.png)

![image](/assets/2019-01-15-logbook/2017-11-03%20at%2013.28.44.png)

The next step is to figure out how to also update the properties of the terrain (ground) in a networked & physics-proof way.

- [x] Sync a terrain object between networked players.
- [x] Send small 'patch' updates when the terrain is modified.

A terrain consists of a 256x256 heightmap. When a new player connects, this heightmap needs to be sent to that player. Updating the entire heightmap on each change is a waste of bandwidth. So only the updated patches are sent over the network. However, these patches also need to be processed back into the terrain for when new players connect. So it is necessary to keep a list of 'unprocessed' patches, which is also sent to each player. This list can be merged into the heightmap periodically.

- [x] Save a list of patches for new players.

Currently, construction is made difficult because it's hard to view the world from a useful angle. 

Because blocks can be dynamically sized, they can't be textured in a standard way (UV coords and an image texture). Generating textures dynamically for blocks is an effective solution

- [x] Create better camera controls.
- [x] Generate UV coordinates and procedural textures.

![image](/assets/2019-01-15-logbook/2017-11-04%20at%2021.24.41.png)

On an irregular terrain, the position of the player locally and on the server starts to drift. It's not immediately obvious why this happens.

- [x] Fix Position drift
- [x] Terrain material

## Week 45

![image](/assets/2019-01-15-logbook/2017-11-06%20at%2017.15.43.png)

Still the biggest hurdle for building collaboratively in the world is being able to navigate it smoothly and previewing where constructed items are placed. Because the terrain is irregular now (shaped by the players), it would be beneficial if the initial items are 'fixed' into the ground.

- [x] Improve mouse controls / placement
- [x] Fix pillars into ground

Pillars that are set on the ground are now anchored into the ground. However, this means that the tops are often at different heights:

![image](/assets/2019-01-15-logbook/2017-11-07%20at%2014.26.29.png)

In order to be able to add a floor or ceiling on top of these pillars, they need to be dynamically _clipped_ when building the floor. 

- [x] Clip pillars when building a floor or ceiling.
- [x] Correctly compute size of ceilings.

![image](/assets/2019-01-15-logbook/2017-11-07%20at%2016.49.12.png)

I suspect that this clipping will get really complicated and have a lot of unforeseen consequences because the world is not voxel/grid based. For now, clipping works and pillars can be built on top of other floors. 

Today I did a little bit of visual work on the pillars, generating a procedural texture for their dynamic size. And also adding decorations based on their size and role in the building. Pillars can register if they are "supports" which is important for adding additional elements. That is: if a pillar is a support, it can not be clipped so easily when adding a floor. 

![image](/assets/2019-01-15-logbook/2017-11-08%20at%2016.01.33.png)

### Smaller construction elements
The next step is to create more tools for players to _navigate_ the world. Mostly, being able to build smaller building elements inside the block skeletons (like ladders!). These smaller elements should not interact with the bigger blocks, to save performance. The server architecture will end up something like this:

```
+--------------------+    Computes the interaction of big blocks with each other
| LARGE SCALE SERVER |    and periodically updates the terrain tiles.
+--------------------+    Players are not present/simulated in this server.  
  |
  |={Position of blocks}
  |
  |      +-------------------------+  Computes the interaction of players with eachother,
  |--->  | PLAYER BEHAVIOUR SERVER |  the blocks, and the terrain. Blocks and terrain are
  |      +-------------------------+  "static" (kinematic) in this server.
  |          |
  |          |={Player positions}
  |          V
  |      +----------------+   
  +--->  | PLAYER CLIENTS |   Handles player controls and visualisation.
         +----------------+
```

## Week 46

Working on the smaller construction elements.

- [x] Create a "Board" entity that represents a wooden board
- [x] Boards can be picked up on the server side.
- [x] Boards can be placed by dragging the mouse to two points.
- [x] Board is anchored somehow to big block elements. Either a fixed joint or parenting to save physics computations.
- [x] Validate the placement of attached boards.

Currently, the validation of where blocks can and cannot be placed is starting to get pretty gnarly. It was to be expected that this is much harder in a free-building game than in a voxel based game. The basic system works though, it simply prevents shapes from overlapping with each other. 

![image](/assets/2019-01-15-logbook/2017-11-14%20at%2018.13.06.png)
![image](/assets/2019-01-15-logbook/2017-11-14%20at%2018.14.06.png)
![image](/assets/2019-01-15-logbook/2017-11-14%20at%2018.14.35.png)

Today I worked on a more robust system for picking up (and placing) objects in a multiplayer game. After [some discussion](https://forums.improbable.io/t/player-holding-an-object-managing-authority/3287/7). I am using the following full roundtrip:

```
Player(Client)     Player(W1)          Object(W2)
  |                   |                    | 
  | --(CMD: Grab)->   |                    |
  |                   | ---(CMD: Grab)->   |                
  |                   |                    | 
  |                   |  <---- ( OK ) ---- | 
  | <---- ( OK ) ---- |                    | 
  |                   |                    | 
```



## Week 47

Last week I really started running into the classic difficulty of multiplayer games: syncing object state between server and client while still maintaining a pleasant and smooth visualisation client-side. I implemented a method known as "Client Side Prediction and Reconciliation" for player movement. The next step is to apply this method to more complicated movement, such as through buildings or on ladders.

Improved the system for placing ladders, and created a way for players to interact with those laters. 

![image](/assets/2019-01-15-logbook/2017-11-20%20at%2016.59.24.png)

Added dynamic simulation of overgrowing vines.

![image](/assets/2019-01-15-logbook/2017-11-24%20at%2018.15.57.png)

## Week 48

A big obstacle is still the user controls. It is unclear where and how blocks will be placed when clicking the cursor. 

- [x] Fix cursor positioning.

A problem that exists currently is the that modifications need to be 'atomic'. When creating a new block on the server, other blocks are modified even _before_ it has been decided whether the new block can even be placed. To fix this, instead of immediately editing other blocks when a command comes through, a list of blocks that should be modified is cached until it is certain that the command can succeed, then the cached list is processed.

- [x] Make block validation and editing atomic.
- [x] Don't snap blocks that extend a pillar.

This week I also introduced stairs. On the server, stairs are simulated as a rectangular block, just like any other, only on the client do they render as stairs when a variable "stairs_angle" is set. 

![image](/assets/2019-01-15-logbook/2017-11-30%2014.56.58%20Screenshot.png)

![image](/assets/2019-01-15-logbook/2017-11-30%2015.21.45%20Screenshot.png)

## Week 49

To stabilize the physics when adding stairs (which are diagonal blocks), they probably need some supports so that they can rest "flat" on top of pillars.

- [x] Add stair supports

I added some simple code for jumping: setting the velocity.y of a rigidbody. Unfortunately this turned out to be naive. The current Prediction/Reconciliation strategy is not precise enough for fast movements.

- [x] Better interpolation inside the Reconciliation algorithm
- [x] Check preconditions for jumping also on the client side.

Part of this project is about introducing dynamic interactions with the terrain around the player. Now that most block construction works, it's time to focus on that a little. When buildings topple, the parts should turn into rubble, rubble falls down onto the terrain, and causes the terrain to change (i.e. the rubble forms a heap). 

- Rubble should always fall down and disappear, and not stay around on top of buildings, because that will cause too many persistent objects
- Rubble should bounce a couple of times to knock over other blocks (creating a domino effect).
- When it hits the ground, it should form a heap on the heightmap.


## Week 50

This week I want to do some prerequisite work for splitting of the "large scale physics" server into its own C++ program. This means much stricter management of the entity authority lifecycle.

- [x] Check for authority when destroying a block
- [x] Disable collisions between blocks and terrain because blocks will be simulated on a different worker
- [x] Destroy rubble when it falls through the world, check for authority

A new small issue popped up: Pillars vary in height, and every time the height changes because of construction, the position also changes. If the position of pillars was set to the base point, we could save on position updates for these situations where only the height changes.

- [x] Change positioning to mean the 'base position' of objects instead of the center. 

Today: more efficient patching of terrain height, and adding the ability to actually modify the terrain _type_ as well. (Adding a simulation of growing grass and debris that stays around after player buildings crumble).


![flowchart](/assets/2019-01-15-logbook/flowchart-diagram.png)


Now that patches are sent as a relative height update and not as an absolute value, this becomes problematic. Sometimes a patch is processed twice because of unreliable transmission. But when a relative patch is applied twice, the terrain is changed twice. A patch with absolute values would not have this problem. 

This is a kind of tricky problem. Should I send the current light-weight delta updates or full heightmap values. 

![image2](/assets/2019-01-15-logbook/2017-12-14%2017.07.58%20Screenshot.png)


I wrote a system that could be extended to process both light weight updates and full patches.

## Week 51

In order to make sure that the world does not become cluttered with unused blocks—some automatic cleanup is desirable. This could be done by slowly decaying blocks that are not supporting any other blocks. I.e. single pillars on the ground. However, _detecting_ whether a block is supporting another block is not trivial. The entity data already contains a `support` flag, but that only keeps track of the block's initial state. The blocks would have to constantly poll for a block on top, and I'm not sure if that is a good idea..

- [x] Get rid of the `support` flag because it is always outdated anyway

- [x] Update floor placement to no longer check for the `support` flag

- [x] Let players create adjacent sections of floors instead of large floors.

![2017-12-18 17.14.06 Screenshot](/assets/2019-01-15-logbook/2017-12-18%2017.14.06%20Screenshot.png)

### Fog/Athmosphere Simulation

Part of the research goal is also finding an efficient distributable way to simulate dynamic athmospherics. A fog represented as a heightmap is a good initial representation that looks good from a high angle. However, when viewed from a low angle or from inside, the illusion falls apart.

![2017-12-19 at 09.44.56](/assets/2019-01-15-logbook/2017-12-19%20at%2009.44.56.png)



![2017-12-19 09.45.11 Screenshot](/assets/2019-01-15-logbook/2017-12-19%2009.45.11%20Screenshot.png)

![2017-12-19 at 17.00.56](/assets/2019-01-15-logbook/2017-12-19%20at%2017.00.56.png)


Last task is doing a revamp of the vine datastruture. Storing vines position relative to the last node, instead of storing each node's position and rotation independently will save a lot of data in storage and transmission, and greatly reduce the entity count, which is advantageous for performance as well.

## Week 52

The few days left in this week I dedicated to a camera system that follows the player but takes into account the shape of the player buildings and prevents obstructing the view.

### Todo's for later

- [x] Check for collisions with a block size including a margin.
- [x] Update the positioning method to send POS+ROT in one component. 
- [ ] Create new TerrainData for each tile, they currently share an asset.

---

- [Intro](/2019/01/garbage-country-logbook)
- [Logbook 2017](/2019/01/garbage-country-logbook-2017) 👈 You are here.
- [Logbook 2018 Part 1](/2019/01/garbage-country-logbook-2018-pt-1)
- [Logbook 2018 Part 2](/2019/01/garbage-country-logbook-2018-pt-2)
- [Logbook 2018 Part 3](/2019/01/garbage-country-logbook-2018-pt-3)
- [Logbook 2019](/2019/01/garbage-country-logbook-2019)
- [Gallery](/2019/01/garbage-country-logbook-gallery)
