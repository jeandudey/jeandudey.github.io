---
layout: post
title: "Sane creation of USB bootable drives"
tags: [linux, usb, manual]
published: true
---

Rather small cookbook recipe for creating Linux bootable drives using your hands
some commands and some magic.

you might do this because you're either:

1. Paranoic and you want to keep your trust chain small, or making your own rootfs.
2. Trying to use an ISO image which doesn't boot even if you use `dd` and write
it to the USB drive.
3. God knows why, maybe you want some documentation.

Well be using `syslinux` to accomplish this, you may want to download it using
your package manager, downloading a random `.exe` if you're on Windows as we
all do, or - _coughs in paranoic_ - compile it yourself from the source code.

Also, this is for the MBR partition scheme, GPT is too advanced for my 2011
computer.

<p align="center">
  <img src="/assets/img/usb.jpeg" alt="USB drive" width="500px" height="400px"/>
  <br/>
  <i>Photo of my small USB with some Rust</i>
  <br/>
  2020 (C) Me The Owner
</p>

# Erasing parition table

- **Warning!!** All your data will be gone after this and I don't care too much, so
please do a backup, also, be sure you don't write to the wrong `/dev/sdX` device
like your system drive for example.

1. Find your device with `lsblk`
2. Umount it `sudo umount /dev/sdX`
3. Erase partitions `dd if=/dev/zero of=/dev/sdX bs=512 count=1 conv=notrunc`

You now shouldn't see any partitions with `lsblk` on your drive.

*Remember to change sdX with your device please*

# Partitioning

Ironically we need partitions _again_, let's do this job with our old friend `fdisk`.

- Go with `sudo fdisk /dev/sdX`.
- _Make sure there aren't partitions_ by using the `p` command.

```
Welcome to fdisk (util-linux 2.31.1).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Device does not contain a recognized partition table.
Created a new DOS disklabel with disk identifier 0xe74168a6.

Command (m for help): p
Disk /dev/sdb: 119,5 GiB, 128320801792 bytes, 250626566 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xe74168a6
```

- Make new partition with `n`, then `p` for primary partition, at this point
you can use the defaults (all of the drive) or create your own complex partitions.
Just accept the defaults and go on.

```
Command (m for help): n
Partition type
   p   primary (0 primary, 0 extended, 4 free)
   e   extended (container for logical partitions)
Select (default p): p
Partition number (1-4, default 1):
First sector (2048-250626565, default 2048):
Last sector, +sectors or +size{K,M,G,T,P} (2048-250626565, default 250626565):

Created a new partition 1 of type 'Linux' and of size 119,5 GiB.
```

- Now make it a fat32 partition by writing `t` to change partition type and then
using `b` (which is the value for fat32).

```
Command (m for help): t
Selected partition 1
Hex code (type L to list all codes): b
Changed type of partition 'Linux' to 'W95 FAT32'.
```

- Make it active (bootable) with `a`.

```
Command (m for help): a
Selected partition 1
The bootable flag on partition 1 is enabled now.
```

- Write with `w`.

```
Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

- Make it fat (in the good sense) `sudo mkfs.vfat /dev/sdX1`

# Setting up `syslinux`

1. Okay, mount your drive to your preferred folder, maybe `/mnt/usb`.
- `sudo mkdir -p /mnt/usb`
- `sudo mount /dev/sdb1 /mnt/usb`

2. Copy syslinux files for BIOS.
- `sudo mkdir -p /mnt/usb/boot/syslinux`
- `sudo sudo cp -v -a /usr/lib/syslinux/modules/bios/*.c32 boot/syslinux`

3. Install syslinux.
- `sudo umount /mnt/usb`
- `sudo syslinux --install /dev/sdb1 --directory boot/syslinux`

4. Copy MBR.
- `dd bs=440 count=1 conv=notrunc if=/usr/lib/syslinux/mbr/mbr.bin of=/dev/sda`

Et voila! you now have your syslinux running on your usb, now you can setup the
rootfs and add the syslinux configuration files.
