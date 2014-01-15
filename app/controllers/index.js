var NavigationController = Alloy.createWidget("com.n3wc.navcontrolleralloy",{logging:true});
Alloy.Globals.navcontroller = NavigationController.navController;


var testwin = Alloy.createController('TestWindow').getView();
Alloy.Globals.navcontroller.open(testwin);
