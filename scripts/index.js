$(document).ready(function() {

	// search
	$(".search-input").on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$(".cards .card").filter(function() {
		  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	});

	// toggle category filter 
	$('.categoryToggler').click(function(e){
		var x = $(this).parent();
		if (x.hasClass('show')){
			x.removeClass('show');
		}
		else{
			x.addClass('show')
		}
	})

	// toggle duration filter 
	$('.durationToggler').click(function(e){
		var x = $(this).parent();
		if (x.hasClass('show')){
			x.removeClass('show');
		}
		else{
			x.addClass('show')
		}
	})
	
	// filtering items
	$('.condition').on('click', '.stat', function() {
		$(this).toggleClass('active');
		var $categories = $('#categories .active')
		var $items = $('.cards .card');

		// 1. filtering categories : filter items that contain specific substring
		$items.show();
		if ($categories.length == 0)
		return;
	
		$categories.each(function() {
		var $stat = $(this);
		$items.filter(function() {
			return $(this).data($stat.data('type')).indexOf($stat.data('id')) < 0;
		}).hide();
		}); 
	});

	// cards
	var zindex = 10;
  
  	$("div.cards").on("click", ".toggle-info", function(e){
		e.preventDefault();
		var isShowing = false;

		if ($(this).parent().parent().hasClass("show")) {
			isShowing = true
		}

		// a card is already in view
		if ($("div.cards").hasClass("showing")) {
			$("div.card.show").removeClass("show");
			if (isShowing) {
				// hide card
				$("div.cards").removeClass("showing");
			} 
			else {
				// show card
				$(this).parent().parent().css({zIndex: zindex}).addClass("show");
			}

			zindex++;
		} 
		else {
			// no cards in view
			$("div.cards").addClass("showing");
			$(this).parent().parent().css({zIndex:zindex}).addClass("show");

			zindex++;
		}
  	});

	// bookmark (stores id to array in JSON)
	$("div.cards").on("click", ".bookmarker label", function(e){
		const id = parseInt($(this).attr('id'));

		var bookmarks = []
		bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

		if(bookmarks.indexOf(id) == -1){
			bookmarks.push(id);
		}
		else{
			bookmarks.splice(bookmarks.indexOf(id), 1);
		}
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
		console.log(localStorage.getItem('bookmarks'));
	});
});