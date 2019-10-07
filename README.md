# Sync Kirki controls
This module allows setting a master to a control. Let's say you add a color control which should have the same value as its master until the user decides to overwrite it.
That is basically what this is all about.

## Requirements
- Kirki Framework >=4.0
- WordPress >= 4.6

## Which controls are supported
So far this is tested with the following Kirki Controls. But it could work with others out of the box, too:
- Color: https://github.com/kirki-framework/control-color/
- Multicolor: https://github.com/kirki-framework/field-multicolor
- Typography: https://github.com/kirki-framework/field-typography

## How to set up Syncs
In general multiple controls can have the same "master". Just define `sync-master` within the `input_attrs` argument for each of them:
`````
'input_attrs' => [
  'sync-master' => 'primary_color'
 ]
`````
For the example above `primary_color` is the masters setting ID.

## Special Case: Multicolor Field
Usage with: https://github.com/kirki-framework/field-multicolor

The Kirki Multicolor Field internally sets up multiple controls. It is up to you to set up a master for all colors at once or individually.

### Set master for all color controls

You can do the above example for a Multicolor Field as well. So each color control of that will be synced to the master `primary_color` until its value is overwritten.

`````
'input_attrs' => [
  'sync-master' => 'primary_color'
 ]
`````

### Set individual masters

Let's say you have set up the color controls like this:
`````
'choices'   => [
  'color_1'   => esc_attr__( 'First Color', 'example' ),
  'color_2'   => esc_attr__( 'Second Color', 'example' ),
  'color_3'   => esc_attr__( 'Another Color', 'example' ),
],
`````

So you can define for each `choices` individually which the sync master is.

`````
'input_attrs' => [
  '{{ CHOICE ID }}' => [
    'sync-master' => '{{ MASTER ID }}',
  ],
  'color_2' => [
    'sync-master' => 'colors[primary]',
  ],
  'color_3' => [
    'sync-master' => 'colors[secondary]',
  ],
],
`````

You could even define the master for all and make an exception for `color_2`.

`````
'input_attrs' => [
  'sync-master' => 'colors[primary]',
  'color_2' => [
    'sync-master' => 'colors[secondary]',
  ],
],
`````

`color_1` and `color_3` will have the same master `colors[primary]`. `color_2` will be synced with `colors[secondary]`.

## Special Case: Typography Field
Usage with: https://github.com/kirki-framework/field-typography

The Typography Field is setting up multiple controls, too:
- 'font-family'
- 'font-weight'
- 'font-style'
- 'font-size'
- 'line-height'
- 'letter-spacing'
- 'word-spacing'
- 'text-transform'
- 'text-align'
- 'margin-top'
- 'margin-bottom'
- 'color'

Currently you need to define each control you want to sync individually:

`````
'input_attrs' => [
  'font-family' => [
    'data-sync-master' => 'another_typo_control[font-family]',
  ],
  'font-weight' => [
    'data-sync-master' => 'another_typo_control[font-weight]',
  ],
],
``````
      
## Sync indicator

Controls which have a master sync defined have a indicator appended to the label. 
It is linked to focus the master control on click and either labels `AUTO` as long as it is in sync or 'CUSTOM' if the value is overwritten.



