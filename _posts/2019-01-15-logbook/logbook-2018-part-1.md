---
title: Garbage Country Logbook 2018 pt.1
slug: garbage-country-logbook-2018-pt-1
layout: post
typora-root-url: ../../
---

- [Intro](/2019/01/garbage-country-logbook)
- [Logbook 2017](/2019/01/garbage-country-logbook-2017) 
- [Logbook 2018 Part 1](/2019/01/garbage-country-logbook-2018-pt-1) 👈 You are here.
- [Logbook 2018 Part 2](/2019/01/garbage-country-logbook-2018-pt-2)
- [Logbook 2018 Part 3](/2019/01/garbage-country-logbook-2018-pt-3)
- [Logbook 2019](/2019/01/garbage-country-logbook-2019)
- [Gallery](/2019/01/garbage-country-logbook-gallery)

---

## Week 2 & 3

Fixing player prediction and movement on stairs. Using a rigidbody simulation for player movement has advantages and disadvantages.

**Pros**

- Players can collide and will push eachother back
- Players can be affected by other physics objects

**Cons**

- Rigidbodies will slide down hills which is not desired behavior for players. A lot of additional mechanisms are needed to make players behave predictably

Created variable jump height using the *"Cap Velocity on Button Up"* method.

## Week 4

Basically just did blender tutorials on rigging and animating.

![2018-01-24-walk-cycle](/assets/2019-01-15-logbook/2018-01-24-walk-cycle.gif)





## Week 5

Working on a character model.

![2018-01-19 s](/assets/2019-01-15-logbook/2018-01-19%20s.png)

![2018-01-19 s](/assets/2019-01-15-logbook/2018-01-30%20at%2012.21.12.png)



![2018-01-31 17.09.35 Screenshot](/assets/2019-01-15-logbook/2018-01-31%2017.09.35%20Screenshot.png)



![Screen Shot 16.20.48%20at%2016.20.48](/assets/2019-01-15-logbook/2018-02-01%20at%2016.20.48.png)



**Character Model TODO**

- [x] Write ramped shader that uses vertex color as max lighting. 
- [x] Re mirror bone structure
- [x] Running animation
- [x] Idle animation
- [x] Hook up animator in real project
- [ ] Make walk animation a little more fluid
- [ ] Fix run animation leg trail
- [x] Set UVs on model
- [x] Create void mesh inside model
- [x] Copy shader / ambient setup
- [x] Get the hair back



---

Last day of this week, gonna start moving the physics computation to a separate C++ program. Managed to send transform updates from C++ already.

- [x] Install Bullet physics
- [x] Figure out how to include external libraries into the worker
- [x] Hook up physics library





## Week 6

Next steps:

- [x] Test the order of entity creation and adding components
- [x] BigPhysicsWorker
    - [x] ProcessOps
    - [x] Listen to events (critical section etc.)
      - [x] `OnAddEntity` adds to list of new entities
      - [x] `OnCriticalSection`: go through new entities:
        - [x] transfer batch to list for creation
      - [x] `OnRemoveEntity`  
        - [x] Somehow notify GameObject of removal? 
    - [x] has-a `Dispatcher`
        - [x] use ForEachComponent to track Entity Changes
        - [x] Handler class (TrackComponentChanges)
    - [x] Map of `SpatialEntity`
        - [x] Tracks authority status per component (map)
        - [x] has-a Entity with component data
    - [x] Update loop:
        - [x] GameObject create
            - [x] Go through new entity list and call Create
        - [x] Go through destroyed entity list and
            - [x] destroy GameObject
            - [x] gameobject needs destructor
        - [x] Gameobject Update
        - [x] simulate physics
    - [x] list of `GameObject`
        - [x] pointer to SpatialEntity
        - [x] pointer to rigidbody, shapes, motionstate, etc.
        - [x] Maybe need a separate create/destroy loop
        - [x] method to create 
            - [x] first link to spatial entity
                - [x] then call "create block shape"
        - [x] `update` method (copies both ways `<—>`)
        - [x] flag for `kinematic`
            - [x] set kinematic in bullet
        - [x] lastUpdateSent 
