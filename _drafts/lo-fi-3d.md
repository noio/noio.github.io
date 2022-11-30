---
title: A different approach to "Lo-Fi 3d"
slug: lo-fi-3d
layout: post
---



## Motivation

Lo-fi 3D is a style that has been growing for the last couple of years. Cloud Gardens is loosely based on it. For me that means 3D art with low poly, chunky geometry, textured using pixel art. Some people call it the "PS1" aesthetic, though that's adding a few rendering quirks into the mix as well.

https://twitter.com/artofsully
https://twitter.com/lampysprites/media
https://twitter.com/MrmoTarius
https://twitter.com/Kaffeebohnson

[EXAMPLE IMAGE]

My workflow for making this type of art is a mess. I have a stronger pixel art background and I really appreciate that part of the aesthetic. That is why I will often start out with drawing pixel art textures, then use those to model. Often those textures are not enough or not appropriate, so end up going back and forth between drawing additional textures and 3D-modeling. 

### Issue 1

Tools are not set up for going back and forth between modeling and texturing. Sprytile and Crocotile allow you to do texturing -> modeling, but make going the other way harder again. In general, once you've unwrapped a model, it's usually not easy to make even small tweaks to the geometry without destroying your texture work. UV unwrapping is like a one-way street.

### Issue 2

Tools are not set up for working with pixel art textures in general. 
- Exporting a UV map that you can draw pixel art on top of is hard. 
- UV unwrapping in a way that "preserves" pixel art is a hassle. 
- Ensuring consistent pixel sizes is a hassle.

### Solution 1

Doing an automatic unwrap followed by direct texture painting would alleviate some of these issues, but it's unsuitable for all but the quickest & dirtiest art styles.

1. Traditional 3d modeling tools are not always ideally suited for this, a lot of manual adjustment is needed.
2. As someone with more of a pixel art background, I tend to start from the pixel art texture, this can be hard.
   1. Sprytile and Crocotyle reverse the workflow, but then you need to do ALL the texturing first.
3. I would like a smooth workflow that lets me discover what I'm making as I'm making it, going between modeling and texturing.
   1. UV-mapping is one roadblock that is preventing this, essentially acting like a one-way street in the process.
   2. Why do we even care about UV mapping? On the High-def end of the spectrum, I think tools are moving towards auto-uv. Neatly squeezing out every pixel of texture becomes less important as machines get more powerful. 
      1. However, on the very lo-fi end of the spectrum, UV map tidiness is important for a different reason: getting nice, even, chunky pixels on the model.

