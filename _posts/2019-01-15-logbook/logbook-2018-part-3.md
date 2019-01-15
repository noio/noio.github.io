---
title: Garbage Country Logbook 2018 pt.3
slug: garbage-country-logbook-2018-pt-3
typora-root-url: ../..
---

- [Intro](/2019/01/garbage-country-logbook)
- [Logbook 2017](/2019/01/garbage-country-logbook-2017) 
- [Logbook 2018 Part 1](/2019/01/garbage-country-logbook-2018-pt-1) 
- [Logbook 2018 Part 2](/2019/01/garbage-country-logbook-2018-pt-2)
- [Logbook 2018 Part 3](/2019/01/garbage-country-logbook-2018-pt-3) 👈 You are here.
- [Logbook 2019](/2019/01/garbage-country-logbook-2019)
- [Gallery](/2019/01/garbage-country-logbook-gallery)
---
## Week 40

First day of October. First day of new logbook because the old one was getting sluggish in Typora. Must be all the GIFs.


**Durability**

I have to add a durability system I guess. What are the requirements for this? 

- Creep affects durability in a deterministic and predictable fashion. Durability decreases at a maximum rate regardless of how much creep is attached. 
  - Durability objects are updated on a slow timer that applies the _capped_ accumulated damage. That way, only a maximum of damage is applied each tick (perhaps 5 minutes or so)
- Blocks that are cleared of creep are *repaired* completely. Removing creep is the only maintenance required, no additional repairing is needed.
- Falling debris damages blocks, instantly affecting durability. Damage is automatically repaired over time (like above).
  - Debris keeps a list of affected objects to prevent dealing damage to the same object twice.





### Tasks For Playtest

|                       | Time   | Prio     |                                               |
| --------------------- | ------ | -------- | --------------------------------------------- |
| Core Game Loop        | 1 week | **High** | Winning? <br />Death? <br />Points?           |
| Core Game Loop Design | 2 days | **High** |                                               |
| Interface / Controls  | 1 week | Medium   | Improve build mode UI, <br />Cursors          |
| Graphics              | 1 week | Medium   | Fog <br />Lighting, <br />Day/Night Cycle     |
| Additional Mechanics  | 1 week | Medium   | Durability <br />Rubble                       |
| Content               | 1 week | Low      | Additional Plants<br />Objects                |
| Polish                | 1 week | Low      | Particles<br />TransformUpdater interpolation |



I wrote down the tasks and split them out to figure out how much time they would cost. I hope that will keep me focused until I can launch a playtest at the **end of November**. 

![2018-10-04 at 11.56.46](/assets/2019-01-15-logbook/2018-10-04%20at%2011.56.46.png)



I finished an ECS system that updates the durability of objects and destroys them if the damage reaches a certain threshold. I also did a quick pass on a system for loading in the Config dynamically from a web url instead of always having to do a recompile. Not exactly essential but I think it will save me some time (over time).



**Throwing objects** works but looks pretty shitty because of the latency between object creation and the actual throwing:



![2018-10-05 15-05-14.2018-10-05 15_08_05](/assets/2019-01-15-logbook/2018-10-05 15-05-14.2018-10-05 15_08_05.gif)



## Week 41

![2018-10-08 10.57.41](/assets/2019-01-15-logbook/2018-10-08 10.57.41.png)



![2018-10-08 at 13.56.44](/assets/2019-01-15-logbook/2018-10-08%20at%2013.56.44.png)



Made some 3d models for the splat plant. Quite cool to see it grow:



![2018-10-08 at 17.42.01](/assets/2019-01-15-logbook/2018-10-08%20at%2017.42.01.png)



Cutting a plant should be able to yield a bunch of objects. This does mean that cutting the root will again need to iterate over every node to spawn objects. 👈 'tis done.

Trying to decouple the plants from SpatialOS to allow a little test unity scene where I can iterate on the plant design. Created a `PlantCore` class that encapsulates this functionality that will be used by the Network Sender / Receiver classes.

---

Possible methods for selecting a socket + template for a new node:

