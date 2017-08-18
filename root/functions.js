/*
OSSM STUDENT MAP v1.0
FIRST IMPLEMENTED BY ZACH ARANI, CLASS OF 2017 (contact:cloud12817@gmail.com, myrrhman@ou.edu, github:ZachArani)
LAST COMMIT BY ZACH ARANI, CLASS OF 2017

ORIGINAL AUTHOR'S COMMENT:
Greetings! 
I was (quasi) asked by Dr. Samadzadeh to throw this together back in the fall of 2016 for the school since our analogue map had started to show it's age. After a few months, I managed to craft this project in-between classes. 
This is the heart of the new Digital map. This file, the Javascript functions file, contains more or less everything that you see graphically on the map. All of the 'smoke and mirrors' occur with the PHP files in combination with the SQL Database
So, although it may not be too efficient or pratical from the get-go, it is a start. Now it's up to you (YES, YOU) to make this thing as awesome as possible and pass it down to the future generations of OSSM.

Get to work,
Zachary Arani

P.S.
Please also note that this was originally intended for Firefox and Firefox alone. It's success on other browsers is NOT guarenteed! 
*/
var type = "notname"; //Filler name until later populated 
var query = ""; var clickedOnHeaderCounter = 0; //Lazy way to tell when we need to sort from A-Z or Z-A. Counts how many times the header options have been clicked.
var totalStudents = 0;
 $.ajax({ //Uses AJAX to POST a request to a php file on our local server. It returns the amount of OSSM students found. 
            type: "POST",
            data: { data:''},
            url: "getStudentCount.php",
            mimeType: 'text/html',
            dataType: "json",
            success: function (data) {
				totalStudents = data[0]["Count"];
				console.log("Total student Count is: " + totalStudents);
			},
            error: function (data) {
                console.log("Error, something went wrong with the php script 'getStudentCount'");
            }
        });
