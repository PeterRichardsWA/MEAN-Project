$(document).ready(function() {

	$('#shopcart').click(function(event) {
		event.preventDefault();
		$('#cartbox').slideToggle(100);
	});

	$(document).on('focusOut','#shopcart',function() {
		event.preventDefault();
		$('#cartbox').slideUp(50);
	});

	$('.rounded-list li').click(function() {
		var catid = $(this).attr('tag');
		console.log('/main/showcat/'+catid);
		$.getJSON(
			'/main/showcat/'+catid,
			function(output) {
				// console.log( output );
				console.log(output);
				var myContent;
				$('#products').empty(); // clear content already in products div
				if(output.error) {
					$('#products').append("<div class='noprods'>"+output.error+"</dv>");
				} else {
					$.each(output, function(key,value) {
						if(!value.PhotoPath) {
							var temp = 'na.png';
						}else{
							var temp = value.PhotoPath;
						}
						console.log(value);
						myContent = '<div id="'+ value.pid+'" class="item">';
						myContent = myContent + '<span class="bigbold">'+ value.product  + '</span>';
						myContent = myContent + '<img src="/assets/images/' + temp + '" border=0 width=100 height=100>';
						myContent = myContent + '<br>$' + value.price + ': (#'+ value.inventory +')';
						myContent = myContent + '<div class=""><form id="" action="main/addcart/'+value.pid+'"><input type="text" value="1" size=3 maxlength=3 class="iteminp"><input class="itemsub" type="submit" value="ADD"></form></div>'
						myContent = myContent + '</div>';
						$('#products').append(myContent);
						// console.log(myContent);
					});
				}
			}
		);
		return false;
	});
});