1. Keep a list of open sockets every time a node is added or removed:
   - Added: add child sockets
   - Removed: Remove child sockets & add this socket
2. Do a full scan for sockets periodically (when successfully added)
   1. add address/type tuples
   2. select one randomly from list

How to track the sockets:

1. Keep list of socket addresses, check for templates when selected
2. Keep a nested structure, for each bucket track sockets

![2018-10-11 at 11.23.55](/assets/2019-01-15-logbook/2018-10-11%20at%2011.23.55.png)



I just need to add a little method for applying durability damage to surfaces.

- Plant can keep a list of surfaces that it touched when growing, those shouldn't really change.
- PlantSender can iterate over list and apply damage.
  - ☝️ Actually this is problematic because the durability damage is defined _per node_ not globally.
    - Could store the max damage while building the buckets. Damage is capped anyway.

Okay, implemented weird bucket system.



## Week 43

Did some research on writing a shader that would be able to coat objects in a paint.

- https://connect.unity.com/p/getting-light-information-with-a-custom-node-in-shadergraph
- https://connect.unity.com/p/zelda-inspired-toon-shading-in-shadergraph





Improving the building to be more intuitive. Code wise I think I have to structure it as follows.

- Some method takes two points (`start` and `end`) and always shows a preview as if you dragged from `start` to `end` . `end` can be a real point or a point projected on some plane from the view ray. The steps to call this method are
  - Determine `start` from the hover (Either ray hit point or pillar top)
  - When button not pressed: `end == start`
  - when button pressed: `end` can be either
    - the actual hovered point (or pillar top)
    - the view ray projected on some plane
      - Horizontal plane for floors
      - A view-aligned plane for pillars
- Appropriately clamp the block size.

|             | top anchor         | slide axis         | target bottom point                          |
| ----------- | ------------------ | ------------------ | -------------------------------------------- |
| drag to air | clicked point snap | clicked point snap | project on plane perpendicular to slide axis |
| drag up     | hover point        | hover point        | clicked point                                |
| drag down   | clicked point      | clicked point      | hover point                                  |



## Week 44

Started with giving the player's poncho some random colors. This really needs more work to look nice, but at least it will for now distinguish players from each other.



![2018-10-29 at 16.26.53](/assets/2019-01-15-logbook/2018-10-29%20at%2016.26.53.png)

![2018-10-29 at 16.28.00](/assets/2019-01-15-logbook/2018-10-29%20at%2016.28.00.png)



![2018-10-29 at 16.29.04](/assets/2019-01-15-logbook/2018-10-29%20at%2016.29.04.png)



I also fixed a bug that would prevent plants from growing on soil boxes.



Made some rubble models for when buildings fall apart.



![2018-10-30 15.46.03](/assets/2019-01-15-logbook/2018-10-30%2015.46.03.png)

![2018-10-30 at 16.04.41](/assets/2019-01-15-logbook/2018-10-30%20at%2016.04.41.png)



Today I'm updating the GDK to the newer version so I can dig into the terrain again.



I have to fix up the HUD code a bit to be able to add new visualisations for interaction.

- If the HUD highlights an object, and then switches state to another object, the first highlight won't be removed.



## Week 45

Over the weekend I started on rewriting the SpatialOS Entity Template system to something more streamlined. Should make creating new object types (like the rubble from previous week) more focused in a single place. Mostly done with the core system, but I don't think I can migrate the data neatly from the old system. 

- Some loose ends remain on the technical front
  - [x] Fix the "ItemScene" script to lay out all Mesh Definitions
  - [x] Make Plants use Mesh Definitions instead of internal fields for mesh/collider size
  - [x] Make a button to create a EntityDefinition from a Mesh Definiton. That will focus activity more on the visual editor
- Then I have to create the actual entities
  - [x] Create Mesh definitions for:
    - [x] Bamboo Seed.asset
    - [x] Cement Bag.asset
    - [x] Plastic Barrel Soil Container.asset
    - [x] Plastic Barrel.asset
    - [x] Plastic Crate Soil Container.asset
    - [x] Plastic Crate.asset
    - [x] Splat Fruit.asset
    - [x] Tire Soil Container.asset
    - [x] Tire.asset
    - [x] Vine Seed.asset
    - [x] Wood Planks.asset
    - [x] Wood Soil Container.asset

