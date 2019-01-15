---
title: Garbage Country Logbook 2018 pt.2
slug: garbage-country-logbook-2018-pt-2
typora-root-url: ../..
---


- [Intro](/2019/01/garbage-country-logbook)
- [Logbook 2017](/2019/01/garbage-country-logbook-2017) 
- [Logbook 2018 Part 1](/2019/01/garbage-country-logbook-2018-pt-1) 
- [Logbook 2018 Part 2](/2019/01/garbage-country-logbook-2018-pt-2) 👈 You are here.
- [Logbook 2018 Part 3](/2019/01/garbage-country-logbook-2018-pt-3)
- [Logbook 2019](/2019/01/garbage-country-logbook-2019)
- [Gallery](/2019/01/garbage-country-logbook-gallery)
---

## Week 28

OKAY it is time for plants.

There were already vines but they were kind of 'hard-coded' so I'd never be able to have different species running different behavior and such.

So first I started off creating some kind of JSON database of plant properties and stuff, but now I'm leaning towards just including all that data inside of Unity in a bunch of prefabs. That will give me visual editing out of the box and not having to deal with a bunch of JSON reading and asset finding. 

- Then I have to hook up model and texture variations, which should be quite doable. Prerequisite that I can preview them nicely in blender. 

**STATIC Node Data** (scriptableobject)

- Possible child nodes and probabilities
- Socket positions and rotation

**PER INSTANCE Node Data** (schema)

- Node ID
- x_rot / y_rot.  (base position/rotation is stored in STATIC data)
- node data children

**STATIC Plant Data** (scriptableobject)

- Initial node type

**PER INSTANCE Plant Data** (schema)

- Initial node

**TODO**

- [x] Spawn an actual plant entity and use the NodeData to populate it.	
  - [x] Use the nodedata to populate it:
    - [x] Run through the list of children and ask the PlantFactory for instances
- [x] Run an update loop that grows the plant and checks for conditions
  - [x] remove nodes from tree when conditions not met
    - [x] deal with deletion in Receiver
  - [x] check for growing at leaf nodes
  - [ ] Add and run through conditions for placement
    - [x] Space free?
    - [x] Needs to stick?
    - [ ] Has energy?
  - [ ] Accumulate plant energy subject to conditions
- [x] Replace the current vines by plant 1001 growing
  - [x] implement needsurface
- [ ] (lowprio) Figure out a way to include model and texture variations subject to performance & workflow constraints 



![2018-07-13 at 15.06.34](/assets/2019-01-15-logbook/2018-07-13%20at%2015.06.34.png)

![2018-07-13 at 17.57.27](/assets/2019-01-15-logbook/2018-07-13%20at%2017.57.27.png)

YOSH.

![2018-07-15 at 15.34.15](/assets/2019-01-15-logbook/2018-07-15%20at%2015.34.15.png)





## Week 29

