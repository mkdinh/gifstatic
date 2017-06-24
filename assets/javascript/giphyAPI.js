	$(document).ready(function(){


var updatedTag = ["soccer","sock","watermelon","chocolate","italian food","spongebob"];
var initialTag = true;

function updateTag(){
	$("#tagPanel").empty();
	for(i = 0; i < updatedTag.length; i++){
		var btn = $("<button>");
		btn.attr("tag",updatedTag[i]);
		btn.addClass(" tag btn btn-primary");
		btn.text(updatedTag[i]);
		$("#tagPanel").append(btn)
		initialTag = false;
	}
}

if(initialTag == true){
	 updateTag();
}


$("#submit").click(function(event){
    event.preventDefault();


    var apiKey = "dc6zaTOxFJmzC";
	var queryURL = "https://api.giphy.com/v1/gifs/search";
	var topic = $("#searchTag").val().trim();
	var limit = $("#limit option:selected").text();
	var rating = $("#rating option:selected").text();

    if(topic === ""){return}

	queryURL += "?" + $.param({
		    "api_key": apiKey,
	        "q": topic,
	        'limit': limit,
	        'rating': rating,
	})

    $.ajax({
    url: queryURL,
    method: "GET"
	}).done(function(response){
		if(updatedTag.indexOf(topic) === -1){
		updatedTag.push(topic);
		updateTag();
		}
		console.log(response)
		var panel = $("<div>");
		panel.addClass("panel panel-default");
		panel.attr("name-data",topic)

		var panelHead = $("<div>");
		panelHead.addClass("panel-heading")
		panelHead.html("<b>Topic: </b>" + topic+ "&nbsp; &nbsp; &nbsp;" + "<b>Limit: </b>" + limit + "&nbsp; &nbsp; &nbsp;" + "<b>Rating: </b>" + rating);
		panel.append(panelHead);

		var panelBody = $("<div>");
		panelBody.addClass("panel-body");
		for(i = 0; i < response.data.length; i++){
			var imgEl = $("<img>");
			imgEl.addClass("gif img-thumbnail")
			imgEl.attr("data-state","still")
			imgEl.attr("data-still",response.data[i].images.fixed_width_still.url)
			imgEl.attr("data-animate",response.data[i].images.fixed_width.url)
			imgEl.attr("src",response.data[i].images.fixed_width_still.url)
			panelBody.append(imgEl)
		}

		panel.append(panelBody);
		panel.hide();
		$("#results").prepend(panel)
		panel.fadeIn(1000)
	})
})

$("#clear").click(function(){
       //clear form and previous search
        $("#searchTag").empty();
        //clear previous search
        $("#results").empty();
        
        //empty search box
        $("#submit").empty();
        
        //reset records to retrieve to 10
        
        //reset tags
        $("#tagPanel").empty();
        
});


	$('body').on('click', '.gif', function (){
		if($(this).attr("data-state") === "still"){
			console.log($(this).attr("data-state"))
			$(this).attr("src",$(this).attr("data-animate"))
			$(this).attr("data-state",'animate')
			console.log($(this).attr("data-animate"))	
		}else{
			$(this).attr("src",$(this).attr("data-still"))
			$(this).attr("data-State","still"); 
		}
	});

	$("body").on('click','.tag', function(event){
		event.preventDefault();


    var apiKey = "dc6zaTOxFJmzC";
	var queryURL = "https://api.giphy.com/v1/gifs/search";
	var topic = $(this).attr("tag");
	var limit = $("#limit option:selected").text()
	var rating = $("#rating option:selected").text();

	console.log(topic)
	queryURL += "?" + $.param({
		    "api_key": apiKey,
	        "q": topic,
	        'limit': limit,
	        'rating': rating,
	})

    $.ajax({
    url: queryURL,
    method: "GET"
	}).done(function(response){
		console.log(this)
		var panel = $("<div>");
		panel.addClass("panel panel-default");
		panel.attr("name-data",topic)

		var panelHead = $("<div>");
		panelHead.addClass("panel-heading")
		panelHead.html("<b>Tag: </b>" + topic+ "&nbsp; &nbsp; &nbsp;" + "<b>Limit: </b>" + limit + "&nbsp; &nbsp; &nbsp;" + "<b>Rating: </b>" + rating);
		panel.append(panelHead);

		var panelBody = $("<div>");
		panelBody.addClass("panel-body");
		for(i = 0; i < response.data.length; i++){
			var imgEl = $("<img>");
			imgEl.addClass("gif img-thumbnail")
			imgEl.attr("data-state","still")
			imgEl.attr("data-still",response.data[i].images.fixed_width_still.url)
			imgEl.attr("data-animate",response.data[i].images.fixed_width.url)
			imgEl.attr("src",response.data[i].images.fixed_width_still.url)
			panelBody.append(imgEl)
		}

		panel.append(panelBody);
		panel.hide();
		$("#results").prepend(panel)
		panel.fadeIn(1000)

		})
	})

})

