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
  
  	$("div.cards").on("click", ".toggle-info", function(e){
		e.preventDefault();
		var isShowing = false;

		if ($(this).parent().parent().hasClass("show")) {
			isShowing = true
		}

		if ($("div.cards").hasClass("showing")) {
			// a card is already in view
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
});