**Ingredients for some kind of challenge (because it's a game or whatever)**

- The creep reduces **durability** of blocks.
- Falling damage! (death / crawl / limp)
- Create one plant that needs altitude to grow



**Todo list for the above:**

- [ ] Blocks need a durability score that will cause them to turn to rubble.
- [ ] Player needs a health property
  - [ ] Reduce health on falling.
    - [ ] compute some kind of falling height
  - [ ] movement depends on health
  - [ ] death causes respawn
- [ ] Plants should be able to yield something: a world item that can be grabbed.
  - [ ] Should the node that produces the item get removed or not?
    - Node removed
    - Grows again
    - Does not grow again
  - [ ] For example a seed.
- [x] Seeds lying around on somewhere could grow
  - [x] Create worldItem with Seed itemType
    - [x] nodeID is stored in the ItemProps metadata
  - [x] SlowUpdate on world item checks if node can grow
    - [x] add 'need soil' property
  - [ ] Create vine root node (+ 3d model)
  - [x] create vine node with variations
  - [ ] Come up with something for energy and node child probability (something simple that has a deterministic distribution of nodes)
    - maybe keep a global queue of node types, now much energy they require and where they could be placed. then put energy into the first item of the queue until it can be built. But that would mean each node type is built equally often..so nevermind.
- [x] SoilContainers
  - [x] Create Schema for soilcontainer 
  - [x] Create prefab for worldcontainer (With simple 3d model)
  - [x] somehow splice into BuildRequest (👈 oh man did I do this in a hacky way)
    - [x] SoilContainer as an ItemId? 
- [x] Put out a job ad for 3d low poly modeling and animation?





> side note: So after splicing in the creation to create a SoilContainer I am discovering that the whole pipeline for constructing an item is kind of fucked. There are so many custom steps doing essentially the same thing for each item:
>
> - Starting with the player, determine which item should be built
> - Figure out on the player's end whether it would fit
> - Create & send a request to construct the item
> - On receiving the request, do the same check about whether the item would fit (and possibly other constraints)
> - Instantiate a placeholder to prevent concurrent requests from succeeding.
> - Request entity creation from SpatialOS
>   Progress: I can now create a soil box
>
> Half of it is symmetrical with items in the player inventory, and half is not. For example: right now it's a pain to point a `Seed` prefab to the `NodeType` of the plant that it should create, because the seed prefab is just a generic `WorldItem` without specific components. I have to flatten all this stuff down to different prefabs and not try and be smart in code.



**Solutions for the above** (thanks Stephan)

- [x] Create a scriptableobject for WorldItems in resources folder
  - [x] WorldItem database links WorldItem to ItemProps
  - [ ] links to player-held prefab
    - [ ] if unspecified, could create automatically at runtime from the EntityPrefab
  - [x] Create PropertyDrawer for ItemType/Material combo
  - [x] let Spatial create the EntityPrefab specifically per item
    - [ ] Link to that too
    - [ ] The specific prefabs will carry the behavior (e.g. PlantSeed which `Requires` a WorldItem writer)
- [ ] Create ScriptableObjects for Construction Validation
  - [ ] Subclass with different validator functions (but also generic bits)
  - [ ] Include the cost of construction with 'multiply by volume' checkbox



All different flows:

- [ ] Spatial Entity created: spatial grabs the prefab from `EntityPrefabs`. 
  - [ ] Created Entity has WorldItem{R/S} components and possibly others: (e.g. PlantSeedSender)
  - [ ] MeshOptions are stored in `ItemInfo` so the WorldItemReceiver should fetch and apply
    - [ ] `ItemFactory.Instance.GetInfo(itemProps).ApplyTo(gameObject)`
- [ ] A spatial entity is created from an `ItemProps`
  - [ ] `CreateWorldItemEntityTemplate(itemProps)` uses `ItemFactory.GetInfo(itemProps)` to get the EntityPrefab name (aka the metadata string)
- [ ] An item is picked up from the ground: Spatial updates the inventory with an `ItemProps` . Player grabs the prefab from the `ItemFactory` based on ItemProps (is fetched from DB) and applies mesh variation
  - [ ] `ItemFactory.GetHeldItem(itemProps)` perhaps with some pooling and shit.

Oh man I'm getting hardcore stuck on this stuff.. The schema of:

- `ItemType`
- `Material`
- `Metadata`

is hard to use when it's not clear which of those fields determine the object uniquely. In the case of a seed, the plant type is stored in the Metadata which is a mess. Perhaps the rule should be that that is not allowed? Metadata never influences the object type but only varies the appearance? But then where do I store the plant type?





**Job ad**

🔎 Looking for freelancer to do some low-poly low-res 3D modeling (in #blender3d) and texturing. If interested send reference work to thomas@noio.nl

💰 Paid; up to a week of remote work

🌱 Simple models: modular plants & various salvaged trash items

Please RT



- Modeling some modular branches, plants, flowers 
- Different salvaged trash items and objects built out of them (tires, barrels, pallets)
- Character animation help also welcome but not required
- In Blender so I can modify and integrate into my workflow



## Week 30

Haha, week 30 and so many unchecked boxes from last week. Just gonna copy the important stuff here:

- [x] Switch to a single ItemID that includes both type and material. So no more `Resource/Wood` or `Block/Concrete` but just straight up `WoodPlanks` and `ConcreteBlock` as a single enum. That should simplify the item lookup. 
  - [x] remove the material from the schema
- [x] Second: don't use the metadata for actual item variations. So no`Seed/meta=Vine` but just `SeedVine` as an ID with corresponding template. The ItemTemplate then has to store the `nodeType` for the node it is supposed to create.
- [x] `ItemFactory` needs a method `CreatePlayerHeldItem` that also uses an `ItemTemplate` to create an item. The question here is whether `ApplyTo` should also be used because that assumes the object has colliders, which a PlayerHeldItem won't have.

Ok that's done. Still pretty rough but it's a start. (Needs some way to split out this ApplyTo stuff depending on which kind of object (client/worker/playerHeld) it is applying to)



![2018-07-23 12.20.24](/assets/2019-01-15-logbook/2018-07-23%2012.20.24.png)



But for now I'll just stick with `GetComponent<X> != null` .

 **Construction Recipes**

First, I think I have to formalize the "construction recipes". Implicitly selecting whether the player wants to build a stairs or a pillar or a floor or a soil box from context is no longer gonna cut it. 

I need a well defined data structure that is used both on the **client** and the **worker** which contains all the data for 

- selecting, ✅
- previewing placement ✅
- validating placement, ✅
- validating required inventory ✅
- creating the actual constructed object ✅ 👈 (continue here..)

What data does a recipe need for validation?

- ⚠️ Position
- ⚠️ Rotation
- Size (IResizableRecipe?)
- Attachments (IAttachableRecipe?)



```
In Buildmode: 
	(No selected recipe) -> MouseWheel selects recipe. Click Activates
	(With selected) -> MouseWheel / Click / Drag are fed to recipe.
```

Maybe there is some kind of RecipeConfigurator that transforms cursor positions into the required recipe data (pos/rot/size). (Actually, I just added `abstract void Configure` to the Recipe base class, no separate object)

✅ Damn! I got all the recipe stuff to work.  Player code is SO MUCH cleaner now and more symmetrical between client and worker. *Nice.* Only for `SimpleItems` though. So next step is recreating the ability to create pillars, floors, stairs, etc. 

- [x] Lets start with a pillar. 
  - [x] it doesn't snap yet
- [x] Floors
- [x] Stairs 
  - [x] Stairs don't work yet 👈 Configuring works but they won't validate for some reason.
- [x] Floor extensions
- [x] Boards
- [x] Create some nice graphics for the preview

When all this is done I'll be able to add nice graphics to the Recipe Preview and also icons to select recipes etc etc.

So the last bit of this week was plagued by some SpatialOS bugs that I had to work around.

**Small Jobs**

- [x] fix positioning of player held items
- [x] don't show RecipePreview if configuration failed
- [x] for stairs: fail configuration if not dragging
- [ ] position player on screen by feet or something, just to have better composition at different zoom levels



## Week 31

Let's start with some small tasks re: **recipes**:

- [x] Shift built objects up a little bit to avoid validation fail.
- [x] Don't show the recipe if the configuration failed
- [x] Fail the configuration on stairs if you're not dragging

Since I saw that the build mode interface is hard to parse for a new player, I have a couple of ideas for improvent:

- [x] Use TAB instead of SHIFT (because tab indicates a 'statues switch' more often than shift)
- [x] Only allow exit with the same key, not right click.
- [ ] put huge icons in the center for selecting a recipe
- [x] only unlock the mouse after a recipe is selected

Then what am I doing in the rest of this week? 

- **Durability** of blocks and other things
- **Things turning into rubble** and bouncing down
- Improving the **player movement**
  - [ ] Jumping when hanging on ledge should be smooth when climbing ONTO the ledge 
  - [ ] Allow jumping away from a ledge
  - [ ] Don't allow sliding up walls
  - [x] DID NONE OF THE ABOVE, but I did refactor the player movement code to make so much more sense.

Today I wanted to hook up some new models by Carolina. 

![2018-08-01 at 14.58.14](/assets/2019-01-15-logbook/2018-08-01%20at%2014.58.14.png)



But for building Items it's not as easy as just creating a prefab, because the current system is kind of shit. There is only a single prefab for "Soil Container", which would not be able to distinguish between the wooden one and the one built out of barrels. So I think the solution here is that I need to split "WorldItem" into an "Item" component and a "Grabbable" component. So that even non-grabbable items can still have an `itemType` . I guess almost every single entity would then have this itemType 🤷🏻‍♂️. It's kind of what Spatial used the `metadata` field for but unfortunately that is tightly linked to the EntityPrefab in the spatial default entity creation pipeline.

Looking cute.

![2018-08-01 at 16.48.03](/assets/2019-01-15-logbook/2018-08-01%20at%2016.48.03.png)



## Week 32

You want some beginning of the week notes? Ok: "Hello". 

For real though. It's week 32.. That means I have...

- 32 — August 12
- 33 — August 19 👈 Work on 3D models again
- 34 — August 26 ❌  Gamescom
- 35 — September 2 ❌ Birthday
- 36 — September 9 👈 Test Deployment
- 37 — September 16
- 38 — September 23
- 39 — September 30 👈 Playtest

Almost eight weeks left before the 'playtest'

- [x] So for sure I need to split the definition of WorldItem into a Grabbable and a WorldItem.
- [x] Then I need to add a `WorldItemReceiver` to every prefab that is created from a `Template`
- [x] Add some code to the Template that ensures the prefab has a WorldItemReceiver
- [x] The `WorldItemReceiver` has to look up the Template and apply the template settings to the prefab after creation.
- [x] Then I can create a Template for Soil Containers
- [x] Move functionality for creating (held) items into the Template itself
- [x] Rename playerhelditem to "grabbeditem"
- [x] remove the ItemFactory

So okay the soil container things are falling through the ground because they are proxy objects and the Terrain does not exist in the BigPhysics simulation. What can be done about this?

- **A)** Don't allow player to create them on the ground + destroy when they go under
  - [x] Do the above.
- **B)** When placed on ground, freeze physics but decay the durability
- In general, objects could be frozen instead of proxied. Would need a system for detecting 'catastrophic' events to wake them up again.