$(document).ready(function () {
	console.log("///Starting Map Generation///");
	console.log(totalStudents);
	$( ".county" ).each(function( index ) { //For each County
		var color = assignColor(getStudentCount($(this).attr("id"))/totalStudents); //Figure out what color we should attach to the county. 
		//console.log(color); Optional debug statements
		//console.log(getStudentCount($(this).attr("id"))/totalStudents);
		//console.log(assignColor(getStudentCount($(this).attr("id"))/totalStudents));
		$(this).css("fill", color); //Put that color in the county 
	});
    var table = '<div id="studentTable" style="height:400px;overflow:auto;"><table class="pure-table"><thead><tr><th class="tableHead" id="Class">Class</th><th class="tableHead" id="Name">Name</th><th class="tableHead" id="School">School</th><th class="tableHead" id="City">City</th><th class="tableHead id="County">County</th></tr></thead><tbody>'; //The basic headers of a table
    var allElements = $("#layer1").find('rect, path'); //Find how many counties there are
    for (var i = 0; i < allElements.length; i++) { //Iterate through all counties
        var element = allElements[i];
        $(element).attr("class", "county"); //Attach the class property and assign it the value 'County'

    };
    $(".county").hover( //When the mouse hovers over the county
  function () {
      $(this).css("fill", LightenDarkenColor(colorToHex($(this).css("fill")), -15)); //Darken colors
  }, function () { //When you remove mouse
     $(this).css("fill", LightenDarkenColor(colorToHex($(this).css("fill")), 15)); //Lighten colors
  }
);
    var windowY = $(window).height();
    var windowX = $(window).width();
    $(".county").click(function () { //When you click on a county
        var county = $(this).attr('id'); //Get county name
        console.log(county);
        query = county;
        type = "county";
        $.ajax({ //This AJAX function POSTs to the queryDatabase.php file on the local sever. Sends it the name of the county and asks for all the students from that county in return.
            type: "POST",
            data: { data: county },
            url: "queryDatabase.php",
            mimeType: 'text/html',
            dataType: "json",
            success: function (data) { //Now that the PHP file has sent back the data, lets add it to the table and display it. 
                console.log(data);
                if (data.length > 1) {
                    table = '<div class="returnal" style="font-size: 80%; padding-bottom: 40px;"><button id="countyTop" class="button-xsmall pure-button" style="display:inline; float:left">Return to Top</button><button id="countyBottom" class="button-xsmall pure-button" style="float:right">Jump to Bottom</button></div><div id="studentTable" style="height:400px;overflow:auto;"><table class="pure-table"><thead><tr><th class="tableHead" id="Class">Class</th><th class="tableHead" id="Name">Name</th><th class="tableHead" id="School">School</th><th class="tableHead" id="City">City</th><th class="tableHead id="County">County</th></tr></thead><tbody>';
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        if (i % 2 == 1)
                            table += '<tr class="pure-table-odd">';
                        else
                            table += '<tr>';
                        table += ('<td>' + obj['Class'] + '</td> <td> ' + obj['Name'] + '</td> <td>' + obj['School'] + '</td> <td>' + obj['City'] + '</td> <td>' + county + '</td> </tr>');
                    }
                    table += '</tbody></table></div>'
                    swal({ //Sends out a SweetAlert that shows the table
                        title: (data.length + " Students from " + county + " County"),
                        text: table,
                        width: null,
                        imageUrl: "blue_ossm_logo.jpeg",
                        confirmButtonText: "Return",
                        html: table
                    });
					
                    $("#studentTable").scrollTop(0); //Scrolls to the top of the table (sometimes it would start at random places)
					$("#countyTop").on("click", function(){ //Click on Go To Top Button, go to top
						$("#studentTable").scrollTop(0);
					});
					$("#countyBottom").on("click", function(){ //And vice versa
						$("#studentTable").scrollTop($("#studentTable")[0].scrollHeight);
					});
					console.log($(".pure-table").height());
					if($(".pure-table").height() < 400){ //If the table's height is really small, increase to avoid graphical glitches
						$("#studentTable").height($(".pure-table").height()+60);
						$("#studentTable").height($(".pure-table").height()+70);
					}
                }
				else if(data.length == 1){ //If you have one student, display it slightly differently 
					table = '<div class="returnal" style="font-size: 80%; padding-bottom: 40px;"><button id="countyTop" class="button-xsmall pure-button" style="display:inline; float:left">Return to Top</button><button id="countyBottom" class="button-xsmall pure-button" style="float:right">Jump to Bottom</button></div><div id="studentTable" style="height:400px;overflow:auto;"><table class="pure-table"><thead><tr><th class="tableHead" id="Class">Class</th><th class="tableHead" id="Name">Name</th><th class="tableHead" id="School">School</th><th class="tableHead" id="City">City</th><th class="tableHead id="County">County</th></tr></thead><tbody>';
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        if (i % 2 == 1)
                            table += '<tr class="pure-table-odd">';
                        else
                            table += '<tr>';
                        table += ('<td>' + obj['Class'] + '</td> <td> ' + obj['Name'] + '</td> <td>' + obj['School'] + '</td> <td>' + obj['City'] + '</td> <td>' + county + '</td> </tr>');
                    }
                    table += '</tbody></table></div>'
                    swal({
                        title: (data.length + " Student from " + county + " County"),
                        text: table,
                        width: null,
                        imageUrl: "blue_ossm_logo.jpeg",
                        confirmButtonText: "Return",
                        html: table
                    });
					
                    $("#studentTable").scrollTop(0);
					$("#countyTop").on("click", function(){
						$("#studentTable").scrollTop(0);
					});
					$("#countyBottom").on("click", function(){
						$("#studentTable").scrollTop($("#studentTable")[0].scrollHeight);
					});
					if($(".pure-table").height() < 400){
						$("#studentTable").height($(".pure-table").height()+11);
						$("#studentTable").height($(".pure-table").height()+11);
					}
				}
                else { //No students? Tell them
                     swal({
                        title: ("0 Students Found"),
                        text: "There are currently no students who have graduated from this county",
                        width: null,
                        imageUrl: "blue_ossm_logo.jpeg",
                        confirmButtonText: "Return",
                    });
                }
            },
            error: function(data){ //On error, dump to DevConsole
            console.log(data);
        }
        });
		if($(".pure-table").height() < 400){ //Helps avoid graphical hiccups when the table is too small
						$("#studentTable").height($(".pure-table").height()+11);
						$("#studentTable").height($(".pure-table").height()+11);
					}
        $("#studentTable").scrollTop(0); //Scroll to top of table because of graphical glitches
		
    });

    $("#query").change(function(){ //For when you change the option next to the search bar. Shows it in the dropdown
        var query = $("#query").val();
        $("#inputter").attr("placeholder", query);
    });
    $("#searchQuery").submit(function (event) { //For when you decide to search for something instead of clicking on map
        event.preventDefault();
       type = $("#query").val();
       query = $("#inputter").val();
        $.ajax({ //Sends to an alternative version of queryDatabase called queryOther. Sends what you're searching for and what type of search it is.
            type: "POST",
            data: { searchType: type, data: query },
            url: "queryOther.php",
            mimeType: 'text/html',
            dataType: "json",
            success: function (data) { //Returns data, so lets build a table the same way
                if (data.length > 1) {
                    console.log(data);
                    table = '<div class="returnal" style="font-size: 80%; padding-bottom: 40px;"><button id="searchTop" class="button-xsmall pure-button" style="display:inline; float:left">Return to Top</button><button id="searchBottom" class="button-xsmall pure-button" style="float:right">Jump to Bottom</button></div><div id="studentTable" style="height:400px;overflow:auto;"><table class="pure-table"><thead><tr><th class="tableHead" id="Class">Class</th><th class="tableHead" id="Name">Name</th><th class="tableHead" id="School">School</th><th class="tableHead" id="City">City</th><th class="tableHead id="County">County</th></tr></thead><tbody>';
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        if (i % 2 == 1)
                            table += '<tr class="pure-table-odd">';
                        else
                            table += '<tr>';
                        table += ('<td>' + obj['Class'] + '</td> <td> ' + obj['Name'] +'</td> <td>' + obj['School'] + '</td> <td>' + obj['City'] + '</td> <td>' + obj['County'] + '</td> </tr>');
                    }
                    table += '</tbody></table></div>'
                    swal({
                        title: (data.length + " Students Found"),
                        text: table,
                        width: null,
                        imageUrl: "blue_ossm_logo.jpeg",
                        confirmButtonText: "Return",
                        html: table
                    });
                    $("#studentTable").scrollTop(0);
					$("#searchTop").on("click", function(){
						$("#studentTable").scrollTop(0);
					});
					$("#searchBottom").on("click", function(){
						$("#studentTable").scrollTop($("#studentTable")[0].scrollHeight);
					});
					
					if($(".pure-table").height() < 400){
						$("#studentTable").height($(".pure-table").height()+11);
						$("#studentTable").height($(".pure-table").height()+11);
					}
                }
				else if(data.length == 1){
					console.log(data);
                    table = '<div class="returnal" style="font-size: 80%; padding-bottom: 40px;"><button id="searchTop" class="button-xsmall pure-button" style="display:inline; float:left">Return to Top</button><button id="searchBottom" class="button-xsmall pure-button" style="float:right">Jump to Bottom</button></div><div id="studentTable" style="height:400px;overflow:auto;"><table class="pure-table"><thead><tr><th class="tableHead" id="Class">Class</th><th class="tableHead" id="Name">Name</th><th class="tableHead" id="School">School</th><th class="tableHead" id="City">City</th><th class="tableHead id="County">County</th></tr></thead><tbody>';
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        if (i % 2 == 1)
                            table += '<tr class="pure-table-odd">';
                        else
                            table += '<tr>';
                        table += ('<td>' + obj['Class'] + '</td> <td> ' + obj['Name'] +'</td> <td>' + obj['School'] + '</td> <td>' + obj['City'] + '</td> <td>' + obj['County'] + '</td> </tr>');
                    }
                    table += '</tbody></table></div>'
                    swal({
                        title: (data.length + " Student Found"),
                        text: table,
                        width: null,
                        imageUrl: "blue_ossm_logo.jpeg",
                        confirmButtonText: "Return",
                        html: table
                    });
                    $("#studentTable").scrollTop(0);
					$("#searchTop").on("click", function(){
						$("#studentTable").scrollTop(0);
					});
					$("#searchBottom").on("click", function(){
						$("#studentTable").scrollTop($("#studentTable")[0].scrollHeight);
					});
					if($(".pure-table").height() < 400){
						$("#studentTable").height($(".pure-table").height()+11);
						$("#studentTable").height($(".pure-table").height()+11);
					}
				}
                else {
                    swal("No Results Found!", "Please try a different search.", "error");
                }
            },
            error: function (data) {
                swal("Error!", "There was an error contacting the database! Please contact an administrator for help.", "error");
            }
        });
        $("#studentTable").scrollTop(0);
    });
    $(document).on("click", ".tableHead", function () { //If you click on one of the table headers
    clickedOnHeaderCounter++;
    var tableHead = $(this).attr('id');
    if (clickedOnHeaderCounter % 2 == 1) { //This is lazy, but we decide which way to organize it by how many times they've clicked it. So if it's odd, we sort A-Z
        $.ajax({
            type: "POST",
            data: { headType: tableHead, searchType: type, data: query },
            url: "queryHeaderUpper.php",
            mimeType: 'text/html',
            dataType: "json",
            success: function (data) {
                table = '<table class="pure-table"><thead><tr><th class="tableHead" id="Class">Class</th><th class="tableHead" id="Name">Name</th><th class="tableHead" id="School">School</th><th class="tableHead" id="City">City</th><th class="tableHead id="County">County</th></tr></thead><tbody>'; for (var i = 0; i < data.length; i++) {
                    var obj = data[i];
                    if (i % 2 == 1)
                        table += '<tr class="pure-table-odd">';
                    else
                        table += '<tr>';
                    table += ('<td>' + obj['Class'] + '</td> <td> ' + obj['Name'] + '</td> <td>' + obj['School'] + '</td> <td>' + obj['City'] + '</td> <td>' + obj['County'] + '</td> </tr>');
                }
                table += '</tbody></table>'
                $("#studentTable").html(table);
				$(".returnal").html('<button id="topNew" class="button-xsmall pure-button" style="display:inline; float:left">Return to Top</button><button id="bottomNew" class="button-xsmall pure-button" style="float:right">Jump to Bottom</button>');
                $("#studentTable").scrollTop(0);
				console.log($("#studentTable").html());
				$("#topNew").on("click", function(){
					$("#studentTable").scrollTop(0);
				});
				$("#bottomNew").on("click", function(){
					$("#studentTable").scrollTop($("#studentTable")[0].scrollHeight);
				});
				if($(".pure-table").height() < 400){
						$("#studentTable").height($(".pure-table").height()+11);
						$("#studentTable").height($(".pure-table").height()+11);
					}
			},
            error: function (data) {
                console.log("Error, something went wrong with the php script queryHeader");
            }
        });
    }
    else if(clickedOnHeaderCounter % 2 == 0){ //If Even, Z-A
        $.ajax({
            type: "POST",
            data: { headType: tableHead, searchType: type, data: query },
            url: "queryHeaderDowner.php",
            mimeType: 'text/html',
            dataType: "json",
            success: function (data) {
                table = '<table class="pure-table"><thead><tr><th class="tableHead" id="Class">Class</th><th class="tableHead" id="Name">Name</th><th class="tableHead" id="School">School</th><th class="tableHead" id="City">City</th><th class="tableHead id="County">County</th></tr></thead><tbody>'; for (var i = 0; i < data.length; i++) {
                    var obj = data[i];
                    if (i % 2 == 1)
                        table += '<tr class="pure-table-odd">';
                    else
                        table += '<tr>';
                    table += ('<td>' + obj['Class'] + '</td> <td> ' + obj['Name'] + '</td> <td>' + obj['School'] + '</td> <td>' + obj['City'] + '</td> <td>' + obj['County'] + '</td> </tr>');
                }
                table += '</tbody></table>'
                $("#studentTable").html(table);
				$(".returnal").html('<button id="topNew" class="button-xsmall pure-button" style="display:inline; float:left">Return to Top</button><button id="bottomNew" class="button-xsmall pure-button" style="float:right">Jump to Bottom</button>');
                $("#studentTable").scrollTop(0);
				$("#topNew").on("click", function(){
					$("#studentTable").scrollTop(0);
				});
				$("#bottomNew").on("click", function(){
					$("#studentTable").scrollTop($("#studentTable")[0].scrollHeight);
				});
				if($(".pure-table").height() < 400){
						$("#studentTable").height($(".pure-table").height()+11);
						$("#studentTable").height($(".pure-table").height()+11);
					}
			},
            error: function (data) {
                console.log("Error, something went wrong with the php script queryHeader");
            }
        });
    }


	});
});

function getStudentCount(county){ //Gets how many students there are from a particular county
	var count = 0;
	$.ajax({
            type: "POST",
            data: { data:county},
			async: false,
            url: "getStudentCount.php",
            mimeType: 'text/html',
            dataType: "json",
            success: function (data) {
				count = data[0]["Count"];
				console.log("Total student Count from " + county + " is: " + count);
			},
            error: function (data) {
                console.log("Error, something went wrong with the php script 'getStudentCount'");
				return 0;
            }
        });
	return count;
}
function assignColor(ratio){ //Figures out what color to assign to a county. The ratios are quite generous to make the map look nice. If you have better ideas as how to calculate the color gradiance, feel free to implement it.
	if(ratio > .02)
		return "#1F2640";
	else if(ratio <= .02 && ratio > .01)
		return "#3E4C7F";
	else if(ratio <= .01 && ratio > .005)
		return "#5D73BF";
	else if(ratio <= .005 && ratio > .001)
		return "#6F89E5";
	else if(ratio < .001)
		return "#7B99FF";
	else
		return "#7B99FF";
}

function LightenDarkenColor(col, amt) { 
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}

function colorToHex(color) {
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    
    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);
    
    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + rgb.toString(16);
};