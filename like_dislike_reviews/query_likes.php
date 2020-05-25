<?php

global $wpdb;

function query_likes() {
    require_once('../../../wp-config.php');
    $review_id = $_POST['reviewid'];
    
    $table_name = $wpdb->prefix . 'like_dislike_reviews';
    
    $sql = $wpdb->prepare("SELECT SUM(`liked`), SUM(`disliked`) FROM $table_name WHERE 1 AND `review_id` = $review_id");

    
    $sum_likes = $wpdb->get_var($sql, 0);
    $sum_dislikes = $wpdb->get_var($sql, 1);
    
    $results = array("likes" => $sum_likes, "dislikes" => $sum_dislikes, "review_id" => $review_id);
    
    echo json_encode($results);
}

query_likes();

?>