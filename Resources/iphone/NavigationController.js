function NavigationController() {
    this.windowStack = [];
}

NavigationController.prototype.open = function(windowToOpen, HideNavBar) {
    Ti.API.log("Open function.");
    if (HideNavBar) {
        Ti.API.log("hide default navigation bar");
        windowToOpen.navBarHidden = true;
    } else windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;
    this.windowStack.push(windowToOpen);
    var that = this;
    var lastPushed = windowToOpen;
    windowToOpen.addEventListener("close", function() {
        if (that.windowStack.length > 1) {
            Ti.API.log("Event 'close': " + this.title);
            var popped = that.windowStack.pop();
            if (lastPushed != popped) {
                Ti.API.info("Last window should NOT have been popped. Push it back on the stack!");
                that.windowStack.push(popped);
            }
            if (this.toClose) {
                Ti.API.log("Invoke close on dependent window:" + this.toClose.title);
                that.navGroup ? that.navGroup.closeWindow(this.toClose, {
                    animated: false
                }) : this.toClose.close({
                    animated: false
                });
            }
            if (this.toOpen) {
                Ti.API.log("Invoke open on dependent window:" + this.toOpen.title);
                that.open(this.toOpen, this.HideNavBar);
            }
            Ti.API.log("End event 'close'. Stack: " + that.windowStack.map(function(v) {
                return v.title;
            }));
        }
    });
    windowToOpen.addEventListener("set.to.close", function(dict) {
        Ti.API.log("Event 'set.to.close': " + this.title);
        this.toClose = dict.win;
    });
    windowToOpen.addEventListener("set.to.open", function(dict) {
        Ti.API.log("Event 'set.to.open': " + this.title);
        this.toOpen = dict.win;
        this.HideNavBar = dict.HideNavBar;
    });
    windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;
    if (1 === this.windowStack.length) if ("android" === Ti.Platform.osname) {
        windowToOpen.exitOnClose = true;
        windowToOpen.open();
    } else {
        this.navGroup = Ti.UI.iOS.createNavigationWindow({
            window: windowToOpen
        });
        this.navGroup.open();
    } else "android" === Ti.Platform.osname ? windowToOpen.open() : this.navGroup.openWindow(windowToOpen);
    Ti.API.log("End Open. Stack: " + this.windowStack.map(function(v) {
        return v.title;
    }));
};

NavigationController.prototype.back = function() {
    Ti.API.log("Back function.");
    var wsl = this.windowStack.length;
    wsl > 1 && (this.navGroup ? this.navGroup.closeWindow(this.windowStack[wsl - 1]) : this.windowStack[wsl - 1].close());
    Ti.API.log("End Back. Stack: " + this.windowStack.map(function(v) {
        return v.title;
    }));
};

NavigationController.prototype.home = function() {
    Ti.API.log("Home function.");
    var wsl = this.windowStack.length;
    if (wsl > 1) {
        for (var i = wsl - 1; i > 1; i--) this.windowStack[i].fireEvent("set.to.close", {
            win: this.windowStack[i - 1]
        });
        this.navGroup ? this.navGroup.closeWindow(this.windowStack[wsl - 1]) : this.windowStack[wsl - 1].close();
    }
    Ti.API.log("End Home. Stack: " + this.windowStack.map(function(v) {
        return v.title;
    }));
};

NavigationController.prototype.openFromHome = function(windowToOpen, HideNavBar) {
    Ti.API.log("openFromHome function.");
    if (1 == this.windowStack.length) this.open(windowToOpen, HideNavBar); else {
        this.windowStack[1].fireEvent("set.to.open", {
            win: windowToOpen,
            HideNavBar: HideNavBar
        });
        this.home();
    }
    Ti.API.log("End openFromHome. Stack: " + this.windowStack.map(function(v) {
        return v.title;
    }));
};

module.exports = NavigationController;