**Plants**

- [x] Inherit PlantTemplate from Template with all the properties.
- [x] Store PlantTemplates in Database.
- [x] Deprecate PlantFactory
- [x] Put plants on the items scene



![2018-08-09 at 16.09.55](/assets/2019-01-15-logbook/2018-08-09%20at%2016.09.55.png)



Good stuff.





## Week 33

1. What are the issues that really need to be fixed for playability? 
2. Can I group those issues into themes so that I can handle them in batches? 
3. Will there be any time left for adding content, and what should that be?



- The interface for **Build mode** is problematic. 
  - The recipe picker is not clear
  - Build previews are not cleared when configuration fails
  - There is no cursor for failed configuration
  - Keys are not indicated on screen
  - Available recipes should be re-computed after building
  - Last used recipe should be first selected
  - enable modifier key for recipes?
  - soil container recipe preview size is wrong (uses `collider.size` instead of template `colliderSize`)
- **Player movement**
  - Diagonal movement is faster
  - Should be able to vault over edges
  - Need super basic animations for these things
    - Vault / climb onto edge
    - shimmy
    - climb ladder
    - falling
    - crawling
- **Multiplayer things?!!**
  - Spawn points?
  - How to differentiate players?



Hookay, let's start with some of those animations then. 😱

- [x] Vault (pull up)
- [x] Shimmy
- [x] Climb
- [x] Fall
- [x] Crawl

