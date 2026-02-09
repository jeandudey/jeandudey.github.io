---
title: "Projects"
projects:
  - name: "tokio-udev and mio-udev"
    description: "Asynchronous udev hotplug monitor using Tokio and Mio. "
    url: "https://github.com/jeandudey/tokio-udev"
    tags:
      - rust

  - name: "DDNS Updater (Snap)"
    description: |
      A snap package for the ddns-updater program to update your domain's IP address,
      currently using it on a little virtual machine crafted from Ubuntu Core to
      run the ddns-updater service as a snap package.

      Supports configuration via the snap configuration commands.
      
      This allows me and my friends to play together using dedicated servers
      for games like Project Zomboid.
      
      Chose to use a snap package because I only needed a single service to run
      on the machine and thought that using the official Docker image was
      overkill for such a task, also for learning to package applications
      using Snap.
    url: "https://github.com/jeandudey/snap-ddns-updater"
    tags:
      - snap
      - ubuntu
---