Made some progress on generating entity definitions for all objects. The engine can't USE them yet though. 

**Tue:** Hooked up everything into SpatialOS and it's running again now. Didn't add a single feature but this will take away a lot of friction in the future. 

**Wed:** Okay, small issue. The blocks can't really alter their behaviour when moving, because their rigidbodies are *kinematic*, because the real movement is done by a proxy. I can fix it but I have to write some code. 

The system will look like this:

![2018-11-07 12.37.09](/assets/2019-01-15-logbook/2018-11-07%2012.37.09.png)

But now I have some problems interfacing the `DurabilityDamageSystem` with the `DurabilitySender` because the latter is a MonoBehaviour. 

- https://forum.unity.com/threads/whats-the-best-approach-for-hybrid-ecs.551386/#post-3648499

**Thu:** Working on the rubble.

https://gfycat.com/OldfashionedApprehensiveDarwinsfox



## Week 46

Yesterday I fixed up the UI for sending *User Reports*. It's pretty neat to just send a screenshot and a short text from inside the game. However, today I need to decide what kind of stuff I'm doing before the end of the month.

Mostly, some kind of 'score' for how high the player could build. I have some options:

- **Numbers above the player's head indicating height**. Simple high score.
- **Some score related to an item built at a height.** 
  - Flag?
  - Simply the highest block placed.
  - How is this reflected on the player? A high score table? A score floating above?

Taking into account that players will be able to own buildings, it makes sense to require _building_ something to claim the highest spot. Have to take out the high plateaus on the current map as those make it too easy to claim a higher place.

**Wednesday**: Need to get a bug fixed related to syncing animations over the network. 

After that I spent some time thinking about how to dynamically generate meshes for the objects that have variable sizes (like boards, ladders and concrete blocks). It seems really tricky if the size is really variable and not discretized into minimum chunks. And even with discretization, if the increment size is small enough, that would generate a whole bunch of 'sub objects' that might be unnecessary. 



![2018-11-14 17.52.16](/assets/2019-01-15-logbook/2018-11-14%2017.52.16.png)



- `MeshPart` defines whether the part is stretchable or a cap.
  - Stretchable parts should define how the Vertex position maps to UVs
- `MeshBuilder` takes parts and assembles them
  - `MeshBuilder1D`
    - Top, bottom, middle (stretchable)
  - `MeshBuilder2D` 
    - Corner, edge (stretchable), center (stretchable2d)

**Friday** Experimenting with building bigger 'prefab' blocks to let the player climb up easier.

![2018-11-15 at 17.42.05](/assets/2019-01-15-logbook/2018-11-15%20at%2017.42.05.png)

But code architecture is getting in my way. Because a lot of the building behaviour is inextricably tied into dynamically-sized blocks.

I probably need to split things in smaller components that manage their own behaviour. More ECS-like. So:

- `DurabilityModule` adds `DurabilityReceiver` / `DurabilitySender`
- `DynamicSize` Spatial Component is not added to all blocks.
- `Pinnable` component manages pinned items.
- Something else (A PhysicsModule on the EntityDefinition ) handles whether a blocks proxied or not, and whether it is anchored.

I don't get it. Something like this:

![2018-11-16 at 15.55.55](/assets/2019-01-15-logbook/2018-11-16%20at%2015.55.55.png)

Super stable in a sandbox scene but in the real simulation it falls apart. Why?!

I'm trying to find out why it's not stable now. If the simulation settings are different or if the Proxy Body somehow messes with things.

I can also replace the colliders by *one* box collider for the proxy, but since it works in a sandbox scene I want to find out what causes the difference in stability first!



## Week 47

On the first two days of this week I wrote a blog post about stacking physics boxes. Found out that without ridiculous amounts of solver iterations, 12 boxes is pretty much as high as you can go. Beyond that I would need some game mechanics to mitigate the instability.

One more thing I'm going to research today is whether it helps to create wider stacks. That is something players could learn, that they have to build piramid-shaped buildings or at least support the building through side structures. 

