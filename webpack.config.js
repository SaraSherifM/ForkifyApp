

//in webpack there are 4 core concepts
    // 1- entry point where webpack start bundling we can specify one or more, ./ = current folder

    // 2- output, where to save our bundle, takes an object with path and file name
     //we need absolute path and in order to access that we need a built in node package
    //takes worjing directory +name wewant to store it in

    //3-  mode: 'development'
    //Remove it to the package .json file


      //4- loaders
      // allow us to import or load all different kinds of files and proccess them like convert sas to css or ES6 to ES5


//get path packages
const path = require('path');

//require package to be used in plugins after installing npm i html-webpack-plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')



module.exports = {

    entry: ['babel-polyfill','./src/js/index.js'],
    output: {
        
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'

    },
    devServer:{
        contentBase: './dist',
       
    },
     //plugins allow us to do complex proccesses to our input files  //npm i html-webpack-plugin --save-dev
     //we want to cope the index.html file into dist index,html automatically
     plugins:[
         new HtmlWebpackPlugin({
            filename:'index.html',
            template:'./src/index.html'  //starting file
         })
        ],

        module:{
            //array of loaders each loader is configured in an object
            rules:[
                {
                    //regex ends with js
                    test:/\.js$/ ,
                    exclude:/node_modules/,
                    use: {
                        loader:'babel-loader'
                    }

                }
            ]
        }
};