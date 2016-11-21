Test Bower
==========

# Intallation
- Run $ bower install to install the bower dependencies

This app uses:
-	bower
-	require.js
-	react.js
-	node_modules ($npm install react-tools --save)
-	[requirejs-react-jsx](https://github.com/podio/requirejs-react-jsx) (building compiled version)

Bower
-	cd <path to the folder>
-	bower install <package name>
-	bower update

Building
-	$ node bower_components/r.js/dist/r.js -o build.js