- [x] Create a toggle in the testbed for stack width
- [x] See if stacks can be higher than 12 when this is selected: NOPE

So, interestingly it looks like I'll need additional mechanics to make boxes stable, okay. That's that then. In 2018.3 I'll be able to split that stuff out into a separate physics world and maybe increase the iterations on that.

There is one single thing that helps stability, and that is adding **Fixed joints**. However, adding them to every single block in the tower makes the whole thing behave like a spring. There must be a balance between # of fixed joints, their break force, and their "massScale" that will make the tower more stable but still feel 'realistic'.

> - Blocks live in Blocks World.
> - Everything else is placed on blocks and lives in real world.
> - Blocks (only) are affected by plants through durability.
> - Ladders are pinned to blocks in real world.

So what can I do today? 

- [x] Make a nicer basic block. 
- [x] Be able to put plants on the basic block.

That would be a victory.

I did some measuring in the scene and discovered that a texture density of **16px per unit** looks about right for this game. Some of the plants have a higher density, up to almost twice as much, and the ground texture has about half that resolution. But 16px looks nice and blocky.

![2018-11-21 at 18.21.41](/assets/2019-01-15-logbook/2018-11-21%20at%2018.21.41.png)



To put plants on the basic prefab blocks, they have to have a Block{Receiver,Sender} component. But the Block components rely on the dynamic size. I'll have to separate that logic.

Okay, here we go then.

- [x] Blocks no longer have size or stairs angle
- [ ] Pinning goes to separate component
- [x] SimpleRecipe does boxcast to find lowest placement.
- [x] SimpleRecipe checks if Block on Definition
- [x] Add "BoundingBoxCollider" to MeshDefinition
- [x] Use Block components on the room blocks
- [x] Get rid of boards (until rebuild from pinnable + resizable (meshbuilder) + climbable layer)
- [ ] LATER: Resizable gets separate component
- [ ] LATER: Possibly merge durability into > block
- [ ] BIG ASS TASK: Build board from pinnable + resizable + meshbuilder + climbable



![2018-11-22 at 15.33.30](/assets/2019-01-15-logbook/2018-11-22%20at%2015.33.30.png)

**Friday. GOALS:** Create a recipe for placing & pinning the big blocks. Should be fun.

- [x] Create BigBlockRecipe
  - [x] Does construction raycasts in the PROXY world. Except it can't because proxy world does not exist. Shit. 
    - [x] So add the proxy to the client blocks on a separate layer.
  - [x] Use that layer in MeshDefinition behaviour too
  - [x] Start by just dropping on top 
    - [ ] and pinning from a fixed side.
  - [ ] Modifier rotates along pin angle
    - [x] Create pin property on block and create fixedjoint when it has a pin.



​	

Todos for later:

- Make prefab blocks 3 units high
- Build a ComponentSystem for proxies. Initialisation order between Block/ProxyBody is kind of shitty and unpredictable now
  - [x] Step One: Pull ProxyBody behaviour into BlockSender. (Except create only a single collider)
  - [ ] Nuke BlockReceiver.
  - [x] Cleanup the Proxies created by `BlockSender` 
  - [ ] If blocks lose authority, they should remove the pin.
  - [ ] 
- Repair *Block Movement Damage*
- Repair *Initial Creep Growth*



## Week 48

Okay, let's recap what I did last week and what the next goal is.

- I made some ECS Systems to manage proxies and transform synchronization. This was necessary because the old MonoBehaviours were getting in each others way. 
- This new system allows **pinning** blocks to each other. The new 'BigBlockRecipe' does this automatically.

To wrap this up I need to:

- [x] Remove the old TransformUpdateSenders from all prefabs
- [x] Implement some simple snapping + axis rotation on the new recipe.
  - [x] The new recipe should somehow decide how the block is rotated (from which side it is pinned)
