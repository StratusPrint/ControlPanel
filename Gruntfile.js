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
        'app/assets/public/**/*.css',
        'app/assets/public/**/*.js'
      ]
    },
    jshint: {
      src: ["app/assets/components/**/*.js","app/script.js"],
      options: {
        reporter: require('jshint-stylish'),
        globals: {
          jQuery: true,
          console: true
        }
      },

    },
    jscs: {
      src: ["app/assets/components/**/*.js","app/script.js"],
      options: {
        "config": ".jscsrc",
        "preset": "google",
        "fix": true 
      }
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
          'app/assets/public/js/base.js': [
            'app/assets/bower_components/jquery/dist/jquery.js',
            'app/assets/bower_components/bootstrap/dist/js/bootstrap.min.js',
            'assets/bower_components/metisMenu/dist/metisMenu.min.js',
            'assets/bower_components/raphael/raphael-min.js',
            'assets/bower_components/morrisjs/morris.min.js',
            'assets/dist/js/sb-admin-2.js',
            'app/assets/bower_components/angular/angular.min.js',
            'app/assets/bower_components/angular-route/angular-route.min.js',
            'app/assets/bower_components/angular-cookie/angular-cookie.min.js',
            'app/assets/bower_components/ng-token-auth/dist/ng-token-auth.min.js',
            'assets/bower_components/flot/excanvas.min.js',
            'assets/bower_components/flot/jquery.flot.js',
            'assets/bower_components/flot/jquery.flot.pie.js',
            'assets/bower_components/flot/jquery.flot.resize.js',
            'assets/bower_components/flot/jquery.flot.time.js',
            'assets/bower_components/flot.tooltip/js/jquery.flot.tooltip.min.js'
          ]
        }
      },
      misc: {
        files: {
          'app/assets/public/js/miscScripts.js': [
            'app/assets/js/*.js'
          ]
        }
      },
      dashboard: {
        files: {
          'app/assets/public/dashboard/dashboard.js': [
            'app/components/dashboard/*.js'
          ]
        }
      },
      login: {
        files: {
          'app/assets/public/login/login.js': [
            'app/components/login/*.js'
          ]
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
          'app/assets/public/css/base.css': [
            'app/assets/bower_components/bootstrap/dist/css/bootstrap.min.css',
            'app/assets/bower_components/metisMenu/dist/metisMenu.min.css',
            'app/assets/bower_components/font-awesome/css/font-awesome.min.css',
            'app/assets/dist/css/sb-admin-2.css'
          ]
        }
      },
      main: {
        files: {
          'app/assets/public/css/styles.css': [
            'app/assets/css/*.css'
          ]
        }
      }
    },
    watch: {
      scripts: {
        files: [
          'app/*.js',
          'app/assets/js/*.js',
          'app/components/**/*.js'
        ],
        tasks: ['jshint','jscs'],
        options: {
          spawn: false,
        },
      },
      styles: {
        files: [
          'app/assets/css/*.css',
          'app/components/**/*.css'
        ],
        tasks: ['cssmin'],
        options: {
          spawn: false,
        },
      },
    }
  });

  grunt.registerTask('default', [
    'newer:uglify',
    'newer:cssmin',
    'newer:jshint',
    'newer:jscs'
  ]);

  grunt.registerTask('lint', [
    'jshint',
    'jscs',
  ]);
};
