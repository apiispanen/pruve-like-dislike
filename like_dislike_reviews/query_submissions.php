<?php

global $wpdb;

function query_likes() {
    require_once('../../../wp-config.php');
    // $review_id = $_POST['reviewid'];
    
    $table_name = 'wp5r_reviews';  
    
    $sql = $wpdb->prepare("SELECT * FROM $table_name");

    
    $all_reviews = $wpdb->get_results($sql);

    echo json_encode($all_reviews);
}

query_likes();

?>