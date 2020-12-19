---
layout: post
title: "Rust and Vala State of the Art"
tags: [rust, vala, ffi, gui, elementary]
published: true
---

I have been using [Elementary OS] for a while, and - in my opinion -
it provides a great user experience on Linux mainly using a combination
of [Vala] and [GTK+] for the user applications. And with some curiosity
I checked if Vala and Rust could talk to each other.

<p align="center">
  <img src="/assets/img/elementary-look.png" alt="Elementary OS Screenshot"/>
  <br/>
  <i>Screenshot of my Elementary setup, default background</i>
</p>


[Elementary OS]: https://elementary.io/
[GTK+]: https://gtk.org/
[Vala]: https://wiki.gnome.org/Projects/Vala

# Vala

Vala is an [OOP] language that has been in use and made by GNOME Developers,
it uses the GObject type system underneath to support almost all the language
features, such as classes, interfaces, etc. It compiles down to C and provides
a compatible C FFI interface for the generated code, so any library made in
Vala can be used in other languages, like any other library that uses GObject
(e.g. [GTK+], [Pango], etc).

[OOP]: https://en.wikipedia.org/wiki/Object-oriented_programming
[Pango]: https://pango.gnome.org/

Generating bindings to other languages should be pretty straightforward, you
can use the automatically-generated GObject Introspection system, which is an
XML file with all the information you will need to generate any FFI code for
your language.

# Gettings the hands dirty

I tried to use the GIR files to generate bindings for the [Granite] library
made by the Elementary team which is written in Vala and provides nice
widgets for GTK+ that look awesome on Elementary.

[Granite]: https://github.com/elementary/granite

The [Gtk-rs] team made a tool to automate the process of
generating Rust FFI code and wrappers for the GObject based libraries that
already provide `.gir` files.

[Gtk-rs]: https://gtk-rs.org/

The [gir] tool came into my hands and some minutes later I got to test it
with Granite, and the Gee library on which Granite depends.

[gir]: https://github.com/gtk-rs/gir

The first thing you have to do is to have all your GIR files in a folder
like the gtk-rs project [gir-files] repository, I forked it ([here](https://github.com/jeandudey/gir-files/tree/granite-rs)),
added the bare GIR files for Granite and Gee.

[gir-files]: https://github.com/gtk-rs/gir-files

The journey started with Gee which had all sorts of problems on the GIR file
and the gir tool couldn't process, such as the classes weren't providing a C
symbol prefix, the return value of void function wasn't specified, so at this
point I decided to get my hands dirty on the `valac` compiler and fix some of
the GIR code generation routines.

I provided a little [merge request](https://gitlab.gnome.org/GNOME/vala/-/merge_requests/133)
which with some help of the maintainer some tests were added to confirm the
behaviour, and made it to the work in progress tree of the next release.

As an alternative, while the `valac` packages on Ubuntu based distributions
get updated with those changes, I add some code to the fix.sh script that
is used by the Gtk-rs team, I added a single command of 160 lines full of
not my not-so-proud-of XPaths to edit the Gee GIR file and fix the errors,
the same was done with the Granite file, but this one was relatively small
in comparision with only 74 lines. Most of these fixes will be removed when
the new GIR files are released, there are still some things that needs to
be fixed, such as the "generics" which the valac compiler generates
in some way that the gtk-rs gir tool doesn't like and doesn't supports.
But that is on my to-do list to investigate and solve one of these weekends.

At the end the files were working and `gir` started to generate Rust code
that talked to vala, but still with some problems, such as the missing
_self_ parameter on the `gee-sys` and `granite-sys` crates that were generated,
and subsequently on the _wrapper_ crates `gee` and `granite` causing a lot
of runtime errors. This is still unfixed and will have likely have to be
fixed on the `valac` GIR code generation unit itself, since it's a lot
of work to write hundreds of lines more to fix the GIR files.

Fixing the errors on the `valac` compiler also helps to use other libraries
that are made in Vala.

# Putting it all together

With all these bugs I still managed to create a window and use the
`Granite.Widgets.Welcome` widget on an application I'm working on
to use SDR devices.

It was pretty easy to use on Rust after all that work:

```rust
use granite::prelude::*;
use granite::widgets::Welcome;

pub struct WelcomeView {
    welcome: Welcome,
}

impl WelcomeView {
    pub fn new() -> WelcomeView {
        let welcome = Welcome::new("No Devices Open", "Open a device to start.");
        // Can't be done as append doesn't have the self parameter :-(
        //welcome.append(None, "Open", "Open a connected device.");

        WelcomeView { welcome }
    }

    pub fn widget(&self) -> &Widget {
        self.welcome.as_ref()
    }
}
```

And adding it to a window:

```rust
use gio::prelude::*;
use gtk::prelude::*;

use gtk::{Application, ApplicationWindow};

mod views;
mod config;
mod widgets;

use views::WelcomeView;
use widgets::HeaderBar;

fn main() {
    let application = Application::new(Some(config::APP_ID), gio::ApplicationFlags::empty())
        .expect("failed to initialize radio-rs GUI");

    application.set_resource_base_path(Some("/tech/jeandudey/radio-rs"));

    let res = gio::Resource::load(config::PKGDATADIR.to_owned() + "/radio-rs-resources.gresource")
        .expect("couldn't load gresource file");
    gio::resources_register(&res);

    application.connect_activate(|app| {
        let header_bar = HeaderBar::new();
        header_bar.set_title("Radio-rs");

        let window = ApplicationWindow::new(app);
        window.set_titlebar(&header_bar);
        window.set_default_size(640, 400);

        // Show the welcome view
        let welcome_view = WelcomeView::new(&window);
        window.add(welcome_view.widget());
        window.show_all();
    });

    application.run(&[]);
}
```

With this beautiful result, that does nothing for now, but with some love
aranite and other libraries could work with Rust in a future:

<p align="center">
  <img src="/assets/img/radio-rs.png" alt="Elementary OS Screenshot"/>
</p>

# Where's the code?

- The fork of [gir-files](https://github.com/jeandudey/gir-files/tree/granite-rs) with the fixes.
- [Granite-rs](https://github.com/jeandudey/granite-rs/) repository with some code generated
used for the application I'm doing.
