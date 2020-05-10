let reviews

jQuery(document).ready(function() {
    console.log("like_dislike_reviews_script loaded");

    reviews = document.querySelectorAll('.entry-content');

    for (var review = 0; review < reviews.length; review++){
        var btnHTML = jQuery(`<div class='btn_container' id='btn_container${review}'><div class='like_btn' id='like_btn${review}'><img id='empty_like${review}' src='/wp-content/plugins/like_dislike_reviews/images/empty_thumb_up.png'></div><div class='dislike_btn' id='dislike_btn${review}'><img id='empty_dislike${review}' src='/wp-content/plugins/like_dislike_reviews/images/empty_thumb_down.png'></div></div>`);
        reviews[review].append(btnHTML[0]);
        reviews[review].setAttribute('id', `entry_${review}`);
        console.log(`added btns to review no. ${review}`);

        //add event listeners to buttons
        jQuery(`#btn_container${review}`).find('.like_btn').one('click', incrementLiked);
        jQuery(`#btn_container${review}`).find('.dislike_btn').one('click', incrementDisliked);
    }    

    return reviews;
}
);

// user_id will come from Drew's SQL table
const user_id = 4;
// review_id MAY also come from Drew's SQL table

function incrementLiked (e) {
    // get the ID tag of the review 
    var review_id_tag = new String(jQuery(e.target).parent().prop("id"));

    // get the number of the review and add it to a new variable called review_id for use in POST
    var review_id = review_id_tag[review_id_tag.length - 1];

    console.log(review_id);

    // values to pass to POST request -- in SQL table, 1 = true, 0 = false
    var liked = 1;
    var disliked = 0;

    //ensure that a user can't like and dislike the same review
    jQuery( `#dislike_btn${review_id}` ).off( 'click', incrementDisliked);
    var uploadUrl = '/wp-content/plugins/like_dislike_reviews/upload_likes.php';
    var data = {postliked:liked, postdisliked:disliked, userid: user_id, reviewid: review_id};

    //callback to add a like to db
    jQuery.post(uploadUrl, data, function(uploadResponse) {
        jQuery(`#empty_like${review_id}`).remove();
        jQuery(`#like_btn${review_id}`).append(uploadResponse)
        console.log(uploadResponse);

        //callback to load total number of likes & dislikes from db
        var queryUrl = '/wp-content/plugins/like_dislike_reviews/query_likes.php';

        //POST data to query_likes.php so that review_id is accessible
        jQuery.post(queryUrl, data, function(response){
            var responseList = JSON.parse(response);
            var sumLikes = responseList.likes;
            var sumDislikes = responseList.dislikes;
            var rev_id = responseList.review_id;
            jQuery(`#like_count${review_id}`).append(sumLikes);
            jQuery(`#dislike_btn${review_id}`).append(`<div id='dislike_count' style='font-size: .5em; text-align: center;'>${sumDislikes}</div>`)
            console.log(responseList);
        })

    })    
}

function incrementDisliked (e) {

    // get the ID tag of the review 
    var review_id_tag = new String(jQuery(e.target).parent().prop("id"));

    // get the number of the review_id for use in POST methods 
    var review_id = review_id_tag[review_id_tag.length - 1];

    // 1 == TRUE, 0 == FALSE
    var liked = 0;
    var disliked = 1;
    
    console.log(`liked: ${liked}, disliked: ${disliked}, review_id: ${review_id}`)

    // make sure a user can't also click like without reloading the page
    jQuery( `#like_btn${review_id}` ).off( 'click', incrementLiked)

    var uploadUrl = '/wp-content/plugins/like_dislike_reviews/upload_likes.php';
    var data = {postliked:liked, postdisliked:disliked, userid: user_id, reviewid: review_id};

    jQuery.post(uploadUrl, data, function(uploadResponse) {
        jQuery(`#empty_dislike${review_id}`).remove();
        jQuery(`#dislike_btn${review_id}`).append(uploadResponse);
        console.log(uploadResponse);

        //callback to load total number of likes & dislikes from db
        var queryUrl = '/wp-content/plugins/like_dislike_reviews/query_likes.php';

        //POST data to query_likes.php so that review_id is accessible
        jQuery.post(queryUrl, data, function(response){
            var responseList = JSON.parse(response);
            var sumLikes = responseList.likes;
            var sumDislikes = responseList.dislikes;
            var rev_id = responseList.review_id;
            jQuery(`#dislike_count${review_id}`).append(sumDislikes);
            jQuery(`#like_btn${review_id}`).append(`<div id='like_count' style='font-size: .5em; text-align: center;'>${sumLikes}</div>`)
            console.log(responseList);
        });
    });

};
