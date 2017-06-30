// Map Presentation script.
// This script should take into account the state of the toggle buttons
// It should also show the data for each site in a loop, progressing every x seconds.
// Author: Vinay Keerthi

var map_request = $.getJSON("/map_list_data", function (data) {
                      console.log( "Requesting data from the server!" );
                      // console.log("Inside: " + data);
                    })

map_request.done(function(data){
    buildMap(data);
});


function buildMap(data) {
    // Build the map and loop through the entire thing.
    var mymap;
    var mapdata;
    var jList = JSON.parse(data);
    var points = [];
    var point_markers = [];


    //  Initialize the Leaftlets map.
    mymap = L.map('mapid');
    mymap.setView([51.505, -0.09], 2);
    mapbox_api = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.'+
                'png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA'+
                '2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    // Add the GEOJson data from openmaps.
    L.tileLayer(mapbox_api, {
        maxZoom: 9,
        minZoom: 2,
        attribution: 'GKN Aerospace India',
        id: 'mapbox.streets'
    }).addTo(mymap);

    function reBind() {
        var kpi_check_state = document.getElementById("kpibtn").checked;
        var eci_check_state = document.getElementById("ecibtn").checked;
        var bill_check_state = document.getElementById("billbtn").checked;
        var popup_html;
        var json_entry;
        var site;
        var business;
        var competence;
        var gai_contact;
        var site_contact;
        var delegation;
        var activity;
        var comment;
        var invoiced_h;
        var invoiced_h_q1;
        var invoiced_h_q2;
        var invoiced_h_q3;
        var invoiced_h_q4;

        for (var i=0; i<point_markers.length; i++) {
            json_entry = jList[i];
            site = json_entry["Site"];
            business = json_entry["Business"];
            competence = json_entry["Competence"];
            gai_contact = json_entry["GAI Contact"];
            site_contact = json_entry["Site Contact"];
            delegation = json_entry["Delegation Held"];
            activity = json_entry["Active\/Non Active"];
            comment = json_entry["Comment"];
            invoiced_h = json_entry["Invoiced Hours"];
            invoiced_h_q1 = json_entry["Invoiced Hours -Q1"];
            invoiced_h_q2 = json_entry["Invoiced Hours -Q2"];
            invoiced_h_q3 = json_entry["Invoiced Hours -Q3"];
            invoiced_h_q4 = json_entry["Invoiced Hours -Q4"];
            var img_url = "static/images/gkn.jpg";
            popup_html = "<img src='" + img_url + "' width=30>";
            if (site){
                if (site.indexOf("Fokker") !== -1) {
                    // Is a Fokker site.
                    img_url = "static/images/fokker_logo.png";
                    popup_html = "<img src='" + img_url + "' width=30>";

                } else if (business) {
                    if (business.indexOf("Fokker") !== -1) {
                        img_url = "static/images/fokker_logo.png";
                        popup_html = "<img src='" + img_url + "' width=30>";
                    }
                }
            }
            popup_html += "<br><b>Site: </b>"+site;
            popup_html += "<br><b>Business: </b>"+business;
            if (competence) {
                popup_html += "<br><b>Competence: </b>"+competence;
            }
            if (gai_contact) {
                if (site_contact) {
                    // Two column table gai | site.
                    popup_html += "<table width=100%>"+
                                "<tr><th>GAI Contact</th>"+
                                "<th>Site Contact</th></tr>"+
                                "<tr><td><img src='static/images/na_picture.png' width=30 /><br/>" +
                                gai_contact + "</td><td>" +
                                "<img src='static/images/na_picture.png' width=30 /><br/>" + 
                                site_contact+"</td></tr>" + 
                                "</table>";
                } else {
                    // One Column table gai
                    popup_html += "<table width=100%>"+
                                "<tr><th>GAI Contact</th>"+
                                "</tr>"+
                                "<tr><td><img src='static/images/na_picture.png' width=30 /><br/>" +
                                gai_contact + "</td>" +
                                "</tr>" +
                                "</table>";
                }
            } else if (site_contact) {
                popup_html += "<table width=100%>"+
                                "<tr><th>Site Contact</th>"+
                                "</tr>"+
                                "<tr><td><img src='static/images/na_picture.png' width=30 /><br/>" +
                                site_contact + "</td>" +
                                "</tr>" +
                                "</table>";
                // One Column table site
            }
            if (kpi_check_state){
                popup_html += "<br /><b>KPI Information</b>: ";
            }
            if (eci_check_state){
                popup_html += "<br /><b>Export Control Information</b>:";
                popup_html += "<ul><li><b>ECCN 9E991</b>:" + json_entry["ECCN 9E991"]+"</li>";
                popup_html += "<li><b>ITAR\/USML XIX(g)</b>:" + json_entry["ITAR\/USML XIX(g) (see note 3 below)"]+"</li></ul>";
            }
            if (bill_check_state){
                popup_html += "<br /><b>Hours Billed</b>: "+json_entry["Invoiced Hours"];
            }
            point_markers[i].bindPopup(popup_html+"<br />");
            };
    };

    for (var i=0; i<jList.length; i++) {
        var point = [jList[i]["Latitude"],jList[i]["Longitude"]]
        var p = L.marker(point).addTo(mymap)
        p.bindPopup("<img src='static/images/gkn.jpg' width=30>");
        // Function to change the popup of a marker on the map. 
        // To do, need to figure out how to do this with coordinates instead 
        // of individually changing these.
        point_markers.push(p);
        p.on("click", reBind);
    }
    reBind();
    
    


    // Timer action
    var i=0;
    // setTimeout('present('+i+', ['+point_markers+'], '+jList+')', 1);
    // setTimeout('present(i,point_markers,jList)', 1);
    setTimeout(function(){present(mymap, i,point_markers,jList,reBind)},10000)
}

function present(mymap, i, point_markers, jList,reBind) {
    //Presentation function.
    if (i >= point_markers.length) {
        // i=0;
        location.reload();
    }
    var point = [jList[i]["Latitude"], jList[i]["Longitude"]];
    var point_marker = point_markers[i];
    mymap.setView(point, 6);
    reBind();
    point_marker.openPopup();
    i++;
    // present(i,point_markers,jList)
    var arg = "";
    console.log(arg);
    setTimeout(function(){present(mymap, i,point_markers,jList,reBind)},15000);
};