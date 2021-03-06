var args = arguments[0] || {};
var logging = args.logging || false;

$.navController = new NavigationController();

function NavigationController() {
	this.windowStack = [];
};
//open a new window
NavigationController.prototype.open = function(/*Ti.UI.Window*/windowToOpen,/*bool*/HideNavBar) {
	if(logging){Ti.API.log("Open function.");}
	if(HideNavBar){
        if(logging){Ti.API.log("hide default navigation bar");}
        windowToOpen.navBarHidden = true;
        }
    else
        windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;
    
	//add the window to the stack of windows managed by the controller
	this.windowStack.push(windowToOpen);

	//grab a copy of the current nav controller for use in the callback
	var that = this;
	var lastPushed = windowToOpen;
	windowToOpen.addEventListener('close', function() {
		if (that.windowStack.length > 1) // don't pop the last Window, which is the base one
		{
			if(logging){Ti.API.log("Event 'close': " + this.title);}
			var popped = that.windowStack.pop();
		
			if (lastPushed != popped)
			{
				if(logging){Ti.API.log("Last window should NOT have been popped. Push it back on the stack!");}
				that.windowStack.push(popped);
			}
			
			// close dependent window ?
			if (this.toClose) {
				if(logging){Ti.API.log("Invoke close on dependent window:" + this.toClose.title);}
			 	// close "parent" window, do not use animation (it looks weird with animation)
			 	(that.navGroup) ? that.navGroup.closeWindow(this.toClose, {animated : false}) : this.toClose.close({animated:false});
			}
			
			// open dependent window ?
			if (this.toOpen) {
				if(logging){Ti.API.log("Invoke open on dependent window:" + this.toOpen.title);}
			 	that.open(this.toOpen,this.HideNavBar);
			} 
		
			if(logging){Ti.API.log("End event 'close'. Stack: " + that.windowStack.map(function(v) {return v.title;}));}
		} // end if windowStack.length > 1, and end of my hack
	}); // end eventListener 'close'
	
	windowToOpen.addEventListener('set.to.close', function(dict) {
		if(logging){Ti.API.log("Event 'set.to.close': " + this.title);}
		this.toClose = dict.win;
	});
	
	windowToOpen.addEventListener('set.to.open', function(dict) {
		if(logging){Ti.API.log("Event 'set.to.open': " + this.title);}
		this.toOpen = dict.win;
		this.HideNavBar = dict.HideNavBar;
	});

	//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
	windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;

	//This is the first window
	if (this.windowStack.length === 1) {
		if (Ti.Platform.osname === 'android') {
			windowToOpen.exitOnClose = true;
			windowToOpen.open();
		} else {
			this.navGroup = Ti.UI.iOS.createNavigationWindow({
				window : windowToOpen
			});
			this.navGroup.open();
		}
	}
	//All subsequent windows
	else {
		if (Ti.Platform.osname === 'android') {
			windowToOpen.open();
		} else {
			this.navGroup.openWindow(windowToOpen);
		}
	}
	if(logging){Ti.API.log("End Open. Stack: " + this.windowStack.map(function(v) {return v.title;}));}
}; // end of open function
//close current window
NavigationController.prototype.close = function() {
    if(logging){Ti.API.log("Back function.");}
    var wsl = this.windowStack.length;
    if (wsl > 1) {
        (this.navGroup) ? this.navGroup.closeWindow(this.windowStack[wsl - 1]) : this.windowStack[wsl - 1].close();
    }
    if(logging){Ti.API.log("End Back. Stack: " + this.windowStack.map(function(v) {return v.title;}));}
};
//go back to the initial window of the NavigationController
NavigationController.prototype.home = function() {
	if(logging){Ti.API.log("Home function.");}
	var wsl = this.windowStack.length;
	if (wsl > 1) {
		// setup chain reaction by setting up the flags on all the windows
		for (var i = wsl - 1; i > 1; i--)
		{
			// set dependent window
			this.windowStack[i].fireEvent('set.to.close', {win: this.windowStack[i - 1]});
       	}
        // start chain reaction, close first window
		(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[wsl - 1]) : this.windowStack[wsl - 1].close();
	}
	if(logging){Ti.API.log("End Home. Stack: " + this.windowStack.map(function(v) {return v.title;}));}
};
//go back to the initial window of the NavigationController then open a new window
NavigationController.prototype.openFromHome = function(/*Ti.UI.Window*/windowToOpen,/*bool*/HideNavBar) {
	if(logging){Ti.API.log("openFromHome function.");}
	if(this.windowStack.length == 1)
		this.open(windowToOpen,HideNavBar);
	else
	{
		// delegate opening of the window to last window to close
		this.windowStack[1].fireEvent('set.to.open', {win: windowToOpen, HideNavBar: HideNavBar});
		this.home();
	}
	if(logging){Ti.API.log("End openFromHome. Stack: " + this.windowStack.map(function(v) {return v.title;}));}
};

exports = NavigationController;