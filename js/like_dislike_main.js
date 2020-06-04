let reviews

// user_id will come from WP current_user object / auth 
const user_id = 6;

// submissions = result of query, list of objects
// let submissionsOnPage = [];

jQuery(document).ready(function() {
    
    //AJAX here to get user id
    
    console.log("like_dislike_reviews_script loaded");
    
    // .entry-content (SAM) --> .review-list (PRUVE)
    let reviewsClass = document.querySelectorAll('.reviews');
    
    // callback function within handleData -- adds buttons to the correct reviews
    
    
    function addButtons() {

        // change 2 to reviewsClass.length
        for (let i = 0; i < reviewsClass.length; i++){
            
            let review = jQuery(reviewsClass[i]);
            console.log

            let rev_id = jQuery(review.children()[1]).prop("id")

            let btnHTML = jQuery(`<div class='btn_container' id='btn_container${rev_id}'><div class='like_btn' id='like_btn${rev_id}'><img id='empty_like${rev_id}' src='/wp-content/plugins/like_dislike_reviews/images/empty_thumb_up.png'></div><div class='dislike_btn' id='dislike_btn${rev_id}'><img id='empty_dislike${rev_id}' src='/wp-content/plugins/like_dislike_reviews/images/empty_thumb_down.png'></div></div>`);
            
            review.children()[1].append(btnHTML[0])

            //add event listeners to buttons
            jQuery(`#btn_container${rev_id}`).find('.like_btn').one('click', incrementLiked);
            jQuery(`#btn_container${rev_id}`).find('.dislike_btn').one('click', incrementDisliked);
        }     
    }
    
    addButtons()

})


function incrementLiked (e) {

// uncomment below block comment to find review IDs from description class


let reviews = document.querySelector('.reviews')

console.log(`liked: ${reviews}`)

let review = jQuery(reviews.children[0])
console.log(`review: ${review}`)

let reviewChildren = review.children()



let reviewGrandChildren = reviewChildren.children()


    // delete this after uncommenting above commented block
    let review_id = jQuery(e.target).parent().parent().parent().prop("id");
    console.log(`review_idinLIKE: ${review_id}`)


    // uncomment large block above and assign review_id to reviewId

    // 1 == TRUE, 0 == FALSE
    let liked = 1;
    let disliked = 0;

    //ensure that a user can only click like/dislike once for each review without refreshing
    jQuery( `#dislike_btn${review_id}` ).off( 'click', incrementDisliked);
    let uploadUrl = '/wp-content/plugins/like_dislike_reviews/upload_likes.php';
    let data = {postliked:liked, postdisliked:disliked, userid: user_id, reviewid: review_id};

    // temporary HTML to add a button and a temporary number to screen before calling to server
    let tempHTML = `<img id='temp_like_btn${review_id}' src='/wp-content/plugins/like_dislike_reviews/images/filled_thumb_up.png'> <div id='temp_like_count${review_id}' style='font-size: 1em; text-align: center;'>0</div>`

    jQuery(`#empty_like${review_id}`).remove();
    jQuery(`#like_btn${review_id}`).append(tempHTML)
    
    //callback to add a like to db
    jQuery.post(uploadUrl, data, function(uploadResponse) {
        jQuery(`#temp_like_count${review_id}`).remove();
        jQuery(`#temp_like_btn${review_id}`).remove();
        jQuery(`#like_btn${review_id}`).append(uploadResponse)
        
        //callback to load total number of likes & dislikes from db
        let queryUrl = '/wp-content/plugins/like_dislike_reviews/query_likes.php';

        //POST data to query_likes.php so that review_id is accessible
        jQuery.post(queryUrl, data, function(response){
            let responseList = JSON.parse(response);
            let sumLikes = responseList.likes;
            let sumDislikes = responseList.dislikes;
            let rev_id = responseList.review_id;
            jQuery(`#like_count${review_id}`).append(sumLikes);
            jQuery(`#dislike_btn${review_id}`).append(`<div id='dislike_count' style='font-size: 1em; text-align: center;'>${sumDislikes}</div>`)
        })

    })    
}

function incrementDisliked (e) {

    let review_id = jQuery(e.target).parent().parent().parent().prop("id");

    // 1 == TRUE, 0 == FALSE
    let liked = 0;
    let disliked = 1;
    
    console.log(`liked: ${liked}, disliked: ${disliked}, review_id: ${review_id}`)

    // make sure a user can't also click like without reloading the page
    jQuery( `#like_btn${review_id}` ).off( 'click', incrementLiked)

    let uploadUrl = '/wp-content/plugins/like_dislike_reviews/upload_likes.php';
    let data = {postliked:liked, postdisliked:disliked, userid: user_id, reviewid: review_id};

    // add an icon to show that the user clicked
    let tempHTML = `<img id='temp_dislike_btn${review_id}' src='/wp-content/plugins/like_dislike_reviews/images/filled_thumb_down.png'> <div id='temp_dislike_count${review_id}' style='font-size: 1em; text-align: center;'>0</div>`

    jQuery(`#empty_dislike${review_id}`).remove();
    jQuery(`#dislike_btn${review_id}`).append(tempHTML)

    jQuery.post(uploadUrl, data, function(uploadResponse) {
        jQuery(`#temp_dislike_count${review_id}`).remove();
        jQuery(`#temp_dislike_btn${review_id}`).remove();
        jQuery(`#empty_dislike${review_id}`).remove();
        jQuery(`#dislike_btn${review_id}`).append(uploadResponse);

        //URL to load total number of likes & dislikes from db
        queryUrl = '/wp-content/plugins/like_dislike_reviews/query_likes.php';

        //POST data to query_likes.php so that review_id is accessible
        jQuery.post(queryUrl, data, function(response){
            responseList = JSON.parse(response);
            sumLikes = responseList.likes;
            sumDislikes = responseList.dislikes;
            rev_id = responseList.review_id;
            jQuery(`#dislike_count${review_id}`).append(sumDislikes);
            jQuery(`#like_btn${review_id}`).append(`<div id='like_count' style='font-size: 1em; text-align: center;'>${sumLikes}</div>`)
        });
    });

};