- [x] BlockSender should remove pin when authority is lost
- [x] resize to height = 3 (48px)
- [x] Test with the staircase model

  > - [ ] Create a ladder with a Resizable component and a MeshBuilder
  > - [ ] `AppearanceProvider` component. 
  >   - [ ] ProvidesSize / NeedsSize
  > - [x] Move functionality from `MeshDefinition` to `UsageDebugger`
  > - [ ] `SimpleMeshProvider`
  > - [ ] `MeshBuilderProvider`
  > - [ ] `ColliderProvider`
  > - [ ] MeshBuilder1D has links to MeshDefinitions (bottom / mid / end)
  > - [ ] MeshBuilder1D does some live preview based on current collider size
  > - [ ] Other:
  >   - [ ] 'prelink' as much data as possible (i.e. no GetComponent at runtime)
  >   - [ ] IDataRefresh for fixing data automatically
  >   - [ ] IValidateData for showing errors in dev scene

☝️ Okay nevermind that. Resizable objects are actually wayyy complicated. I can just create a couple of fixed size ladder objects first. 



**New Plan for Ladders**

- [x] Create ladder model in blender
- [x] Create MeshDef for the ladder
- [x] Create a recipe for pinned objects
- [x] Actually pin objects
  - [x] Pinned property is inside TransformUpdater
  - [x] While pinned
    - [x] Position is relative to pinned body
    - [x] Receiver just positions object relative to support
- [x] Make ladders climbable

![2018-11-28 at 17.17.04](/assets/2019-01-15-logbook/2018-11-28%20at%2017.17.04.png)



**Ladder Game Loop**


- [x] Bamboo yields Bamboo material
  - [x] How to spawn created item in the right place?
- [x] Ladders need Bamboo to build
- [x] Make (quickly) nicer shader for cutting
- [x] Reset buckets when plant is cut



**CLEANUP**

- [x] remove old `BlockRecipe`
- [x] Clean out the BlockReceiver



**FUNCTIONALITY TO REPAIR**

- [x] Creep growing on blocks. 
- [ ] Blocks taking damage (from creep and movement)
- [ ] Blocks spawning rubble and rubble with particles
- [x] MeshDefintion picks random mesh
  - [x] Use variation from Entity



![2018-11-27 at 17.51.55](/assets/2019-01-15-logbook/2018-11-27%20at%2017.51.55.png)





## Week 49

Hello week 49. So last week was good, fixed up a bunch of stuff. Now I have to decide what's important to get back on track for a playtest. 

I could:

- [ ] implement **death** from falling (or inhaling fog)
- [x] rewrite the **fog shader** in the v2 postprocessing stack. 
- [ ] create tooltips about **recipe ingredients** and setup **blueprint items for blocks**
- [ ] do the **bouncy inventory** just because it's fun
- [ ] fix **player movement** to hop on low ledges
- [ ] block **durability** and **rubble** with particles

Going to work on the **fog** because I need something fun to do today.

Deciding how to set up the Fog colors, as a texture or as a bunch of lerped colors.

|             | Near Fog | Far Fog | Skybox |
| ----------- | -------- | ------- | ------ |
| Time of Day | ✅        | ✅       | ✅      |
| Altitude    | ✅        | ✅       | ❓      |

- [x] I fixed the mesh variation. 

I should write more, about what is wrong and what needs doing. And in a more structured way maybe. So right now I feel like I want to ship a little playtest build but I don't know what the goal in that game would be. What do I tell players they're supposed to do? Mess around and build stuff? Currently, you just spawn in the world, and you see a deserted world. If you see the tooltips you might dig around in the trash and then build some stuff.



I don't feel like doing anything but I'm just gonna do some programming stuff to maybe feel productive again.

- [x] Split `PlayerClient` into:
  - [x]  🌟 `PlayerController` (no Spatial) . Controls movement and Camera
  - [x] 🌟 `PlayerLocal` (all the spatial stuff)
- [x] Merge parts of  into `PlayerVisualiser ` into  `PlayerAnimationHelper`
- [x] Rename `PlayerVisualiser` to 🌟`PlayerRemote`
  - [x] PlayerRemote is IPlayer
