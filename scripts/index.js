$(document).ready(function() {

	// scroll to top
	$("#toTop").click(function () {
		$("html, body").animate({scrollTop: 0}, 800);
	 });

	// only show scroll to top button if scrolled
	$(window).scroll(function() {
		if ($(this).scrollTop()) {
			$('#toTop').fadeIn();
		} else {
			$('#toTop').fadeOut();
		}
	});

	// searchbar
	$(".search-input").on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$(".cards .card").filter(function() {
		  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	});

	// toggle category filter on click
	$('.categoryToggler').click(function(e){

		// hide other toggles
		$('.durationToggler-wrapper').removeClass('show');

		var x = $(this).parent();
		if (x.hasClass('show')){
			x.removeClass('show');
		}
		else{
			x.addClass('show')
		}
	})

	// toggle duration filter on click
	$('.durationToggler').click(function(e){

		// hide other toggles
		$('.categoryToggler-wrapper').removeClass('show');

		var x = $(this).parent();
		if (x.hasClass('show')){
			x.removeClass('show');
		}
		else{
			x.addClass('show')
		}
	})
	
	// filtering categories : filter items that contain specific substring
	$('.condition').on('click', '.category', function() {
		$(this).toggleClass('active');

		// remove other toggles
		$('.bookmarkToggler').removeClass('active');
		$('.duration').removeClass('active');
		$('.durationToggler-wrapper').removeClass('show');

		var $categories = $('#categories .active')
		var $items = $('.cards .card');

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

	// filtering durations : filter items that are below specific duration
	$('.condition').on('click', '.duration', function() {
		$('.duration').removeClass('active');

		// remove other toggles
		$('.bookmarkToggler').removeClass('active');
		$('.category').removeClass('active');
		$('.categoryToggler-wrapper').removeClass('show');

		$(this).toggleClass('active');
		var $durations = $('#duration .active')
		var $items = $('.cards .card');

		$items.show();
		if ($durations.length == 0)
		return;
	
		$durations.each(function() {
			var $stat = $(this);
			$items.filter(function() {
				return $(this).data($stat.data('type')) > ($stat.data('id'));
			}).hide();
		}); 
	});

	// filtering bookmarks : show only bookmarked items
	$('.bookmarkToggler').click(function(e){
		$(this).toggleClass('active');

		var $items = $('.cards .card');

		$items.show();
		if (!$(this).hasClass('active'))
		return;

		// hide other filters and remove toggles
		$('.category').removeClass('active');
		$('.duration').removeClass('active');
		$('.categoryToggler-wrapper').removeClass('show');
		$('.durationToggler-wrapper').removeClass('show');

		// if bookmark is checked, show only items in bookmark
		var bookmarks = [];
		bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
		
		// if there are no bookmarks
		if (bookmarks.length == 0){
			alert("お気に入りが登録されていません")
			$(this).removeClass('active');
			return;
		}

		for (var i = 0, len = bookmarks.length; i < len; i++) {
			$items.filter(function() {
				return bookmarks.indexOf($(this).data('id')) == -1
			}).hide();
		}

	});

	// card flipping animation

	var zindex = 10;
  
  	$("div.cards").on("click", ".toggle-info", function(e){
		e.preventDefault();
		var isShowing = false;

		if ($(this).parent().parent().hasClass("show")) {
			isShowing = true
		}

		// if a card is already in view
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

	// bookmark (stores id of bookmarked recipe in array and store in JSON format)
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