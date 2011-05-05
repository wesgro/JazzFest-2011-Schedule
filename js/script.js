//bind to all possible readyness states
document.addEventListener("deviceready", onDeviceReady, false);

$('body').live('pagebeforecreate', function (event) {
    //alert("derrp");
    //$("ul").listview("refresh");
    $("a[rel=launch_external]").live("vmouseclick click", function (event) {
		event.preventDefault();
		PhoneGap.exec("ChildBrowserCommand.showWebPage", event.currentTarget.href );
		//log("click");
		return false;
    });

});
