let reviews

// user_id will come from WP current_user object / auth 
const user_id = 6;

// submissions = result of query, list of objects
// let submissionsOnPage = [];

jQuery(document).ready(function() {
    console.log("like_dislike_reviews_script loaded");
    
    // .entry-content (SAM) --> .review-list (PRUVE)
    let reviewsClass = document.querySelectorAll('.entry-content');
    
    // callback function within handleData -- adds buttons to the correct reviews
    function addButtons() {

        for (let i = 0; i < reviewsClass.length; i++){
        
            let review = reviewsClass[i];
            console.log(review)

            let btnHTML = jQuery(`<div class='btn_container' id='btn_container${i}'><div class='like_btn' id='like_btn${i}'><img id='empty_like${i}' src='/wp-content/plugins/like_dislike_reviews/images/empty_thumb_up.png'></div><div class='dislike_btn' id='dislike_btn${i}'><img id='empty_dislike${i}' src='/wp-content/plugins/like_dislike_reviews/images/empty_thumb_down.png'></div></div>`);

            review.append(btnHTML[0])

            //change ${review} to something else
            //add event listeners to buttons
            jQuery(`#btn_container${i}`).find('.like_btn').one('click', incrementLiked);
            jQuery(`#btn_container${i}`).find('.dislike_btn').one('click', incrementDisliked);
        }     
    }
    
    addButtons()

})


function incrementLiked (e) {

// uncomment below block comment to find review IDs from description class

/*
let reviews = document.querySelector('.review-list')

let review = jQuery(reviews.children[0])

const btns = jQuery("<div>BOOTONS</div>")

let reviewChildren = review.children()

reviewChildren[1].append(btns[0])

let reviewGrandChildren = reviewChildren.children()

for (let el of reviewGrandChildren) {
    console.log(el.classList);
    if (el.classList.contains('review-description')) {
        
        let reviewIdClass = el.classList[1]
        let reviewId 
        let dashIndex
        
        for (let char of reviewIdClass) {
            if (char == "-") {
                console.log('FOUND THE DASH')
                console.log(reviewIdClass.indexOf(char))
                dashIndex = reviewIdClass.indexOf(char)
                break
            }
        }
        
        reviewId = reviewIdClass.slice(dashIndex + 1, reviewIdClass.length)
        console.log(reviewId)
        break;
    }
}
*/

    // delete this after uncommenting above commented block
    let review_id_tag = new String(jQuery(e.target).parent().prop("id"));

    // uncomment large block above and assign review_id to reviewId
    let review_id = review_id_tag[review_id_tag.length - 1];

    // 1 == TRUE, 0 == FALSE
    let liked = 1;
    let disliked = 0;

    //ensure that a user can only click like/dislike once for each review without refreshing
    jQuery( `#dislike_btn${review_id}` ).off( 'click', incrementDisliked);
    let uploadUrl = '/wp-content/plugins/like_dislike_reviews/upload_likes.php';
    let data = {postliked:liked, postdisliked:disliked, userid: user_id, reviewid: review_id};

    // temporary HTML to add a button and a temporary number to screen before calling to server
    let tempHTML = `<img id='temp_like_btn${review_id}' src='/wp-content/plugins/like_dislike_reviews/images/filled_thumb_up.png'> <div id='temp_like_count${review_id}' style='font-size: .5em; text-align: center;'>0</div>`

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
            jQuery(`#dislike_btn${review_id}`).append(`<div id='dislike_count' style='font-size: .5em; text-align: center;'>${sumDislikes}</div>`)
        })

    })    
}

function incrementDisliked (e) {

// uncomment below block comment to find review IDs from description class

    /*

    let review = jQuery(btns.parent())

    let reviewChildren = review.children()

    for (let el of reviewChildren) {
        console.log(el)
        // console.log(el.classList);
        if (el.classList.contains('review-description')) {
            
            let reviewIdClass = el.classList[1]
            let reviewId 
            let dashIndex
            
            for (let char of reviewIdClass) {
                if (char == "-") {
                    console.log('FOUND THE DASH')
                    console.log(reviewIdClass.indexOf(char))
                    dashIndex = reviewIdClass.indexOf(char)
                    break
                }
            }
            
            reviewId = reviewIdClass.slice(dashIndex + 1, reviewIdClass.length)
            console.log(reviewId)
            break;
    }
}
*/

    // delete this line after uncommenting above commented block
    let review_id_tag = new String(jQuery(e.target).parent().prop("id"));

    // uncomment large block above and assign review_id to reviewId
    let review_id = review_id_tag[review_id_tag.length - 1];

    // 1 == TRUE, 0 == FALSE
    let liked = 0;
    let disliked = 1;
    
    console.log(`liked: ${liked}, disliked: ${disliked}, review_id: ${review_id}`)

    // make sure a user can't also click like without reloading the page
    jQuery( `#like_btn${review_id}` ).off( 'click', incrementLiked)

    let uploadUrl = '/wp-content/plugins/like_dislike_reviews/upload_likes.php';
    let data = {postliked:liked, postdisliked:disliked, userid: user_id, reviewid: review_id};

    // add an icon to show that the user clicked
    let tempHTML = `<img id='temp_dislike_btn${review_id}' src='/wp-content/plugins/like_dislike_reviews/images/filled_thumb_down.png'> <div id='temp_dislike_count${review_id}' style='font-size: .5em; text-align: center;'>0</div>`

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
            jQuery(`#like_btn${review_id}`).append(`<div id='like_count' style='font-size: .5em; text-align: center;'>${sumLikes}</div>`)
        });
    });

};
