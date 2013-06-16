function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    var NavigationController = require("NavigationController");
    var navController = new NavigationController();
    Alloy.Globals.navcontroller = navController;
    var testwin = Alloy.createController("TestWindow").getView();
    Alloy.Globals.navcontroller.open(testwin);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;