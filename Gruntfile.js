module.exports = function(grunt) {
  require('time-grunt')(grunt);

  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*', '!grunt-log-headers']
  });

  require('grunt-log-headers')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    newer: {
      options: {
        gruntLogHeader: false
      }
    },
    'newer-postrun': {
      options: {
        gruntLogHeader: false
      }
    },
    clean: {
      src: [
        'app/public/**/*.css',
        'app/public/**/*.js'
      ]
    },
    jshint: {
      src: [
          'app/app.js',
          'app/control-panel/**/*.js'
      ],
      options: {
        reporter: require('jshint-stylish'),
        globals: {
          jQuery: true,
          console: true
        }
      },

    },
    jscs: {
      src: [
          'app/app.js',
          'app/control-panel/**/*.js'
      ],
      options: {
        "config": ".jscsrc",
        "preset": "google",
        "maximumLineLength": 160,
        "fix": true 
      }
    },
    ngAnnotate: {
        angular_app: {
            files: {
              'app/public/js/app.js': [
                'bower_components/angular/angular.js',
                'bower_components/angular-ui-router/release/angular-ui-router.js',
                'bower_components/angular-cookie/angular-cookie.js',
                'bower_components/angular-local-storage/dist/angular-local-storage.js',
                'bower_components/ng-token-auth/dist/ng-token-auth.js',
                'app/app.js',
                'app/control-panel/**/*.js'
              ]
            }
        },
    },
    uglify: {
      options: {
        banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: false,
        beautify: false,
        mangle: false
      },
      base: {
        files: {
          'app/public/js/base.js': [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/metisMenu/dist/metisMenu.js',
            'bower_components/startbootstrap-sb-admin-2/dist/js/sb-admin-2.js'
          ],
          'app/public/js/graphs.js': [
            'bower_components/raphael/raphael.js',
            'bower_components/morrisjs/morris.js'
          ]
        }
      },
      app: {
        files: {
          'app/public/js/app.js': [
            'app/public/js/app.js'
          ]
        }
      }
    },
    less: {
      base: {
        files: {
          "app/public/css/sb-admin-2.css": "app/assets/less/sb-admin-2.less",
          "app/public/css/styles.css": "app/assets/less/styles.less"
        }
      }
    },
    cssmin: {
      options: {
        banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */',
        root: './app/'
      },
      base: {
        files: {
          'app/public/css/base.css': [
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'bower_components/metisMenu/dist/metisMenu.css',
            'bower_components/startbootstrap-sb-admin-2/dist/css/timeline.css',
            'bower_components/font-awesome/css/font-awesome.css',
            'bower_components/morrisjs/morris.css',
            'app/public/css/sb-admin-2.css',
            'app/public/css/styles.css'
          ]
        }
      }
    },
    watch: {
      scripts: {
        files: [
          'app/app.js',
          'app/control-panel/**/*.js'
        ],
        tasks: ['default'],
        options: {
          spawn: false,
        },
      },
      styles: {
        files: [
          'app/assets/less/*.less',
          'app/assets/less/**/*.less'
        ],
        tasks: ['less', 'cssmin'],
        options: {
          spawn: false,
        },
      },
    }
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'ngAnnotate:angular_app',
    'newer:uglify',
    'newer:less',
    'newer:cssmin',
    'newer:jscs'
  ]);

  grunt.registerTask('lint', [
    'jshint',
    'jscs',
  ]);
};
