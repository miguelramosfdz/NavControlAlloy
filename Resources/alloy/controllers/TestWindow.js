function Controller() {
    function addClick() {
        Alloy.Globals.navcontroller.open(Alloy.createController("TestWindow").getView());
    }
    function homeClick() {
        Alloy.Globals.navcontroller.home();
    }
    function addfhClick() {
        Alloy.Globals.navcontroller.openFromHome(Alloy.createController("TestWindow").getView());
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.TestWindowView = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "TestWindowView",
        layout: "vertical"
    });
    $.__views.TestWindowView && $.addTopLevelView($.__views.TestWindowView);
    $.__views.add = Ti.UI.createButton({
        top: 20,
        width: 200,
        height: 50,
        id: "add",
        title: "Add A New Window"
    });
    $.__views.TestWindowView.add($.__views.add);
    addClick ? $.__views.add.addEventListener("click", addClick) : __defers["$.__views.add!click!addClick"] = true;
    $.__views.home = Ti.UI.createButton({
        top: 20,
        width: 200,
        height: 50,
        id: "home",
        title: "Go to the Home Window"
    });
    $.__views.TestWindowView.add($.__views.home);
    homeClick ? $.__views.home.addEventListener("click", homeClick) : __defers["$.__views.home!click!homeClick"] = true;
    $.__views.addfh = Ti.UI.createButton({
        top: 20,
        width: 200,
        height: 50,
        id: "addfh",
        title: "Open New From Home"
    });
    $.__views.TestWindowView.add($.__views.addfh);
    addfhClick ? $.__views.addfh.addEventListener("click", addfhClick) : __defers["$.__views.addfh!click!addfhClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.TestWindowView.title = "Window " + Alloy.Globals.navcontroller.windowStack.length;
    __defers["$.__views.add!click!addClick"] && $.__views.add.addEventListener("click", addClick);
    __defers["$.__views.home!click!homeClick"] && $.__views.home.addEventListener("click", homeClick);
    __defers["$.__views.addfh!click!addfhClick"] && $.__views.addfh.addEventListener("click", addfhClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;