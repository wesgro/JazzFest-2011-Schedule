
//init on device readyness

function onDeviceReady() {
    navigator.network.isReachable(DOMAIN, function(status) {
	  var connectivity = (status.internetConnectionStatus || status.code || status);
	  if (connectivity === NetworkStatus.NOT_REACHABLE) {
		alert("No internet connection - we won't be able to load the Schedule");
	  } else {
		//alert("We can reach "+DOMAIN+" - get ready for some awesome maps!");
		init.load_data();
	  }
	});
	
	//alert("device ready");
	var cb = ChildBrowser.install();
	
}

function launch_dialog(content, callback) {
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'>" + content + "</div>").css({
        "display": "block",
        "opacity": 0.96,
        "top": $(window).scrollTop() + 100
    }).appendTo($.mobile.pageContainer).delay(800).fadeOut(400, function () {
        $(this).remove();
    });
    if (callback) {
        callback();
    }

}
function page_id(id){
	return "page_"+id;	
}
var init = {
	load_data: function(){
		var data = {
            method: "views.get",
            sessid: "b06294210fdde5072d1163c446991ff5",
            view_name: VIEW_NAME,
            display_id: null
        }
        var $obj = [];
        var $connection = get_data;
        for (var i in DATES) {
            data.display_id = DATES[i];
            $connection.data = data;
            $obj[i] = $connection.connect();

        }
		var count = 0;
        for (var i in $obj) {
			count++
            parse_html.make_list($obj[i], i, count); 
			
        }	
		
	},
	_load_pages: function(){
			var data = {
            method: "views.get",
            sessid: "b06294210fdde5072d1163c446991ff5",
            view_name: VIEW_NAME,
            display_id: 'page_1'
        }
        var $obj = [];
        var $connection = get_data;
		$connection.data = data;
		$obj = $connection.connect();
		parse_html.make_pages($obj);
		return this;
	}
}
var parse_html = {
    make_list: function ($obj, id, count) {
        var $ID = $("#" + id + " li:first-child");
		
        $obj.success(function (dataObj) {
            for (var i in dataObj.data) {
                var title = dataObj.data[i].node_title;
                var id = page_id(dataObj.data[i].nid);
                $ID.after('<li><a href="#' + id + '">' + title + '</a></li>');
            }
			(count == 3)?$obj.complete(function(){init._load_pages()}):0;

        });
		
    },
	make_pages:function($obj){
		//TODO replicate below html into repeatable list
		
		$obj.success(function(dataObj){
			for(var i in dataObj.data){
				var $data = dataObj.data[i]
				//log($data.node_data_field_event_external_link_field_event_image_url_value);
				var id = page_id($data.nid);
				var pretty_date = ($data.node_data_field_event_external_link_field_event_date_value) ? date("F m h:i A", strtotime($data.node_data_field_event_external_link_field_event_date_value)):'';
				var event_title = ($data.node_data_field_event_external_link_field_event_external_link_title)?$data.node_data_field_event_external_link_field_event_external_link_title:'';
				var location = ($data.term_data_name)?$data.term_data_name:'';
				var site_url = ($data.node_data_field_event_external_link_field_event_external_link_url)?$data.node_data_field_event_external_link_field_event_external_link_url:'';
				var description = ($data.node_data_field_event_external_link_field_event_description_value) ?$data.node_data_field_event_external_link_field_event_description_value:'';
				var youtube = ($data.node_data_field_event_external_link_field_event_youtube_id_value)?'<a href="http://www.youtube.com/watch?v='+$data.node_data_field_event_external_link_field_event_youtube_id_value+'" data-role="button" data-icon="info" rel="launch_external">View Youtube Video</a>':'';
				var event_image=($data.node_data_field_event_external_link_field_event_image_url_value)?'<div class="image"><img width="248" src="'+$data.node_data_field_event_external_link_field_event_image_url_value+'" alt="event image" /></div>':'';
				//event_image = "";
					 $page = $('<div data-role="page" data-theme="c"  id="'+id+'">');
				$header = $('<div data-role="header"><h1>Victoria JazzFest</h1><a href="#jazz-home" data-icon="home" data-iconpos="notext" data-direction="reverse" class="ui-btn-right">Home</a></div>');
				$date_header = $('<ul data-role="listview" data-theme="a" data-divider-theme="a"><li data-role="list-divider" data-theme="a">'+pretty_date+'</li></ul>');
				$content = $('<div data-role="content" class="content" role="main"><h3>'+event_title+'</h3><p>'+location+'</p>'+event_image+'<div class="body">'+description+'</div></div>');
				$footer = $('<div data-role="footer" data-id="refresh-footer" data-position="fixed" data-theme="a"><a href="'+site_url+'" data-role="button" data-icon="info" rel="launch_external">Visit Artist Site</a> '+youtube+'</div>');
				$page.append($header).append($date_header).append($content).append($footer);
				$("body").append($page);
			}
		});
		//when completed init page
		$obj.complete(function () {
        	setTimeout("$.mobile.initializePage()", 1500);
			//$("body").removeClass("loading");
        });
	}
}

