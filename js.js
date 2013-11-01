function showtag(tag, pushState){
	var a = $('.tags a.tag-'+tag);
	if(a.length){
		$('.tags a.active').removeClass('active');
		a.addClass('active');
		$('.posts li').hide()
		$('meta[name="tags"][content='+tag+']').parent().show();

		var h = $(window).height();
		var bh = $('.bottom').first().outerHeight();
		$(document.body).animate({scrollTop: (h - bh)}, 300);
		// window.location.hash = tag; // for older browsers, leaves a # behind

		document.title = 'noio: #' + tag;

		if (pushState){
			history.pushState(null, '', '#' + tag); // nice and clean
		}
	} else {
		history.replaceState(null, '', window.location.pathname); // nice and clean
	}
}

function notag(pushState){
	$('.tags a.active').removeClass('active');
	$('.posts li').show()
	// window.location.hash = ''; // for older browsers, leaves a # behind
	if (pushState){
	    history.pushState(null, '', window.location.pathname); // nice and clean
	}
}

function tagfromhash(){
	if (window.location.hash){
		tag = window.location.hash.substring(1);
		showtag(tag);
	} else {
		notag();
	}
}


$(document).ready(function(){

	// SET RANDOM COLOR FOR ACCENTS
	// window.colors = ['blue', 'red'];  //, 'green', 'teal', 'pink', 'orange'];
	window.colors = ['turquoise', 'emerald', 'peterriver', 'amethyst', 'wetasphalt', 'sunflower', 'carrot', 'alizarin'];

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
	tagfromhash();
	$('.tags a').on('click', function(e){
		var a = $(e.target);
		if (! a.hasClass('active')){
			var tag = a.attr('href').split('#')[1];
			showtag(tag, true);
		} else {
			notag(true)
		}
	    return false;
	});
	window.onpopstate = function(e){
		tagfromhash();
	}

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

	// SHOW DATE LINE DIVIDERS
	
})