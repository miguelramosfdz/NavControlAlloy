$.TestWindowView.title = 'Window ' + Alloy.Globals.navcontroller.windowStack.length;

function addClick(e) 
{  
	Alloy.Globals.navcontroller.open(Alloy.createController('TestWindow').getView());
}
function addClickNoNav(e) 
{  
	Alloy.Globals.navcontroller.open(Alloy.createController('TestWindow').getView(),true);
}
function homeClick(e)
{
	Alloy.Globals.navcontroller.home();
}

function addfhClick(e)
{
	Alloy.Globals.navcontroller.openFromHome(Alloy.createController('TestWindow').getView());
}
function closeClick(e) 
{  
	Alloy.Globals.navcontroller.close();
}