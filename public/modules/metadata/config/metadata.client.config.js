'use strict';

// Categories module config
angular.module('metadata').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Metadata', 'metadata', 'dropdown', '/metadata(/create)?');
        Menus.addSubMenuItem('topbar', 'metadata', 'List Metadata Algorithms', 'metadata');
        Menus.addSubMenuItem('topbar', 'metadata', 'New Metadata Algorithm', 'metadata/create');
        Menus.addSubMenuItem('topbar', 'metadata', 'Execute A Metadata Algorithm', 'metadata/send');
	}
]);
