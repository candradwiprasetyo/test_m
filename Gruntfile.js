module.exports = function(grunt){ 'use strict';
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
	grunt.initConfig({
		jade: {
			static: {
				options: {
					pretty: true
				},
				files: [{
					cwd: 'src/views',
					src: ['_*.jade', '!_mixins.jade'],
					dest: '',
					ext: '.html',
					expand: true
				}]
			}
		},
		sass: {
			app: {
				options: {
					sourceMap: false,
					// outputStyle: "expanded"
					outputStyle: "compressed"
				},
				files: {
					"assets/css/app.css": "src/css/app.scss"
				}
			}
		},
		autoprefixer: {
			app: {
				options: {
					map: false,
					browsers: [
						"Android 2.3",
						"Android >= 4",
						"iOS >= 6"
					]
				},
				src: "assets/css/app.css"
			}
		},
		babel: {
			options: {
				sourceMap: true,
				presets: ['react'],
				minified:false
			},
			dist: {
				files: 
				// {
				// 	'app/components/tes.js': 'app/components/jsx/tes.jsx'
				// }
				[{
						cwd: 'app/components/jsx',
						src: '*.jsx',
						dest: 'app/components',
						ext: '.js',
						expand: true
					}]
			}
		},
		concat:{
			options: {
				separator: ';\n',
			},
			basic_and_extras:{
				files:{
					'build.libs.js':[
						'assets/libs/modernizr-custom.js','assets/libs/jquery.js',
						'assets/libs/moment.js','assets/libs/pikaday.js',
						'assets/libs/swiper.min.js','assets/libs/owl.carousel.min.js',
						'assets/libs/Sortable.min.js','assets/libs/jquery.parallax.min.js',
						'assets/libs/jquery.itour.min.js',
						'assets/libs/angular.js','assets/libs/angular-cookies.js',
						'assets/libs/angular-ui-router.js','assets/libs/angular-translate.js','assets/libs/angular-sanitize.js',
						'assets/libs/react.min.js','assets/libs/react-dom.min.js',
						'assets/libs/angulartics.min.js','assets/libs/angulartics-ga.min.js',
						'assets/libs/clipboard.min.js'
					],
					'ciayo.js':
					[
						'assets/lang/en.js','assets/lang/id.js',
						'app/app.js',
						'app/components/card-parallax-component.js',
						'app/services/**.js','app/factories/**.js',
						'app/connectors/**.js',
						'app/controllers/**.js','app/drawer-factories/**.js',
						'app/directives/**.js',
					]
				}
			}
		},
		watch: {
			reload: {
				options: { livereload: 3030 },
				files: [
					'*.html',
					'assets/css/*.css',
					'assets/lang/**.js','app/**/*.js'
				]
			},
			jade: {
				files: 'src/views/**/*.jade',
				tasks: 'jade'
			},
			sass: {
				files: 'src/css/**/*.scss',
				tasks: ['sass', 'autoprefixer']
			},
			babel:{
				files: 'app/components/jsx/*.jsx',
				tasks: 'babel'
			},
			concat: {
				files: ['assets/lang/**.js','app/**/*.js'],
				tasks: ['concat']
			}
		},
		connect: {
			server: {
				options: {
					// open: 'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>',
					hostname: '0.0.0.0',
					livereload: 3030,
					port: 3000
				}
			}
		}
	});
	grunt.registerTask('default', function(){
		grunt.task.run(['connect','watch']);
	}); 
};