- [x] Everything Namespaced
- [x] `utils.h`
- [x] `constants.h`
- [x] Need to check out Block components
- [x] Run thread for Update




It's Friday and I got it to work! However, I'm also going to try a different approach. To enable fast iteration, it would be more convenient if different server types can share code, not having to duplicate physics object creation between C# and C++. 

- [x] First off, it would be smarter to put as much of the object definition as possible into the schema, so that different worker types can just read from the schema instead of duplicating the creation code
- [x] Second — for now — use a hack to simulate big physics _inside_ the unity worker.

The hack is as follows:

- [x] create a ProxyBody that simulates a rigidbody in a separate environment.
    - [x] Proxybody can be `SetStatic`
    - [x] Proxybody can `UpdateColliders` (and mass etc)
    - [x] Can `SetDirection` which in turn sets kinematic back on the controlled rigidbody (depending on the static flag). 

## Week 7

Todo's before going to Improbable office

- [x] Fix the proxy bodies
- [x] Fix the ladder attachment (was actually just not correcting drift so player was off in server/local)

Spent some time making it easier to create stairs. Before this it was only possible to create stairs from pillar to pillar. Now the stairs can also be built on top of or towards a floor, as seen below. Additionally improved how easy it is for the player to climb stairs.

![2018-02-12%20at%2016.40.10](/assets/2019-01-15-logbook/2018-02-12%20at%2016.40.10.png)



## Week 8

![2018-02-19 naive_interpolation_without_velocity](/assets/2019-01-15-logbook/2018-02-19%20naive_interpolation_without_velocity.gif)



![2018-02-19%20at%2018.05.32](/assets/2019-01-15-logbook/2018-02-19%20at%2018.05.32.png)



The animation above shows the issue when trying to simply send position updates (it shows a player jumping). Floaty movement! A first fix is to always send a position update when the velocity changes rapidly as an "anchor point". But the interpolation needs to be tighter.

- [x] Implement the proper method for calculating target interpolation time. (moving average of srv-cli difference)
- [x] Use events to send the positions
- [x] Proper tweening for yaw? Just infer yaw? 


**For the rest of this week**

Going to try and make the environment more interactive. Adding simulated elements like grass and water. 

- [x] Receiver listens to component updates on `TerrainTile` and unpacks data.
- [x] Receiver applies patches when they come in from `TerrainTile`
- [x] Receiver computes 'effective height' from rock + debris and exposes this.
- [x] Receiver doesn't listen to updates on authoritative worker
    - [x] Gets patches directly from sender
- [x] Senders perform slow (but ordered) update loop of the terrain.
- [ ] **GRASS**
    - [ ] light direction vector
    - [x] Slow update loop
    - [x] Keeps track of current square
    - [ ] factor in: light, steepness?
- [x] Use 1D arrays and compute 2d coords manually.



Managing some kind of terrain simulation:

![2018-02-23 16_23_12](/assets/2019-01-15-logbook/2018-02-23%2016_23_12.gif)

## Week 9

Continued work on the grass update method. Each slow update hook updates a section of the terrain, and updates only half the entries in a checkerboard pattern. This is to prevent two adjacent entries from being updated in the same frame and obviates the need for a "double buffered" approach.

```
even frames:   
x_x_x_x_
_x_x_x_x
x_x_x_x_
_x_x_x_x

odd frames:
_x_x_x_x
x_x_x_x_
_x_x_x_x
x_x_x_x_
```

Then, work on planting detail meshes around the player on the terrain.

![2018-02-28 14_52_42](/assets/2019-01-15-logbook/2018-02-28 14_52_42.gif)

Blocks above show the detail meshes being placed around the player. Below they have been replaced by an actual plant model.

![2018-02-28%20at%2011.05.44](/assets/2019-01-15-logbook/2018-02-28%20at%2011.05.44.png)



## Week 11

Continued work on randomizing plants.

It's really hard to match the plants to the terrain because they use a different lighting model. I think I have to fix the terrain shader now to match the two tone simple lighting.

What to do today?

- Fix the colors. Maybe create a universal color palette for the environment? Is tricky tho because the lighting model is added on top of that. But at least the source colors could be constant.

