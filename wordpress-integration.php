<?php
/*
Plugin Name: Simulateur Pilier 3
Description: Intégration du simulateur de pilier 3 React
Version: 1.0
Author: Votre Nom
*/

// Empêcher l'accès direct au fichier
if (!defined('ABSPATH')) {
    exit;
}

// Fonction pour enregistrer le shortcode
function pilier3_simulator_shortcode() {
    // Le conteneur pour l'application React
    $output = '<div id="root"></div>';
    
    // En production, chargez les assets buildés
    if (!defined('DEVELOPMENT_MODE')) {
        wp_enqueue_script('pilier3-simulator', plugins_url('build/assets/index.js', __FILE__), array(), '1.0', true);
        wp_enqueue_style('pilier3-simulator', plugins_url('build/assets/index.css', __FILE__), array(), '1.0');
    }
    
    return $output;
}

// Enregistrer le shortcode
add_shortcode('pilier3_simulator', 'pilier3_simulator_shortcode');

// Fonction d'initialisation du plugin
function pilier3_simulator_init() {
    // Ajouter des en-têtes CORS si nécessaire
    add_action('init', function() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
    });
}

add_action('init', 'pilier3_simulator_init'); 