Maybe I need to simplify the animation system a bit to just pass a single `int animationState` to the animator, which could also be synced over the network. 

Oh god I need to rewrite the player movement again. 👉 Okay, turned it into actual FSM. That made things much easier to read.

Now that I got that crap out of the way, maybe I can hook up some mechanics for the player taking damage and crawling after doing so.

- [ ] Pull out the code that configures the animator so it can be re-used on Remote Players.
- [x] Do simple logic on the PlayerWorker to detect falling
- [x] Add health (and/or timer) to the playerStatus
- [x] Make player crawl when health low (Where does this code go? PlayerMovement? 🤔 )



- [x] Should I repair ladders again? 
  - [x] Climb animation
  - [x] Detect ladder 



The interface for **Build mode** is problematic. 

- [x] The recipe picker is not clear
- [x] Build previews are not cleared when configuration fails
- [ ] There is no cursor for failed configuration
- [ ] Keys are not indicated on screen
- [x] Available recipes should be re-computed after building
- [x] Last used recipe should be first selected
- [ ] enable modifier key for recipes?
- [x] soil container recipe preview size is wrong (uses `collider.size` instead of template `colliderSize`)



Two types of recipe feedback:

1. Non-draggable recipe (just click & place)
   - Conf **SUCCESS**: Show preview box
   - Conf **FAIL**: Show fail reticule. `HUD.ConfigurationFail`
