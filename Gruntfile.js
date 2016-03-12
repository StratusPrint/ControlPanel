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
      options: {
        reporter: require('jshint-stylish'),
        globals: {
          jQuery: true,
          console: true
        }
      },
      src: [
        '*.js',
        'app/assets/bower_components/jquery/**/*.js'
      ]
    },
    jscs: {
      src: [
        '*.js',
        'app/assets/js/**/*.js'
      ],
      options: {
        preset: 'jquery', // Enforce jQuery code style guidelines (see: https://contribute.jquery.org/style-guide/js/)
        fix: true, // Auto fix code style errors
        validateQuoteMarks: '\'', // Enforce single quotes instead of double
        validateIndentation: '\t' // Enforce use of tab for indentation
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
          'public/javascripts/base.js': [
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
    'newer:cssmin'
  ]);

  grunt.registerTask('lint', [
    'jshint',
    'jscs',
    'scsslint'
  ]);

  grunt.registerTask('test', [
    'jshint', 'jscs', 'scsslint'
  ]);
};
