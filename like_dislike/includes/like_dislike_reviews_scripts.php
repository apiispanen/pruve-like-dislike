<?php 
    function like_dislike_add_scripts(){
        wp_enqueue_style('like_dislike_style', plugins_url(). '/like_dislike/css/like_dislike_style.css' );
        
        wp_enqueue_script('like_dislike_script', plugins_url(). '/like_dislike/js/like_dislike_main.js', false, false, true );
    }


    add_action('wp_enqueue_scripts', 'like_dislike_add_scripts');
    
?>