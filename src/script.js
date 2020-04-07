( function( $, api ) {

	wp.customize.bind( 'ready', function() {

	  let syncedControls = [];

	  // Collect Masters with their Slaves to loop through them
	  api.control.each( function ( control ) {
		if ( control.params.inputAttrs !== undefined ) {
		  let controlHasMaster = control.params.inputAttrs.toString().match(/data-sync-master="(.*?)"/);

		  if ( controlHasMaster ){
			let controlMasterID = controlHasMaster[0].match(/"(.*?)"/)[0].replace(/['"]+/g, '');
			// console.log( 'Sync ' + control.id + ' with ' + controlMasterID );

			syncedControls.push({
			  masterID: controlMasterID,
			  slaveID: control.id,
			});
		  }
		}
	  });

	  // Loop through Masters with Slaves object to set-up syncs for each slave
	  $.each( syncedControls, function( index, sync ) {
		api( sync.masterID, sync.slaveID, function( master, slave ) {
		  let slaveItem           = wp.customize.control( slave.id ),
			  slaveLabel          = slaveItem.params.label,
			  slaveDescription    = slaveItem.params.description,
			  slaveValue          = slave.instance(),
			  masterValue         = master.instance();

		  // Append "Sync-Indicator" link, which focus master control
		  if ( slaveItem.params.choices.type !== 'hidden' ) {

			let append = '<sup class="sync-indicator"><small><a onclick="wp.customize.control(\'' + master.id + '\').focus();"> AUTO </a></small></sup>';

			// Support React- & Non-React controls
			if( $( slaveItem.selector + ' label' ).length ) {
			  	// Works for react field
				if ( slaveLabel !== '' ) {
					$( slaveItem.selector + ' label' ).append(append);
				} else if ( slaveDescription !== '' ) {
					slaveItem.params.description = slaveDescription + append;
				}
			} else {
			  // Kirki Backwards compatibility
			  if ( slaveLabel !== '' ) {
				slaveItem.params.label = slaveLabel + append;
			  } else if ( slaveDescription !== '' ) {
				slaveItem.params.description = slaveDescription + append;
			  }
			}
		  }

		  // Set overwrite if slave is empty
		  let overwrite = slave.instance() === '';

		  // Initially set slave value to master default if empty
		  if ( slave.instance() === '' ) {
			if (overwrite) slave.set( master.instance() );
		  }

		  slave.bind( function() {
			// Keep fields synced (Overwrite) if slave is empty
			overwrite = slave.instance() === '';
			// Keep fields synced if same values
			if ( slave.instance() === master.instance() ) overwrite = true;
			// Unlink slave from master if it is customized
			if ( !overwrite ) slave.unlink( master );
			// Reset to master when resetting field
			if ( slave.instance() === '' ) {
			  slave.set( master.instance() );
			  overwrite = true;
			}
			// Update to new value
			slaveValue = slave.instance();
			// console.log('SLAVE: ' + overwrite + ' ' + slave.instance());

			updateSlave( overwrite, slaveItem );
		  });

		  master.bind( function() {
			// Keep fields synced if same values (check against old value)
			if ( masterValue === slaveValue ) overwrite = true;
			// Link slave with master if overwrite
			if ( overwrite ) slave.link( master );
			// Update to new value
			masterValue = master.instance();
			// console.log('CHANGE: ' + overwrite + ' ' + master.instance());

			// Let's update the slaves
			updateSlave( overwrite, slaveItem );
		  });

		  function updateSlave( overwrite, slaveItem ) {
			if ( overwrite ) {
			  // Switch Sync-Indicator text
			  $(slaveItem.selector).find('.sync-indicator a').text( ' AUTO ' );
			} else {
			  $(slaveItem.selector).find('.sync-indicator a').text( ' CUSTOM ' );
			}
		  }

		});
	  });
	});
  } )( jQuery, wp.customize );
  