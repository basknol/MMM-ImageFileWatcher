/* Magic Mirror
 * Module: MMM-ImageFileWatcher
 *
 * By Bas Knol
 * MIT Licensed.
 */

Module.register("MMM-ImageFileWatcher", {
    defaults: {
        imagePaths: [],
        //If zero do nothing, otherwise set height to a pixel value        
        fixedHeight: 500,        
        //If zero do nothing, otherwise set width to a pixel value
        fixedWidth: 0,
        //queue, one_image
        mode: 'queue',
        //Duration to show the images in milliseconds
        showtime: 10 * 1000,
        //Hide modules if we show images
        hideModules: [],
        //List of valid file extensions, seperated by commas
        validImageFileExtensions: 'bmp,jpg,jpeg,gif,png',
        //Process notifications from MMM-PushBulletNotifications
        processPushBulletNotifications: false
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

    start: function () {
        console.log("MMM-ImageFileWatcher module started!");
                
        this.lock = false;
        this.imageList = [];
        this.sendSocketNotification("START", this.config);
	},

    getDom: function () {
        var self = this;
        var wrapper = document.createElement("div");

        //Check if we have images in list and if we are currently not showing an image (=lock)
        if (this.imageList.length > 0 && ((this.lock === false) || (this.config.mode === 'one_image'))) {
            console.log('Setting image');

            //Showing image, set lock
            this.lock = true;

            //Create image element
            var image = document.createElement("img");            

            //Get first image from array
            image.src = this.imageList.shift();

            var imageStyle = '';
            //Set fixed image height
            if (this.config.fixedHeight > 0) {
                imageStyle += 'height:' + this.config.fixedHeight + 'px;';
            }

            //Set fixed image width
            if (this.config.fixedWidth > 0) {
                imageStyle += 'width:' + this.config.fixedWidth + 'px;';
            }

            //Set image style
            if (imageStyle != '') {
                image.style = imageStyle;
            }           

            wrapper.appendChild(image);

            //Hide modules if we need to
            if (self.config.hideModules.length > 0) {
                var hideOptions = { lockString: this.identifier };

                //Loop over modules
                MM.getModules().enumerate(function (module) {
                    //Check if we need to hide module and module is not already hidden
                    if (self.config.hideModules.includes(module.name) && !module.lockStrings.includes(self.identifier)) {
                        //Hide module with lockstring
                        module.hide(0, hideOptions);
                    }
                });
            }

            //Only show item for configured time in queue mode
            if (this.config.mode === 'queue') {
                //Show image for configured time
                this.sleep(this.config.showtime).then(() => {
                    //Finished showing image. Unlock and update DOM
                    self.lock = false;
                    self.updateDom();
                });
            }
        }
        else {
            //Show modules if modules were hidden
            if (self.config.hideModules.length > 0) {
                var showOptions = { lockString: this.identifier };

                //Loop over modules
                MM.getModules().enumerate(function (module) {
                    //Check if module is in hidelist en module is hidden based on lockstring
                    if (self.config.hideModules.includes(module.name) && module.lockStrings.includes(self.identifier)) {
                        //Show module, pass lockstring
                        module.show(1000, showOptions);
                    }
                });
            }
        }

        return wrapper;
    },

    //sleep time expects milliseconds
    sleep: function (time) {    
        return new Promise((resolve) => setTimeout(resolve, time));
    },

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [];
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

    addImage: function (imagePath) {
        if (imagePath) {
            if (this.config.mode === 'one_image') {
                //Clear list
                this.imageList = [];
            }

            //Add image to list
            this.imageList.push(imagePath);

            //Check if image is currently shown, if not update DOM
            if (!this.lock && this.config.mode === 'queue') {
                this.updateDom();
            }
            else if (this.config.mode === 'one_image') {
                this.updateDom();
            }
        }
    },

    socketNotificationReceived: function (notification, payload) {        
        console.log(notification + " " + payload);

        //Image is added to watch folder
        if (notification === "FILE_ADDED") {          
            this.addImage(payload);
        }
    },

    notificationReceived: function (notification, payload, sender) {                        
        //Notification received from MMM-PushBulletNotifications: file uploaded
        if (this.config.processPushBulletNotifications
            && notification === 'PUSHBULLET_FILE_UPLOAD'
            && sender && sender.name === 'MMM-PushBulletNotifications'
            && this.checkValidImageFileExtension(payload.file_name, this.config.validImageFileExtensions)) {
                //Logging
                console.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
                console.log(sender.name + ' file upload: ' + payload.file_name);

                //Add image to list, pass image_url to get online PusBullet image
                this.addImage(payload.image_url);
        }
    },
});
