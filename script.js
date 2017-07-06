var results = $(".results-cnt");
var btn = $(".btn");
var textfield = $("#query");
var select = $('#options')
var resultsFor=$(".result");
var moreResults=$(".btn-results");
var nextUrl;
var infiniteScroll = false;
var checkingScroll;

$(document).ready(function() {
    btn.click(search);
    if (location.search.indexOf('scroll=infinite') > -1) {
        infiniteScroll = true;
    }

    function searchAlbums(url) {
        var moreClicked = false;
        if(!url){
            url = "https://api.spotify.com/v1/search?q=" + textfield.val() + '&type=' + select.val();
        } else {
            moreClicked = true;
        }

        $.ajax({
            url: url,
            success: function(response) {
                var resultsHtml="";
                response = response.artists || response.albums;
                response.items.forEach(function(val,i){
                    if (val.images[0]){ //check if images exit and the do that
                        resultsFor.show();
                        resultsFor.html('<p class="result"> Results for " ' + textfield.val() + ' "</p>');
                        resultsHtml += '<div class="spotify-cnt">';
                        resultsHtml += '<a href="'+ val.external_urls.spotify + '" target="_blank">';
                        resultsHtml += '<img class="imgs" src="'+ val.images[0].url +'">';
                        resultsHtml += '</a>';
                        resultsHtml += '<a href="'+ val.external_urls.spotify + '" target="_blank">';
                        resultsHtml += '<p class="name">'+ val.name+ '</p>';
                        resultsHtml += '</a>';
                        resultsHtml += '</div>';
                    }
                })
                //btn
                if(moreClicked){
                    results.append(resultsHtml);
                } else {
                    results.html(resultsHtml);
                }
                nextUrl = response.next;
                //infinite scroll

                if (!infiniteScroll) {
                    if(response.next){
                        moreResults.show();
                    } else {
                        moreResults.hide();
                    }

                } else {
                    checkScroll();
                }
            }
        });
    }
    moreResults.on('click',function(){
        searchAlbums(nextUrl);
    })
    function checkScroll() {
//type ?infinite=scroll next to the url to prove it
        if (nextUrl && !checkingScroll) {
            checkingScroll = true;
            setTimeout(function() {
                checkingScroll=false;
                if ($(document).scrollTop() + $(window).height() == $(document).height()) {
                    searchAlbums(nextUrl);

                } else {
                    checkScroll();
                }
            }, 500);
        }
    }

    function search(e) {
        searchAlbums();

    }
});
