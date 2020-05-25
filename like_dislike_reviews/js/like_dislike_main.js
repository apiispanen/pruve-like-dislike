let reviews

// .entry-content (SAM) --> .review-list (PRUVE)
let reviews_class = document.querySelectorAll('.entry-content');

let headers_class = document.querySelectorAll('.entry-title')

// submissions = result of query, list of objects
let submissionsOnPage = [];

jQuery(document).ready(function() {
    console.log("like_dislike_reviews_script loaded");

    // .entry-content (SAM) --> .review-description (PRUVE)
   
    //query
    let submissionURL = "/wp-content/plugins/like_dislike_reviews/query_submissions.php"
    
    // callback function within handleData -- adds buttons to the correct reviews
    function addButtons(listToCheck) {
        const item = listToCheck[0]

        for (let i = 0; i < reviews_class.length; i++){
        
            let review = reviews_class[i];
            console.log(review)

            console.log(review.classList)

            review.classList.add(`review-${i}`)
    
            // for testing -- title = citation
            let reviewCitation = headers_class[i].textContent.trim();
            // console.log(reviewCitation)

            let btnHTML = jQuery(`<div class='btn_container' id='btn_container${i}'><div class='like_btn' id='like_btn${i}'><img id='empty_like${i}' src='/wp-content/plugins/like_dislike_reviews/images/empty_thumb_up.png'></div><div class='dislike_btn' id='dislike_btn${i}'><img id='empty_dislike${i}' src='/wp-content/plugins/like_dislike_reviews/images/empty_thumb_down.png'></div></div>`);

            review.append(btnHTML[0])

            //change ${review} to something else
            //add event listeners to buttons
            jQuery(`#btn_container${i}`).find('.like_btn').one('click', incrementLiked);
            jQuery(`#btn_container${i}`).find('.dislike_btn').one('click', incrementDisliked);
        }     
    }

    const handleData = function (data) {
        
        const submissionsObj = JSON.parse(data)
        for (let submission = 0; submission < submissionsObj.length; submission++) {
        // console.log(submissionsObj[submission])
            
        let newObj
        let description = submissionsObj[submission]['description'];
        let citation = submissionsObj[submission]['citations'];
            
        //if description == element description, if href of a tag == citation
        if (description == 'this is the best treatment evur' && citation == 'Review'){
                newObj = submissionsObj[submission]
                submissionsOnPage.push(newObj)
                console.log("FOUND IT")
            } 

            if (submissionsOnPage.length > 0) {
                console.log(`XX ${submissionsOnPage}`)
            }
        }

        addButtons(submissionsOnPage)
           
        }

        

    const submissions = function() {
        return jQuery.ajax({
            url: submissionURL
        })
        
    }
    
    submissions().then(handleData)

    })
        
    

// user_id will come from Drew's SQL table
const user_id = 5;
// review_id MAY also come from Drew's SQL table


function incrementLiked (e) {
    // get the ID tag of the review 
    var review_id_tag = new String(jQuery(e.target).parent().prop("class"));

    // get the number of the review and add it to a new variable called review_id for use in POST
    var review_id = review_id_tag[review_id_tag.length - 1];

    console.log(review_id);

    // values to pass to POST request -- in SQL table, 1 = true, 0 = false
    var liked = 1;
    var disliked = 0;

    //ensure that a user can only click like/dislike once for each review without refreshing
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

    // add an icon to show that the user clicked

    jQuery.post(uploadUrl, data, function(uploadResponse) {
        jQuery(`#empty_dislike${review_id}`).remove();
        jQuery(`#dislike_btn${review_id}`).append(uploadResponse);
        console.log(uploadResponse);

        //URL to load total number of likes & dislikes from db
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

    // remove icon if shit fails
};
