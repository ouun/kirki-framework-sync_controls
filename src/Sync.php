<?php

/**
 * Syncs Customizer controls until user overwrites the master value.
 * This is based on the fantastic Kirki by Ari Stathopoulos (@aristath)
 *
 * @package   Kirki
 * @category  Modules
 * @author    Philipp Wellmer (@ouun)
 * @copyright Copyright (c) 2019, Philipp Wellmer (@ouun)
 * @license   https://opensource.org/licenses/MIT
 * @since     1.0
 */

namespace Kirki\Module;

use WP_Customize_Manager;

/**
 * Adds the Sync Module
 *
 * @since 1.0
 */
class Sync
{

    /**
     * The class constructor
     *
     * @access public
     * @since 1.0
     */
    public function __construct()
    {
        add_action('customize_controls_print_footer_scripts', array( $this, 'customize_controls_enqueue_scripts' ));
        add_action('customize_controls_enqueue_scripts', array( $this, 'customize_controls_enqueue_scripts' ));
        add_filter('kirki_field_add_control_args', array( $this, 'filter_control_args' ), 10, 2);
    }

    /**
     * Enqueue scripts.
     *
     * @access public
     * @since 1.0
     */
    public function customize_controls_enqueue_scripts()
    {
        wp_enqueue_script(
            'kirki-sync',
            get_theme_file_uri('/vendor/ouun/kirki-module-sync_controls/src/sync-fields.js'),
            array(
                'customize-controls',
                'customize-base',
                'wp-element',
                'wp-compose',
                'wp-components',
                'jquery',
                'wp-i18n',
            ),
            '1.0.0',
            true
        );
    }

    /**
     * Filter control args.
     *
     * @access public
     * @since 1.0
     * @param array                $args         The field arguments.
     * @param WP_Customize_Manager $wp_customize The customizer instance.
     * @return array
     */
    public function filter_control_args($args, $wp_customize)
    {
        // Fail early. Proceed only with subcontrols
        if (! isset($args['parent_setting'])) {
            return $args;
        }

        // Mainly for Typography fields
        if (isset($args['parent_setting']) && isset($args['input_attrs']) && isset($args['wrapper_atts'])) {
            $subcontrol = $args['wrapper_atts']['kirki-typography-subcontrol-type'];

            $args['input_attrs'] = isset($args['input_attrs'][ $subcontrol ]) ? $args['input_attrs'][ $subcontrol ] : $args['input_attrs'];
        }

        return $args;
    }
}
