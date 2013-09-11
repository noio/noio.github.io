function showtag(tag){
	var a = $('.tags a.tag-'+tag);
	$('.tags a.active').removeClass('active');
	a.addClass('active');
	$('.posts li').hide()
	$('meta[name="tags"][content='+tag+']').parent().show();

	var h = $(window).height();
	var bh = $('.bottom').first().outerHeight();
	$(window).scrollTop(h - bh);
}

function notag(){
	$('.tags a.active').removeClass('active');
	$('.posts li').show()
	// window.location.hash = ''; // for older browsers, leaves a # behind
    // history.pushState('', document.title, window.location.pathname); // nice and clean
}


$(document).ready(function(){

	// SET RANDOM COLOR FOR ACCENTS
	window.colors = ['blue', 'red'];  //, 'green', 'teal', 'pink', 'orange'];
	var color = window.colors[Math.floor(Math.random()*window.colors.length)];
	$('.accent').addClass(color);


	// FIX HEADER ON SCROLL
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

	// SELECT POSTS ON TAG CLICK
	if (window.location.hash){
		tag = window.location.hash.substring(1);
		showtag(tag);
	}
	$('.tags a').on('click', function(e){
		var a = $(e.target);
		if (! a.hasClass('active')){
			var tag = a.attr('href').split('#')[1];
			showtag(tag);
		} else {
			notag()
		}
	    return false;
	});

	// INITIALIZE IMAGE GALLERIES
	$('.post ul:has(li:nth-child(2):has(img))').addClass('imlist');

	$('.imlist li img').on('click', function(event){
		var li = $(event.currentTarget).parent();
		var ul = li.parent();
		console.log(li);
		console.log(ul);
		var idx = li.index();
		console.log(idx);
		ul.append(ul.find(':first'));
		if (idx > 0){
			ul.prepend(li);
		}
		ul.find(':first').hide().fadeIn(200);
	});
})