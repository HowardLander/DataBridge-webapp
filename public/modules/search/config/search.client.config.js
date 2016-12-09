'use strict';

// Categories module config
angular.module('search').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Search', 'search', 'dropdown', '/search(/create)?');
        Menus.addSubMenuItem('topbar', 'search', 'Search Existing Networks', 'search');
	}
]);
