'use strict';

// Categories module config
angular.module('signatures').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Signatures', 'signatures', 'dropdown', '/signatures(/create)?');
        Menus.addSubMenuItem('topbar', 'signatures', 'List Signature Algorithms', 'signatures');
        Menus.addSubMenuItem('topbar', 'signatures', 'New Signature Algorithm', 'signatures/create');
        Menus.addSubMenuItem('topbar', 'signatures', 'Execute A Signature Algorithm', 'signatures/send');
	}
]);
