window.colors = ['blue', 'red', 'green', 'teal', 'pink', 'orange'];

function showtag(tag){

}

$(document).ready(function(){
	var color = window.colors[Math.floor(Math.random()*window.colors.length)];
	$('.accent').addClass(color);

	// $('.post li img').on('click', function(event){
	// 	console.log(event);
	// 	var li = $(event.currentTarget).parent();
	// 	li.parent().append(li);
	// 	li.fade('out');
	// });

	$(window).on('scroll', function(){
		var y = window.pageYOffset || document.documentElement.scrollTop;
		var h = $(window).height();
		var bh = $('.bottom').first().outerHeight();
		if (y > h - bh){
			$('.bottom').addClass('fixed');
		} else {
			$('.bottom').removeClass('fixed');
		}
	});

	$('.tags a').on('click', function(e){
		var a = $(e.target);
		console.log(a)
		var h = $(window).height();
		var bh = $('.bottom').first().outerHeight();
		$(window).scrollTop(h - bh);
		if (! a.hasClass('active')){
			$('.tags a.active').removeClass('active');
			a.addClass('active');
			var tag = a.attr('href').split('#')[1];
			console.log(tag);
			$('.posts li').hide()
			$('meta[name="tags"][content='+tag+']').parent().show();
		} else {
			a.removeClass('active');
			$('.posts li').show()
		}
	})
})