- Look at the SlowUpdate model. Is it fundamentally flawed? The more vines are added the slower the grass grows. I guess I said it would only be for 'convergent systems' i.e. systems that will end up in a certain "steady" state after a number of updates. Is the grass such a system or does it grow too slowly? I could also just crank up the number of iterations initially but that might make the vines grow like crazy. 🤔

  ​


## Week 14

![2018-04-06 at 17.27.19](/assets/2019-01-15-logbook/2018-04-06%20at%2017.27.19.png)

Working on a seamless texture for the rocks based on a 3d sampling. I started out with a simple 3d texture of 32x32x32 with something like a tiled/repeating voronoi diagram.

![2018-04-06 output](/assets/2019-01-15-logbook/2018-04-06 output.png)

Then I just sample from this texture based on world space coordinates. Then I added a slider that actually offsets the 3d sample in the direction of the surface normal — with a distance based on the first sample value — for some weird refractive patterns:

![](/assets/2019-01-15-logbook/2018-04-06 17_42_22.gif)

Not really appropriate though. And really doesn't fit with the pixel aesthetic of the other textures. Tricky stuff!

![2018-04-07 at 13.46.45](/assets/2019-01-15-logbook/2018-04-07%20at%2013.46.45.png)

Also, I think I need to generate a good-looking heightmap first before trying to texture it based on its shape. If the shape changes drastically, so will the texturing.

---

Gonna switch to some camera jobs.

Did some work on the camera and cursor, not ideal but better than before. 👍 Made the camera follow the player when walking, and completely decoupled the crosshair position from the camera angle when standing still.

## Week 15

Worked on player movement. Ledge hanging now looks acceptable.

## Week 16

Working on terrain generation. Since I need to generate a 2D heightmap I need to write some 2d-image manipulation tools. (Matrix multiplication, blend modes, etc).

![2018-04-19 at 17.00.09](/assets/2019-01-15-logbook/2018-04-19%20at%2017.00.09.png)



## Week 17

http://catlikecoding.com/unity/tutorials/rendering/part-14/



![2018-04-25 at 14.57.03](/assets/2019-01-15-logbook/2018-04-25%20at%2014.57.03.png)



## Week 24

Hello. 

So, it's kind of bullshit work but I tweaked the terrain generator to store the heightmap in a 32-bit float texture to get rid of the 'stepping' introduced by 8-bit values. 8-bit values can only contain 256 different heightmap values, which is wayyy not enough to make smooth terrain.



## Week 25

The real question is what the fuck am I doing with this game though? Can it be fun? What's the minimum amount of things it needs to be fun? Like a game loop? Maybe that starts with gathering some resources:

**Minimal dependencies:**

![gameplay dependencies](/assets/2019-01-15-logbook/gameplay-dependencies.png)

- [x] Create datastructure for inventory in PlayerStatus

Next step: create some kind of method for digging around in the ground. This probably means that first I will have to fix the cursor UI. I think the cursor should have two modes: **locked** and **unlocked**. In **locked mode**, the cursor is always in the middle of the screen, and moving the mouse will move the view. The player moves relative to the view direction. 

- [x] Create simple 3d models for the WorldItems (wood / bag of cement)
- [x] Reduce drop chance on world items
- [x] Create particle effect on dig



![2018-06-21 at 16.59.27](/assets/2019-01-15-logbook/2018-06-21%20at%2016.59.27.png)



- [x] **Carrying Objects**
  - [x] Create carry animation (Animation Layer with hands / feet ?)
  - [x] put carried objects into / on player?! — Both local player and remote player needs to show stuff in inventory.. Create PlayerReceiver class for both I guess? Just set from Data initially without shortcutting for local player? yeah. 
  - [x] carrying multipe objects: stack them on
  - [x] How to sync this animation in multiplayer? NO IDEA I'M FUUUUCKEED.. (ok just roundtrip it to the server for everybody cause i'm lazy like that.)
  - [x] drop objects too



![2018-06-22 at 15.00.41](/assets/2019-01-15-logbook/2018-06-22%20at%2015.00.41.png)



**Terrain Related**:

