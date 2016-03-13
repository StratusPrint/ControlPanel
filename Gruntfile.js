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
            'app/assets/bower_components/angular/angular.min.js',
            'app/assets/bower_components/angular-route/angular-route.min.js',
            'app/assets/bower_components/angular-cookie/angular-cookie.min.js',
            'app/assets/bower_components/ng-token-auth/ng-token-auth.min.js'
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
            'app/assets/bower_components/components-font-awesome/css/font-awesome.css',
            'app/assets/bower_components/bootstrap/dist/css/bootstrap.min.css',
            'app/assets/bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
          ]
        }
      },
      main: {
        files: {
          'app/assets/public/css/styles.css': [
            './app/assets/css/*.css'
          ]
        }
      },
      dashboard: {
        files: {
          'app/assets/public/css/dashboard/dashboard.css': [
            'app/components/dashboard/*.css'
          ]
        }
      },
      login: {
        files: {
          'app/assets/public/css/dashboard/login.css': [
            'app/components/login/*.css'
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
