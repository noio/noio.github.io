---
author: admin
comments: true
date: 2011-03-01 21:36:50+00:00
layout: post
slug: stitching-smiles
title: Stitching Smiles
wordpress_id: 410
tags:
- artificial intelligence
- computer vision
---

For a project in our MSc Artificial Intelligence at the University of Amsterdam, Gilles de Hollander and me implemented a new system for automatically fixing group portraits. You are probably familiar with the situation of trying to take a good picture of a group of people, what usually happens is that not everyone is smiling at the same time, people look away, they have their eyes closed, etc. We used computer vision techniques to automatically combine a series of 'bad' group portraits into a single good one, where everybody smiles.

[caption id="attachment_437" align="aligncenter" width="600" caption="An example of a group portrait where not everybody was smiling at once."]![](http://www.noio.nl/wordpress/wp-content/uploads/stitching-smiles/source-images.png)[/caption]


#### Step One: _Finding Faces_


This was the easiest part of the project. Face detection has pretty much been solved. The [Viola-Jones](http://en.wikipedia.org/wiki/Viola-Jones_object_detection_framework) object detection works more than well enough for our needs. You can download many different implementations of the Viola-Jones algorithms, we used the one included in [OpenCV](http://opencv.willowgarage.com/wiki/).

[caption id="attachment_421" align="aligncenter" width="600" caption="Results of the face detection"]![Viola-Jones face detection.](http://www.noio.nl/wordpress/wp-content/uploads/stitching-smiles/violajones.png)[/caption]


#### Step Two: _Rating Smiles_


Now that we know where the faces are, it's time for the real A.I. task: judging whether the faces are smiling or not. I'll give a quick rundown of how that works. We collected and labeled about 6000 images of smiling and "not smiling" people and we trained a so-called _support vector machine_. As preprocessing, we computed the _histogram of oriented gradients_ of each image  (refer to the report for more details). The SVM can then assign scores or ratings to each face. We use these ratings to sort the faces, and pick the most smiling face for each person in the image.

[caption id="attachment_423" align="aligncenter" width="600" caption="Smile ratings for frames of a movie displayed as bars."]![Smile Ratings](http://www.noio.nl/wordpress/wp-content/uploads/stitching-smiles/smilerates-600x80.png)[/caption]


#### Step Three: _Stitching it all back together_


The third and final step is to take the areas from the photos that were indicated to be smiling faces, and stitch these back together into a neat looking composite. We have to find places where we can cut the image without creating a visible seam. Obviously, just pasting the smiling faces onto the non-smiling faces will give conspicuous artifacts, as you can see in the following image.

[caption id="attachment_435" align="aligncenter" width="600" caption="Just pasting the smiling faces doesn't quite cut it."]![](http://www.noio.nl/wordpress/wp-content/uploads/stitching-smiles/copypasted.gif)[/caption]

The state-of-the-art methods for image segmentation use a method called _minimum graph cut. _As an input you can define a map of "costs" that indicates where the seams can be put without being obtrusive. The _min-cut max-flow_ algorithm then finds the best "cut" through the image.

[caption id="attachment_436" align="aligncenter" width="600" caption="Blue areas were taken from picture A, green areas from picture B."]![](http://www.noio.nl/wordpress/wp-content/uploads/stitching-smiles/overlayed-labels.png)[/caption]

As a final touch we apply a tiny bit of blending to the edges. We applied the procedure to a set that includes the two pictures at the beginning of the post plus two more images and the result is shown below.

[caption id="attachment_473" align="aligncenter" width="600" caption="The resulting image: everyone is smiling!"][![](http://www.noio.nl/wordpress/wp-content/uploads/stitching-smiles/final-stitched-01-600x348.png)](http://www.noio.nl/wordpress/wp-content/uploads/stitching-smiles/final-stitched-01.png)[/caption]



#### Conclusion


This whole procedure requires no setup or intervention, you can just put in the group shots in one end, and a neat composite comes out the other end in less than a minute. We feel that this method could be used for a special "group shot mode" in digital cameras. This mode would take multiple shots and composite them all at the press of a single button. We are also looking at the feasibility of turning this project into an iPhone App. If you want to know more about the exact implementation, read the [report](http://www.noio.nl/wordpress/wp-content/uploads/stitching-smiles/projectAI-2011-dehollander-vandenberg.pdf).