- [x] Create new _Player Server_ prefab without any of the mesh stuff. (Just a capsule). And the `PlayerWorker` component.
- [x] Rename `PlayerWorker` to `PlayerServer` 
- [x] Create interface for Interactable that uses either PlayerServer or PlayerClient
- [x] *Player Client Local* objects need:
  - `PlayerClient` (IPlayer)
  - `PlayerController`
  - `PlayerVisualiser`
- [x] *Player Client Remote* objects need:
  - `PlayerRemote` (IPlayer)
  - `PlayerVisualiser`



![2018-12-05 at 18.42.09](/assets/2019-01-15-logbook/2018-12-05%20at%2018.42.09.png)

> Totally unrelated screenshot



## Week 50

Had a kind of breakdown last week when I realised how much stuff I think the game needs versus what is actually there. In other words: it's too ambitious. Now I have to decide how to deal with that realisation. One idea that occurred to me is to drastically simplify the concept. Get rid of all 'gamey' things like resource gathering and scores and focus on the idea of a 100% persistent player-built world in its most simplest form.

Sent this mail to Vitor but maybe it's relevant.

> I've been thinking a lot and agonising a little about what to do next. I figured my options are **A)** quit entirely, **B)** half-quit or **C)** don't quit; just continue with more people. And I think **B)** is what I'll do. That is to say, drastically reduce the scope to something that I'll be able to release by myself in the near-ish future. I was tempted to let it go completely and start on a smaller game without the friction of a multiplayer game. But I think there is something there, and I am still really psyched about games with real persistence. (And honestly, with all of the stuff that was broken in the little playtest, SpatialOS was not one of them! It ran like a charm) 
>
> So, plan **B** would consist of me building a small, free, experimental, multiplayer experience where people can build permanent stuff in a world and jump/climb around in that world. I won't pretend it's a *game*. But there can be two outcomes at that point. Either I'm happy that I finished something and I move on. Alternatively: it'll be a good demo / pitch for finding people to build the whole of '*garbage country'* with. 


## Week 51

Today, worked a bit on the player movement across obstacles inclucing holding ledges and sliding down surfaces.



![2018-12-17-player-movement](/assets/2019-01-15-logbook/2018-12-17-player-movement.gif)



The next thing I want to enable is for the player to seamlessly hop onto small ledges.



![2018-12-17 17.56.27](/assets/2019-01-15-logbook/2018-12-17%2017.56.27.png)



The first approach I tried was with a *locked animation*. But the problem is that this will hop the player up a slope automatically. Maybe I do need to find a way to make steps a part of natural ground movement.



![2018-12-17 19-51-42.2018-12-17 19_56_00](/assets/2019-01-15-logbook/2018-12-17%2019-51-42.2018-12-17%2019_56_00.gif)



**Brainstorming for a new plan**

- All players start in a big central area. Perhaps they spawn from some kind of devices/niches in the wall.
- Prefab blocks are spawned around the existing structure, can be carried as a single item. Holding a block prevents climbing ladders and hanging on ledges, but they can be *thrown*. They spin around like classic shooter pickups with some sparkly effect on them.
- Seeds are also found around the map in the same way. Vines crawl around blocks and lock them in place.
- Block placement needs some (a lot?) of work. When standing inside a block, it should be very intuitive to place another block on the side of that. When standing on top of a block: idem. Perhaps the camera should be completely unlocked from the player in placement mode. 
  - The preview graphics of placing a block should actually represent the block. Look into a shader swap first because that's the only way to avoid manually creating a representation.
  - Worst case I have to manually generate pins on the surfaces of blocks but I'd really rather not.


---
- [Intro](/2019/01/garbage-country-logbook)
- [Logbook 2017](/2019/01/garbage-country-logbook-2017) 
- [Logbook 2018 Part 1](/2019/01/garbage-country-logbook-2018-pt-1) 
- [Logbook 2018 Part 2](/2019/01/garbage-country-logbook-2018-pt-2)
- [Logbook 2018 Part 3](/2019/01/garbage-country-logbook-2018-pt-3) 👈 You are here.
- [Logbook 2019](/2019/01/garbage-country-logbook-2019)
- [Gallery](/2019/01/garbage-country-logbook-gallery)