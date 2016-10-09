(function(){
    'use strict';

    /**
     * @ngdoc overview
     * @name Kiwi Studio
     * @description
     * # Kiwi Studio
     *
     * Main module of the application.
     */
    angular
        .module('app')
        .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('pink')
                .accentPalette('orange')
        })
        .constant('Color', Color());

    function Color(){
        var colors = {
            customPrimary: {
                '50': '#99d7f2',
                '100': '#82ceef',
                '200': '#6cc5ec',
                '300': '#55bde9',
                '400': '#3fb4e6',
                '500': '#28ABE3',
                '600': '#1c9ed6',
                '700': '#198dbf',
                '800': '#167da9',
                '900': '#136c92',
                'A100': '#afe0f5',
                'A200': '#c6e9f8',
                'A400': '#dcf2fb',
                'A700': '#105b7b',
                'contrastDefaultColor': 'light'
            },
            customAccent: {
                '50': '#612900',
                '100': '#7a3300',
                '200': '#943e00',
                '300': '#ad4900',
                '400': '#c75400',
                '500': '#e05e00',
                '600': '#ff7714',
                '700': '#ff862e',
                '800': '#ff9547',
                '900': '#ffa361',
                'A100': '#ff7714',
                'A200': '#FA6900',
                'A400': '#e05e00',
                'A700': '#ffb27a',
                'contrastDefaultColor': 'light'
            },
            customWarn: {
                '50': '#facca8',
                '100': '#f9be90',
                '200': '#f7b078',
                '300': '#f6a260',
                '400': '#f49448',
                '500': '#F38630',
                '600': '#f27818',
                '700': '#e36b0d',
                '800': '#cb600c',
                '900': '#b3550a',
                'A100': '#fbdbc1',
                'A200': '#fde9d9',
                'A400': '#fef7f1',
                'A700': '#9a4909'
            }
        };

        colors.getRandomColor = function(){
            var palette = [colors.customPrimary, colors.customAccent, colors.customWarn][Math.floor(Math.random() * 3)];
            var keys = Object.keys(palette);
            // subtract one from keys to avoid the last option
            return palette[keys[Math.floor((keys.length - 1) * Math.random())]];
        };

        colors.defaultColorPicker = {
            options: {
                label: "Choose a color",
                random: true
            }
        };

        return colors;
    }
})();
