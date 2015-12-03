'use strict';

// Categories module config
angular.module('network').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Network', 'network', 'dropdown', '/network(/create)?');
        Menus.addSubMenuItem('topbar', 'network', 'List Network Algorithms', 'network');
        Menus.addSubMenuItem('topbar', 'network', 'New Network Algorithm', 'network/create');
        Menus.addSubMenuItem('topbar', 'network', 'Execute A Network Algorithm', 'network/send');
	}
]);
