'use strict';

// Categories module config
angular.module('namespaces').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Name Spaces', 'namespaces', 'dropdown', '/namespaces(/create)?');
        Menus.addSubMenuItem('topbar', 'namespaces', 'List Name Spaces', 'namespaces');
        Menus.addSubMenuItem('topbar', 'namespaces', 'New Name Space', 'namespaces/create');
	}
]);
