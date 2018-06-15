/* Magic Mirror
 * Node Helper: MMM-ImageFileWacther
 *
 * By Bas Knol
 * MIT Licensed.
 *
 * Chokidar - https://github.com/paulmillr/chokidar
 * MIT Licensed.
 * Copyright (c) 2016 Paul Miller (http://paulmillr.com) & Elan Shanker
 * 
 */

var NodeHelper = require("node_helper");
var chokidar = require('chokidar');

module.exports = NodeHelper.create({

    start: function () {        
        this.watching = false;
    },

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
        if (notification == "START") {
            this.watchFiles(payload);
        }
    },

    //Watch if files are added to given paths
    watchFiles: function (config) {
        var self = this;

        //Check if we are already watching, avoid double events because of mirror refresh
        if (this.watching === false) {
            console.log("Start watching: " + config.imagePaths);

            // Initialize watcher passing array of paths
            var watcher = chokidar.watch(config.imagePaths, {
                ignored: /(^|[\/\\])\../, //ignore .dotfiles
                ignoreInitial: true,
                persistent: true
            });

            //Watch if files are added
            watcher
                .on('add', (path, stats) => {
                    console.log(`File ${path} has been added`);
                    //if (stats) console.log(`File ${path} changed size to ${stats.size}`);

                    //Check if the file extension is valid
                    if (self.checkValidImageFileExtension(path, config.validImageFileExtensions)) {
                        //Wait a bit to avoid message: Error: EBUSY: resource busy or locked, open... o_O
                        setTimeout(function () {
                            self.sendSocketNotification("FILE_ADDED", path);
                        }, 1000);
                    }
                })
                .on('error', error => console.log(`MMM-ImageFileWacther error: ${error}`)); //Log errow

            //Watching is set
            this.watching = true;
        }
    },

    //Check if we can handle this type of file based on extension, is it an image? 
    checkValidImageFileExtension: function (filename, extensions) {
        var extList = extensions.split(',');
        for (var extIndex = 0; extIndex < extList.length; extIndex++) {
            if (filename.toLowerCase().endsWith(extList[extIndex])) {
                return true;
            }
        }
        return false;
    },
});
