'use strict';

// Categories module config
angular.module('similarity').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Similarity', 'similarity', 'dropdown', '/similarity(/create)?');
        Menus.addSubMenuItem('topbar', 'similarity', 'List Similarity Algorithms', 'similarity');
        Menus.addSubMenuItem('topbar', 'similarity', 'New Similarity Algorithm', 'similarity/create');
        Menus.addSubMenuItem('topbar', 'similarity', 'Execute A Similarity Algorithm', 'similarity/send');
	}
]);
