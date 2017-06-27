	$(document).ready(function(){


var updatedTag;

if(Array.isArray(JSON.parse(localStorage.getItem("tags")))){
	console.log(updateTag)
	console.log("from localStorage")
	updatedTag = JSON.parse(localStorage.getItem("tags"))
}else{
	console.log("from HTML")
	console.log(updatedTag)
	updatedTag = ["soccer","sock","watermelon","chocolate","italian food","spongebob"];
	localStorage.setItem("tags",JSON.stringify(updatedTag))
}

var initialTag = true;
var topic;
var limit;
var rating;
var response;

if(initialTag == true){
	 updateTag();
}


$("#submit").click(function(event){
    event.preventDefault();


    apiKey = "dc6zaTOxFJmzC";
	queryURL = "https://api.giphy.com/v1/gifs/search";
	topic = $("#searchTag").val().trim();
	limit = $("#limit option:selected").text();
	rating = $("#rating option:selected").text();

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
		localStorage.setItem("tags",JSON.stringify(updatedTag))
		console.log(updatedTag)
		updateTag();
		}
		
		updateGIF(response)
	})
})

$("#clear").click(function(){
       //clear form and previous search
        $("#searchTag").empty();
        localStorage.clear();

        $("#results").empty();
        
        //empty search box
        $("#submit").empty();
        
        //reset records to retrieve to 10
        
        //reset tags
        $("#tagPanel").empty();
        
});


	$('body').on('click', '.gif', function (){
		if($(this).attr("data-state") === "still"){
			var ratingState = $(this).attr("data-num")
			console.log()
			$("#"+ratingState).css('display',"none")
			$(this).attr("src",$(this).attr("data-animate"))
			$(this).attr("data-state",'animate')
			console.log($(this).attr("data-animate"))	
		}else{
			var ratingState = $(this).attr("data-num")
			$("#"+ratingState).css('display',"block")
			$(this).attr("src",$(this).attr("data-still"))
			$(this).attr("data-State","still"); 
		}
	});

	$("body").on('click','.tag', function(event){
		event.preventDefault();


    apiKey = "dc6zaTOxFJmzC";
	queryURL = "https://api.giphy.com/v1/gifs/";
	if ($(this).attr("tag") === "random"){
		queryURL += "random"
	}else if($(this).attr("tag") === "trending"){
		queryURL += "trending"
	}else{
		queryURL += "search"
	}

	topic = $(this).attr("tag");
	limit = $("#limit option:selected").text()
	rating = $("#rating option:selected").text();

	if($(this).attr("tag") === "trending"){
		queryURL += "?" + $.param({
		    "api_key": apiKey,
	        'limit': limit,
	        'rating': rating,
		})
	}else if ($(this).attr("tag") === "random"){
		queryURL += "?" + $.param({
		    "api_key": apiKey,
	        'rating': rating,
		})
	}else{
		queryURL += "?" + $.param({
	    "api_key": apiKey,
        "q": topic,
        'limit': limit,
        'rating': rating,
		})
	}
	console.log(queryURL)
    $.ajax({
    url: queryURL,
    method: "GET"
	}).done(function(response){

		updateGIF(response)

		})
	})

function updateTag(){
	$("#tagPanel").empty();
	updatedTag = JSON.parse(localStorage.getItem("tags"));
	for(i = 0; i < updatedTag.length; i++){
		var btn = $("<button>");
		btn.attr("tag",updatedTag[i]);
		btn.addClass(" tag btn btn-primary");
		btn.text(updatedTag[i]);
		$("#tagPanel").append(btn)
		initialTag = false;

	}
}

function updateGIF(response){
	topic = topic.replace(/\s/g,'');
	var panel = $("<div>");
	panel.addClass("panel panel-default");
	panel.attr("name-data",topic)

	var panelHead = $("<div>");
	panelHead.addClass("panel-heading")
	panel.append(panelHead);
	console.log(response)
	var panelBody = $("<div>");
	panelBody.addClass("panel-body");
	if (topic === "random"){
		panelHead.html("<b>Tag: </b>" + topic)
		var imgContainer = $("<div>");
		imgContainer.attr("data-name",topic);
		imgContainer.addClass("imgContainer");
		imgContainer.css("width","100%");
		// var ratingText = $("<div>");
		// ratingText.addClass("ratingText");
		// ratingText.attr("id","randomGIF")
		// ratingText.text(response.data.rating.toUpperCase())
		var imgEl = $("<img>");
		imgEl.attr("data-num","randomGIF")
		imgEl.addClass("gif img-thumbnail")
		imgEl.attr("data-state","still")
		imgEl.attr("data-still",response.data.fixed_height_small_still_url)
		imgEl.attr("data-animate",response.data.fixed_height_small_url)
		imgEl.attr("src",response.data.fixed_width_downsampled_url)
		imgEl.addClass("randomGIF")
		console.log(response.data.fixed_height_small_still_url)
		imgContainer.append(imgEl)
		// imgContainer.append(ratingText)
		panelBody.append(imgContainer)
	}else{
		for(i = 0; i < response.data.length; i++){
		panelHead.html("<b>Tag: </b>" + topic+ "&nbsp; &nbsp; &nbsp;" + "<b>Limit: </b>" + limit + "&nbsp; &nbsp; &nbsp;" + "<b>Rating: </b>" + rating);
			var imgContainer = $("<div>");
			imgContainer.attr("data-name",topic);
			imgContainer.addClass("imgContainer");
			var ratingText = $("<div>");
			ratingText.addClass("ratingText");
			ratingText.attr("id",topic+"-item-"+i)
			ratingText.text(response.data[i].rating.toUpperCase())
			var imgEl = $("<img>");
			imgEl.attr("data-num",topic+"-item-"+i)
			imgEl.addClass("gif img-thumbnail")
			imgEl.attr("data-state","still")
			imgEl.attr("data-still",response.data[i].images.fixed_width_still.url)
			imgEl.attr("data-animate",response.data[i].images.fixed_width.url)
			imgEl.attr("src",response.data[i].images.fixed_width_still.url)
			imgContainer.append(imgEl)
			imgContainer.append(ratingText)
			panelBody.append(imgContainer)
		}
	}
	panel.append(panelBody);
	panel.hide();
	$("#results").prepend(panel);
	$("#results").prepend("<hr>");
	panel.fadeIn(1000)

}

});
