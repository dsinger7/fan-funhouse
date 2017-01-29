
$(".like-button").on("mousedown", function(){
	$(this).css({"background-color":"#1f1f1f","color":"#f2f2f2","border":"solid 1px #f2f2f2","box-shadow":"0 0 0 0 rgba(0,0,0,0.2)"});
	$(this).children(".heart").css("color","#cc0000");

});

$(".like-button").on("mouseup", function(){
	$(this).css({"background-color":"#f2f2f2","color":"#474747","border":"initial","box-shadow":"0 1px 1px 0 rgba(0,0,0,0.2)"});
	$(this).children(".heart").css("color","#cc0000");
	$(this).children(".like-count").html("51");
});


//SEARCH

/*var searchVal = "";

$("#search").on("input",function(){
searchVal = document.getElementById('search').value;
console.log(searchVal);
});*/