2. Draggable Recipe
   - Hovering
     - **DRAGGABLE** POINT: Show Initial pre-drag preview box
     - **NOT VALID** STARTING POINT: Show fail reticule
   - Dragging
     - Conf **SUCCESS**: Show preview box
     - Conf **FAIL**: Show drag fail reticule. (Original point + line + regular fail reticule)



**Conclusion:** Draggable recipes should:

- Always show a preview for any valid starting point (even before dragging)
- Always create a configuration



I guess there are different configuration states:

- Draggable/HoverValid == NormalCrosshair
- Draggable/HoverInvalid == FAIL ❌
- Draggable/DragFromInvalid == FAIL ❌
- DragFromValid == SemiFail ⭕️ (show drag line)
- BaseConfigured == SemiFail ⭕️ (Show configuration stub)
- FullyConfigured == Success  ✅ (Show full configuration)



Okay, reworking this UI stuff. 

- [x] scale of the box preview is broken
- [x] the crosshair doesn't move with the screen nicely
- [x] need to null the `activatedRecipe`
- [x] instant build click still happens for pillars. what happened to `holdingforrecipe`?





## Week 34

This is gamescom week so not a lot will get done. Though if I have to show this game impromptu at gamescom, what should I fix? Hmm maybe that's kind of hopeless. I could just work on the UI a little bit.

