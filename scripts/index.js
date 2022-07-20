$(document).ready(function() {

	// search
	$("#searchRecipe").on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$(".cards .card").filter(function() {
		  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	});

	// filter 
	$('.condition').on('click', '.stat', function() {
		$(this).toggleClass('active');
		var $stats = $('.condition .active')
		var $items = $('.cards .card');

		/* filter items that contain specific substring */
		$items.show();
		if ($stats.length == 0)
		return;
	
		$stats.each(function() {
		var $stat = $(this);
		$items.filter(function() {
			return $(this).data($stat.data('type')).indexOf($stat.data('id')) < 0;
		}).hide();
		}); 
	});

	// cards
	var zindex = 10;
  
  	$("div.cards").on("click", "div.card", function(e){
		e.preventDefault();

		var isShowing = false;

		if ($(this).hasClass("show")) {
			isShowing = true
		}

		if ($("div.cards").hasClass("showing")) {
			// a card is already in view
			$("div.card.show").removeClass("show");
			if (isShowing) {
				// this card was showing - reset the grid
				$("div.cards").removeClass("showing");
			} 
			else {
				// this card isn't showing - get in with it
				$(this).css({zIndex: zindex}).addClass("show");
			}

			zindex++;

		} 
		else {
			// no cards in view
			$("div.cards").addClass("showing");
			$(this).css({zIndex:zindex}).addClass("show");

			zindex++;

		}
  	});
});