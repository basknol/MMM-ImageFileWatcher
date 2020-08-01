# Module: MMM-ImageFileWatcher

This [MagicMirror²](https://github.com/MichMich/MagicMirror/) module watches one or multiple directories, this module displays an image for a specified number of seconds if an image is added to the watched directory. 
For example an image uploaded via SFTP from your phone.

This module can also show images uploaded to PushBullet on your Mirror. Therefore install the [MMM-PushBulletNotifications](https://github.com/basknol/MMM-PushBulletNotifications) module and add the configuration option `processPushBulletNotifications` (in the MMM-ImageFileWatcher configuration) and set it to `true`.

Inspired by the [MMM-ImageSlideshow](https://github.com/AdamMoses-GitHub/MMM-ImageSlideshow) module created by GitHub user [Adam Moses](https://github.com/AdamMoses-GitHub)

## Dependencies / Requirements

This module uses chokidar (https://github.com/paulmillr/chokidar) to watch if files are added to a directory. Chokidar is a wrapper around node.js fs.watch / fs.watchFile / fsevent. 
Required is that the configured image directories have to be accessible to the Magic Mirror instance to be able to show the images on the Magic Mirror

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/basknol/MMM-ImageFileWatcher.git
````

Go to the MMM-ImageFileWatcher folder:
````
cd MMM-ImageFileWatcher
````

Install necessary dependencies:
````
npm install
````

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-ImageFileWatcher',
		position: 'middle_center',	// This can be any of the regions.		
		config: {
			// See 'Configuration options' for more information.
			imagePaths: ['modules/MMM-ImageFileWatcher/Images']
		}
	}
]
````

## Configuration options

The following properties can be configured:

<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>	
		<tr>
			<td><code>imagePaths</code></td>
			<td>Array value containing strings. Each string should be a path to a directory where image files can be found.<br />
				<br /><b>Example:</b> <code>['modules/MMM-ImageFileWatcher/Images']</code>
				<br />This value is <b>REQUIRED</b>
			</td>
		</tr>		
		<tr>
			<td><code>fixedHeight</code></td>
			<td>Integer value, sets a fixed pixel height for image to be shown. If set to 0, the image's actual height is used.<br />
				<br /><b>Example:</b> <code>300</code>
				<br /><b>Default value:</b> <code>0</code>
				<br />This value is <b>OPTIONAL</b>
			</td>
		</tr>      
		<tr>
			<td><code>fixedWidth</code></td>
			<td>Integer value, sets a fixed pixel width for image to be shown. If set to 0, the image's actual width is used.<br />
				<br /><b>Example:</b> <code>300</code>
				<br /><b>Default value:</b> <code>0</code>
				<br />This value is <b>OPTIONAL</b>
			</td>
		</tr> 
		<tr>
			<td><code>mode</code></td>
			<td>Two possible values: 'queue' or 'one_image'. In queue mode added images are shown one by one and each image is shown for the configured 'showtime'. In one_image mode only one image is shown, this is always the last image added to the directory. The image is directly shown when added to the directory.<br />
				<br /><b>Example:</b> <code>one_image</code>
				<br /><b>Default value:</b> <code>10000queuecode>
				<br />This value is <b>OPTIONAL</b>
			</td>
		</tr>
		<tr>
			<td><code>showtime</code></td>
			<td>Integer value, the length of time to show the image in milliseconds. If multiple images are place in image directories, each image is shown for configured 'showtime'<br />
				<br /><b>Example:</b> <code>5000</code>
				<br /><b>Default value:</b> <code>10000</code>
				<br />This value is <b>OPTIONAL</b>
			</td>
		</tr>
		<tr>
			<td><code>hideModules</code></td>
			<td>Array value containing strings. Each string should be the name of a module to hide when image is shown, this can be used to avoid overlap modules<br />
				<br /><b>Example:</b> <code>['compliments', 'calendar', 'newsfeed']</code>
				<br /><b>Default value:</b> empty array <code>[]</code>
				<br />This value is <b>OPTIONAL</b>
			</td>
		</tr>
        <tr>
			<td><code>validImageFileExtensions</code></td>
			<td>String value, a list of image file extensions, seperated by commas, that should be included. Files found without one of the extensions will be ignored.<br />
				<br /><b>Example:</b> <code>'png,jpg'</code>
				<br /><b>Default value:</b> <code>'bmp,jpg,gif,png'</code>
				<br />This value is <b>OPTIONAL</b>
			</td>
		</tr>   
		<tr>
			<td><code>processPushBulletNotifications</code></td>
			<td>Boolean value, show images uploaded to PushBullet (=true). This requires that the <a href="https://github.com/basknol/MMM-PushBulletNotifications">MMM-PushBulletNotifications</a> is installed.<br />
				<br /><b>Example:</b> <code>true</code>
				<br /><b>Default value:</b> <code>false</code>
				<br />This value is <b>OPTIONAL</b>
			</td>
		</tr>   		
    </tbody>
</table>
