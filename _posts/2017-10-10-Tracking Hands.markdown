---
comments: true
date: 2017-10-10 16:00:00+00:00
layout: post
slug: tracking-hands
title: Tracking Hands
thumbnail: /assets/2017-10-10-tracking-hands/thumbnail.png
tags:
- artificial intelligence
- deep learning
- openFrameworks
---

The last few months I've been working on building a small program that can track hands from a webcam feed in real-time. For this, I used Deep Neural Networks, with many thanks to [course.fast.ai](http://course.fast.ai) for getting me caught up on the subject. Getting up and running with Convolutional Neural Networks was pretty easy, as was training and getting decent accuracy with a limited training set. I kept a more detailed log in [this forum thread](http://forums.fast.ai/t/training-a-network-to-detect-hands/4917). The results below were generated frame-by-frame and then converted to a movie.

* ![Example GIF](/assets/2017-10-10-tracking-hands/example.gif)

Unfortunately, the real problem with this project is turning out to have a more technical (as opposed to theoretical) nature. My goal was to wrap the neural network in a somewhat-portable "tracking server" that broadcasts to other motion-controlled apps on the same network/machine. I have tried OpenCV::DNN and tiny-dnn in an openFrameworks app, but I haven't found a convenient solution to using the network yet. From what I've seen, the research libraries (Keras, PyTorch) are elegant and easy to use, but using the networks from C++ in 'production' is a whole different story. 