- [x] Reticle outlines pickup object (👈 this actually doesn't feel so good because it makes the reticle wobbly, so I just made it slightly bigger when highlighting an object)
  - [x] Pickup object highlights
- [ ] Reticle shows dig mode



## Week 35

Gamescom. Did nothing.

## Week 36 

So, change of plan. Moving playtest to October b/c Improbable asked for feedback on the GDK. So I have to get familiar with Unity ECS and the GDK. 

**Things I learned about ECS:**

- The example projects are all really strictly namespaced and use Assembly Defs. Probably I should do the same.

**Questions**

- When migrating from the SDK to the GDK, where do I get the new code for spawning entities, etc? I have a hard time discerning which parts of the GDK example are part of the GDK Core and which parts are *"user code"*.

  - **Answer:** there is no code.

- I do not understand how the `TransformSyncSystem` works. I understand that it iterates over entities on the "Spatial side", but how are those linked to the Unity GameObjects? The GameObjects in the example project do not have the "GameObjectEntity" attached, so how can an ECS System iterate over them? I see that a group is created 

  ```csharp
  private struct TransformData
  {
      public readonly int Length;
      public ComponentDataArray<Transform.Component> Transform;
      public ComponentDataArray<Position.Component> Position;
    
      // ??? how?
      [ReadOnly] public ComponentArray<Rigidbody> GameObjectRigidBody; 
  }
  
  ```

  - **Answer:** There is `EntityManager.AddComponent` and `ComponentType.Create<Rigidbody>` (calls hidden deep inside the GDK)

- Where are the other components added to a ECS Entity? I guess that's happening from the list of Schema components?

Okay, time for a little exercise. Let's create a hybrid ECS thing. 

- [x] A bunch of actors that run around a field
- [x] They each have an animator, but their position/speed is updated using ECS



**Exercise number two.** Add an additional entity type to the GDK example

- [x] Create a prefab with a ball.
- [x] Add an `ArchetypeName` for `BouncyBall`, map it to the BouncyBall prefab (in `ArchetypeConfig`)
- [x] I just added an entry to the `ArchetypeInitializationSystem` switch-statement but I have no idea why.
- [x] That actually already worked. Neat.



My current Entity Creation Workflow:

- *SpatialOS* automatically instantiates a Prefab for each entity using the `Metadata` Component's `entity_type` string.

- I also created an `ObjectType` component with a single `int` field  that fully specifies the object. I suppose it's somewhat similar to the `Archetype` in the GDK. However:

  - The `ObjectType` is used to look up a `ScriptableObject` *Template* with further properties that are then applied to the Instantiated GameObject: different meshes/materials etc. But the *Template* also stores the Prefab just in case.

  ```csharp
  class Template : ScriptableObject {
      GameObject prefab;
      Material material;
      Mesh mesh;
      // Other initialization stuff.
  }
  ```

> For example: There are different things lying around in the world that are just *"WorldItem"* prefabs. The `ObjectType` is an int that specifies whether it's a `CementBag`, `WoodPlanks` ,`PlasticBarrel`, etc. Some items are uniquely specified by the `Metadata.entity_type` (the Prefab name string) but some are not.

![entity creation pipeline before](/assets/2019-01-15-logbook/entity-creation-before.png)

With the SDK Pipeline out of the way, though, a more sensible and 'linear' entity creation pipeline comes to mind, one that goes through the *Template* **first**, before Instantiating a Prefab.

- A new entity comes in from the runtime, it has an `ObjectType` component.
- The *Template* is found based on the `ObjectType`. 
- The *Template* stores a link to the prefab, which is instantiated.
- The *Template* is responsible for setting other properties on the instantiated object. (Perhaps adding other ECS components)
- Use `LinkGameObjectToEntity` to link the Template to the Entity I suppose?


![entity creation pipeline before](/assets/2019-01-15-logbook/entity-creation-after.png)

For a GameObject-based workflow, this *Template* could be a sensible place to store much of the definition-y stuff that we talked about before.

My question is: Is this something I can elaborate? Or will the GDK design break this in the future?



## Week 37

Worked on ECS / GDK (see separate logbook: https://forums.improbable.io/t/doing-it-gdk-migration-logbook/4529)

## Week 38

So going to rewrite the TransformUpdater or the ProxyBody to an ECS system.

Takeaways:

- Use the `GetGroup` api because the Injection might get deprecated (also easier to skip frames)
- Create ECS component that links to the proxy GameObject & colliders.
  - Maybe even do GetComponents() whenever proxy needs to refresh, because that won't be often and that means I don't need to keep a `Dictionary<Collider, Collider>()`
- Create SharedComponentData to define direction? Or use Authority?
  - GameObject has Authority**: proxy should copy to origin body
  - GameObject has no Authority: origin should copy to proxy
  - GameObject is fixed/static: no copying.
    - ** Over which component? TransformUpdater? Do all Proxies always also have a TransformUpdater?

## Week 39

Ok I'm back home again. Time to reprioritize to do a playtest. Today I was figuring out why my bandwidth usage was so high last week when testing with 10 people.



![2018-09-24 at 15.49.38](/assets/2019-01-15-logbook/2018-09-24%20at%2015.49.38.png)



https://forums.improbable.io/t/bandwidth-usage/4582

**Durability**

I have to add a durability system I guess. What are the requirements for this? 

- Creep affects durability in a deterministic and predictable fashion. Durability decreases at a maximum rate.
- Blocks that are cleared of creep are *repaired* completely. Removing creep is the only maintenance required, no additional repairing is needed.
- Falling debris damages blocks, instantly affecting durability. Damage is automatically repaired over time (like above).
- ((A unique 'hardness' determines whether objects will keep standing after being overgrown. This allows density to be tweaked per region.))

Had a nice talk yesterday with F & D about writing logbooks. Gonna keep it up :) 

And today I'm getting back in a productive mood which means I can be happy refactoring stuff without ever keeping an eye on the big picture. Hooray. So I'm gonna create an `Interactable` interface for interacting with items on the ground, with the terrain, with cutting plants. That should simplify player code a lot.

# For the Playtest

1. What are the issues that really need to be fixed for playability? 
2. Can I group those issues into themes so that I can handle them in batches? 
3. Will there be any time left for adding content, and what should that be?

**Big Features**

- ✅ Player motion is fixed
- 🚧 Interface is almost fixed
- Durability of objects! Stuff HAS TO decay.
- Cutting / interacting with plants (to prevent decay)
- Chat ? 
- Online Config to avoid redeployment!

# Long Term Plans

- Habitats secure an area around to be owned by player. Awesome tents and tarp buildings with little fences around them
- Plants give players stuff that they want.
- Tilted Pillars! Balancing stuff! Maybe the game is about balance!



------

# **TODO**

### Crosshair Movement, Cursor UI and Camera Tracking

- [x] Decouple the crosshair from player movement when standing still. 
- [ ] Recenter (and fade?) the crosshair when starting to run
- [ ] When running: mouse always controls camera and crosshair is centered.
- [x] Track camera when running sideways (allow KB-only nav)
- [ ] Do camera raycast to player and not to ground point.
- [ ] https://devforum.roblox.com/t/new-camera-movement-option-rotate-in-third-person-without-shiftlock-or-rmb/30632
- [x] Center player ~~when running?~~ always.

### Growing food and resource Limits

- [ ] QUESTION ZERO: DO I WANT FOOD?
  - Trees are wood + food so that's cool? But is it that kind of game?
  - Growing food means watering and stuff so that's also cool. 
- [ ] Question one: does growing need soil? 
  - [ ] Is the ground made up of soil?
  - [ ] Soil in boxes? 
- [ ] Are plants just carrots in boxes? Does a real tree grow out of a box?

### Test deployment and pick date for playtest

### Terrain Generation

- [ ] More interesting heightmap
- [ ] Better texture for rock and sand

### Player Movement and animation

- [x] Animation for hanging on to ledges and better detection (vertical raycast)

  - [ ] Don't allow sliding around on ledges (but maybe shimmying?)
- [x] Lower jump height and snappier jump (increase grav?)
- [ ] Jump animation
- [ ] Ladder climbing animation
- [ ] Fix player ground detection (can currently just climb up verticals)

  ​

### Optimizations (LATER❗️)

1️⃣ make it work, 2️⃣ make it right, 3️⃣ make it fast.

- Don't add particle system to every Block gameObject. (Only when they start moving)
- Replace Quaternions for 'TransformUpdate' rotation component. Send quantised euler angles and compress/decompress on the fly.
- Compress and trim heightmap patch updates



**Minor**

- [x] Stairs are not climbable (player slides down)
- [x] Disallow interaction with world while in pause mode
- [x] Camera FOV when zooming out
- [ ] Destroy boards when attachment is gone
- [x] Vines get created every time a worker starts because they're in OnEnable
- [ ] Tweak the fog
- [x] Building pillars is janky because they are shrinking. Placement is too strict.
- [ ] Solution to the SlowUpdate is maybe to "stash" entities when they figure they don't need updating. Stashed entities would be re-entered into the SlowUpdate pool periodically. 

---
- [Intro](/2019/01/garbage-country-logbook)
- [Logbook 2017](/2019/01/garbage-country-logbook-2017) 
- [Logbook 2018 Part 1](/2019/01/garbage-country-logbook-2018-pt-1) 
- [Logbook 2018 Part 2](/2019/01/garbage-country-logbook-2018-pt-2) 👈 You are here.
- [Logbook 2018 Part 3](/2019/01/garbage-country-logbook-2018-pt-3)
- [Logbook 2019](/2019/01/garbage-country-logbook-2019)
- [Gallery](/2019/01/garbage-country-logbook-gallery)