- [x] smooth out debris layer periodically with a backbuffered method.
  - General strategy for terrain seams:
    - [ ] `GetEffectiveHeight` smooths out seams with neighboring terrain always. That's the only thing that _really_ has to match anyway (the effective final heightmaps)
    - [x] ➡️ Option A: All computations get data from next tiles
  - [x] Do a prepass to collect data (including 'over the seam') and put it into a buffer that also serves as the backbuffer. This way we only have to checkout the 'neighbor' tile once or twice.
  - [x] first just smooth debris alone, regardless of underlying terrain
    - [x] take the sum of the differences to the four neighbors
    - [x] if that sum exceeds a certain threshold (x4), modifiy by a maximum amount. (this is not really mass-preserving, but do I care?)
    - [ ] ~~Option B: do a 'copy seam' first and then computations only use local tile.~~
  - [ ] ~~But then the actual edge data is never updated?~~

**Peaks are smoothed:**

![2018-06-24 15_58_31](/assets/2019-01-15-logbook/2018-06-24%2015_58_31.gif)



**Carrying Over to later task**:

- [ ] Better smoothing that takes into account all 4 values
- [ ] Actually taking into account underlying terrain height 😰 (kind of a nightmare as they're quantised differently)
- [ ] event for digging so that other players also see it happening



## Week 26

Okay. It's week 26. 🤷🏻‍♂️

**Construction Interaction:**

- [x] if carrying one object: it's the cursor material
- [x] Overlay for picking up items (👈 warmup task?)
- [ ] Better indicator of what will be built (full object preview?)



**Close the loop: crashed buildings create trash**

- [x] Moving `Block` should check for heightmap intersection: increment debris (and spawn dust, w/ event?!)



At some point I'll need some kind of system that alerts objects to changes in e.g. Terrain height:

- blocks can check if they are still grounded or if the ground has been dug from under them
- items have to `WakeUp` their rigidbodies so they stay flat on the ground and not float.
- vines should also check if they are still attached to a block when things start falling over.



**Cursor / Construction UX**

Okay, it's happening. I'm currently thinking:

- Top item is building material
  - ⚠️ Is the block type (pillar/floor/stairs) still completely contextual?!
- Hold Shift to enter 'build mode' with free cursor
- Maybe use mouse wheel to adjust settings?
- Preview construction in more detail? 
  - ⚠️ Can the cursor still be *one box*?
    - When building stairs: should it build _multiple blocks_ (support, stair, etc).
      - Why is building stairs currently annoying? 
        1. Margins are really tight so if blocks are not aligned they will overlap and you can't build.
        2. Stairs take up a lot of space so it's hard to have enough (suitable, see #1) floor space
        3. There is no modular / repeatable way to build them. 
        4. You can't get on them from the ground floor
      - A top support on stairs would solve #3.
      - Building stairs to ground with an auto-pillar would solve #4
      - Fixing the margins would solve #1
    - Can one 'BigPhysics' block have multiple colliders in the 'player world' ? (e.g. a staircase is represented as one block in the 'BigPhysics' but has a bunch in the 'player world': stairs, walls, supports, etc)

**Todo List for the above**

- [x] Do the whole hold-shift-for-build-mode thing (crudely)
- [x] Add a top support to stairs when they are constructed
  - [x] Update the player interaction routine to be able to create stairs going from a floor
  - [x] Update the stairs sizing routine to detect stairs from a floor and align the top support
  - [x] Flatten the stairs so that player can enter from ground level
  - [ ] ~~Update the stairs model so that it more accurately reflects the collider shapes (including the support)~~ (👈 whatever do it later)
  - [x] Don't add the bottom support on small stairs because it breaks things
  - [ ] ~~Update the player interaction routine to be able to create stairs to/from the ground~~
    - [ ] ~~that should create an auto pillar. which is hard maybe. Because one action then spawns multiple blocks.~~ (👈 man this is hard nevermind)
  - [x] But I need to fix the block creation requests anyway because otherwise you can create two _identical, overlapping_ blocks in exactly the same frame and they will both validate while the server creates the actual entity. So I have to create a little placeholder that prevents other block validation from succeeding while the server creates the entity.

**Build mode**: 

![2018-06-25 at 15.26.24](/assets/2019-01-15-logbook/2018-06-25%20at%2015.26.24.png)





![2018-06-26 13.51.01](/assets/2019-01-15-logbook/2018-06-26%2013.51.01.png)



Ok, zoom out time. Loop closing stuff:

- Falling blocks cause Debris
  - [x] create some kind of generic block dust
  - [x] block touching ground increments debris and is deleted
    - [x] height data can't become negative
    - [x] fix bug where added debris is HUGE (the height function is wrong?!)
- Construct with what player is holding
  - [x] Top item determines construction mode (wood vs concrete)
    - [x] For now, keep the creation workflow separate: not everything is a Block+itemtype. Wood is a different entity type. 
    - [x] No construction outside of buildMode
  - [x] create BuildTemplate from player method, better than keeping track of cursor pos/rot/size
  - [x] Construction takes from player's inventory
    - [ ] Take more than one item if big block
      - [ ] indicate how many needed
  - [ ] Cap the max size of constructed object
    - [ ] Don't allow clipping pillar to super tiny height.
  - [x] Cap max distance for digging



![2018-06-29 18_26_57](/assets/2019-01-15-logbook/2018-06-29%2018_26_57.gif)



**Okay last task of the week**: gonna fix the wood building to build just ladders and platforms. Also make sure that only ladders trigger the climbing movement.

- [x] Modify wood construction size to create ladders
- [x] Allow wood with two 'pin' points
- [x] Only vertical boards trigger climbing movement
- [x] Board that touches terrain or when joint breaks is removed (Turned into worlditem)

## Week 27

The priorities:

- **Dynamic fog**: generic aesthetics and figure out if it is a possible look (👈 I know I might get carried away on this because it's fiddly)
- **Growing pots**: closing the gameloop, somewhat
- **Creeper vines**: aesthetics and game loop

**Fog Simulation**

- [x] Set appropriate height:
  - [x] change base height
  - [x] fog is raised by debris events and spills over to neighbors
    - [x] debris change raises fog:
  - [x] add fixed constant amount
    - [x] fog update step works like debris update: smooth out over neighbors
  - [x] if fog is higher than (terrain + X) subtract fixed amount

**Fog Visuals**

- **Fog Surface**:
  - [x] 1️⃣ Currently somehow broken when doing a post effect.
  - [x] Distance should be radial based
  - [x] 4️⃣ Also incorporate the silhouette blend (dark tone from the athmosphere)
  - [x] Blend nicely when full-screen fog comes into effetc
- **Fog Full Screen Effect**:
  - [x] 2️⃣ Adapt max-dist when above / below surface.
  - [ ] ~~Add a height-based component~~
  - [x] Shift color from silhouette to faraway blend
  - [x] 3️⃣ Always have a minimum fog cove
  - [x] 5️⃣ fogDist defines 'max visibility distance'. Silhouette before that automatically
- **Last problems:**
  - [x] Strong silhouetting at 50% depth does not look nice inside fog (only for far terrain)
  - [x] reintroduce tinting for fog surface
  - [x] fog shrink (depth lerp) doesn't look good. fade in would be preferable
  - [x] fog surface is rendered on top of  fogEffect because fogEffect is set to [OpaqueImageEffect]
- **Optional**:
  - [ ] Noise or dithering



This is actually the old fog but it looks nice anyway:

![2018-07-05 at 15.58.19](/assets/2019-01-15-logbook/2018-07-05%20at%2015.58.19.png)

It's sad. The new fog doesn't look as good (from above) so I don't even have a screenshot yet. But I have to move on to other things.

The transition to 'below fog' looks way better now though, that was important.



---
- [Intro](/2019/01/garbage-country-logbook)
- [Logbook 2017](/2019/01/garbage-country-logbook-2017) 
- [Logbook 2018 Part 1](/2019/01/garbage-country-logbook-2018-pt-1) 👈 You are here.
- [Logbook 2018 Part 2](/2019/01/garbage-country-logbook-2018-pt-2)
- [Logbook 2018 Part 3](/2019/01/garbage-country-logbook-2018-pt-3)
- [Logbook 2019](/2019/01/garbage-country-logbook-2019)
- [Gallery](/2019/01/garbage-country-logbook-gallery)
