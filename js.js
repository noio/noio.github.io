window.colors = ['blue', 'red', 'green', 'teal', 'pink', 'orange'];

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
		var h = $(window).height();
		var y = window.pageYOffset || document.documentElement.scrollTop;
		var bh = $('.bottom').first().height();
		if (y > h - bh){
			$('.bottom').addClass('fixed');
		} else {
			$('.bottom').removeClass('fixed');
		}
	});
})