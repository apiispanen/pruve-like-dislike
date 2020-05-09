<?php

function upload_likes() {
    global $wpdb;
    require_once('../../../wp-config.php');

    $table_name = $wpdb->prefix . 'like_dislike_reviews'; 

    $liked = $_POST['postliked'];
    $disliked = $_POST['postdisliked'];
    $user_id = $_POST['userid'];
    $review_id = $_POST['reviewid'];

    // get existing rows from database   
    $sql = "SELECT * FROM $table_name WHERE `review_id` = $review_id AND `user_id` = $user_id";
    $wpdb->prepare($sql, 0);
    $rows = $wpdb->get_results($sql);

    $new_row = array('user_id' => $user_id, 'review_id' => $review_id, 'liked' => $liked, 'disliked' => $disliked);
    $fake_row = array('user_id' => 99, 'review_id' => 99, 'liked' => 99, 'disliked' => 99);
    
    $like_data = array("<img src='wp-content/plugins/like_dislike/images/filled_thumb_up.png'>", "<div id='like_count$review_id' style='font-size: .5em; text-align: center;'></div>");
    $dislike_data = array("<img src='wp-content/plugins/like_dislike/images/filled_thumb_down.png'>", "<div id='dislike_count$review_id' style='font-size: .5em; text-align: center;'></div>");

    if(count($rows) == 0 ) {g
        $wpdb->insert($table_name, $new_row);
    } else {
        $wpdb->insert($table_name, $fake_row);
    }

    if($liked == 1){
        foreach($like_data as $data){
            echo $data;
        }
    } else {
        foreach($dislike_data as $data){
            echo $data;
        };
    }

    return $review_id;

}

upload_likes();

?>

