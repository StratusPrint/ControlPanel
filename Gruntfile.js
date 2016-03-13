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
        'app/assets/**/*.css',
        'app/assets/**/*.js',
        'public/javascripts/**/*.js',
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
          'app/public/javascripts/base.js': [
            'app/assets/bower_components/jquery/dist/jquery.js',
            'app/assets/bower_components/bootstrap/dist/js/bootstrap.min.js',
          ]
        }
      },
      dashboard: {
        files: {
          'app/assets/dashboard/dashboardCtrl.js': []
        }
      },
      login: {
        files: {
          'app/assets/login/loginCtrl.js': []
        }
      }
    },
    cssmin: {
      options: {
        banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */',
        root: './'
      },
      base: {
        files: {
          'app/assets/css/styles.css': [
            'app/assets/components-font-awesome/css/font-awesome.css',
            'app/assets/bootstrap/dist/css/bootstrap.min.css',
            'app/assets/bootstrap/dist/css/bootstrap-theme.min.css'
          ]
        }
      }
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
