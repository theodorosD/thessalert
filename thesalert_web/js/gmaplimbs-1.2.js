/*
 * GMap LIMBs: Labels In the Map Border for Google Maps.
 * Version 1.2
 *   by Stephen Battey
 *
 * http://sourceforge.net/p/gmaplimbs
 * http://www.lucidviews.net/software/gmaplimbs
 * 
 * This library is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; version 3 of the License.
 * 
 * This library is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU General Public License along
 * with the files in this library. If not, see  http://www.gnu.org/licenses
 * Distributed under the GNU Library or Lesser General Public License (LGPL)
 */



/* Create the namespaces used by this JavaScript library. */

if (typeof lucid === "undefined")
{
	/**
	   @namespace
	 */
	lucid = {};
}

if (typeof lucid.maps === "undefined")
{
	/**
	   @namespace
	 */
	lucid.maps = {};
}

if (typeof lucid.maps.geometry === "undefined")
{
	/**
	   @namespace
	 */
	lucid.maps.geometry = {};
}

if (typeof lucid.maps.callout === "undefined")
{
	/**
	   @namespace
	 */
	lucid.maps.callout = {};
}

if (typeof lucid.maps.callout.content === "undefined")
{
	/**
	   @namespace
	 */
	lucid.maps.callout.content = {};
}

if (typeof lucid.maps.limbs === "undefined")
{
	/**
	   @namespace
	 */
	lucid.maps.limbs = {};
}

if (typeof lucid.maps.limbs.layout === "undefined")
{
	/**
	   @namespace
	 */
	lucid.maps.limbs.layout = {};
}

if (typeof lucid.maps.limbs.location === "undefined")
{
	/**
	   @namespace
	 */
	lucid.maps.limbs.location = {};
}

if (typeof lucid.maps.limbs.tooltip === "undefined")
{
	/**
	   @namespace
	 */
	lucid.maps.limbs.tooltip = {};
}

if (typeof lucid.maps.places === "undefined")
{
	/**
	   @namespace
	 */
	lucid.maps.places = {};
}

/**
 * @class
 * Displays a callout using the InfoBox utility (see http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/examples.html)
 * and populates the content of the info box with details read from the Google PlaceResult object.
 * 
 * @constructor
 * @param {lucid.maps.callout.InfoBoxOptions} options  The settings that control the style and content of the info box.
 */
lucid.maps.callout.InfoBox = function( options )
{
	var infoWindow;
	var currentMarker;
	
	
	function init()
	{
		infoWindow = new InfoBox( options );
	}
	
	
	this.add = function( marker )
	{
		marker.infoBoxClickEventListener = google.maps.event.addListener( marker, "click", createClickHandler( marker ) );
	};
	
	this.remove = function( marker )
	{
		if (marker.infoBoxClickEventListener)
		{
			google.maps.event.removeListener( marker.infoBoxClickEventListener );
			marker.infoBoxClickEventListener = null;
		}
		
		if (marker == currentMarker)
		{
			this.close();
		}
	};
	
	this.close = function()
	{
		infoWindow.close();
		currentMarker = null;
	};
	
	function createClickHandler( marker )
	{
		return function()
		{
			infoWindow.close();
			
			currentMarker = marker;
			
			infoWindow.setContent( createInfoBoxContent( marker ) );
			infoWindow.open( marker.getMap(), marker );
		};
	}
	
	function createInfoBoxContent( marker )
	{
		// The inner content is the content for this specific marker ...
		var innerContentDiv = (options.contentCreator) ? options.contentCreator( marker ) : lucid.maps.callout.createContentTitle( marker );
		
		// ... which we wrap in the 'content' CSS to position is correctly in the info box.
		var contentDiv = jQuery( "<div class='content'></div>" );
		contentDiv.append( innerContentDiv );
		
		// We then add the box with the arrow around that content.
		var infoBoxDiv = jQuery( "<div class='custom-info-box'><div class='arrow'></div></div>" );
		infoBoxDiv.append( contentDiv );
		
		return infoBoxDiv[0];
	}
	
	
	init();
};

/**
 * @type {object}
 * @augments InfoBoxOptions (see http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/reference.html#InfoBoxOptions)
 * @property {function} [contentCreator]  The function that creates the content (HTML) for the info box.
 *                                        If left undefined then only the title/name of the place is shown in the info box.
 */
lucid.maps.callout.InfoBoxOptions = {};

/**
 * Create HTML content for a callout that shows the name/title of a marker.
 * Use this function as a contentCreator when creating an {@link lucid.maps.callout.InfoBox} object.
 * 
 * @param {google.maps.Marker} marker  The marker that is the subject of the callout.
 */
lucid.maps.callout.content.createContentTitle = function( marker )
{
	var titleDiv = jQuery( "<div class='place-name'>" + marker.getTitle() + "</div>" );
	
	var contentDiv = jQuery( "<div></div>" );
	contentDiv.append( titleDiv );
	
	return contentDiv;
};

/**
 * Create HTML content for a callout that shows the rating and opening hours a place.
 * Use this function as a contentCreator when creating an {@link lucid.maps.callout.InfoBox} object.
 * 
 * @param {google.maps.Marker} marker  The marker that marks the location of the place.
 *                                     The marker must also have a placeReference property, which holds the uid of the place.
 */
lucid.maps.callout.content.createContentPlaceInfo = function( marker )
{
	var contentDiv = lucid.maps.callout.content.createContentTitle( marker );
	
	var initialMessage;
	if (typeof marker.placeReference !== "undefined")
	{
		initialMessage = "Loading ...";
		requestPlaceDetail();
	}
	else
	{
		initialMessage = "No place ref for marker.";
	}
	
	var infoDiv = jQuery( "<div class='place-info'>" + initialMessage + "</div>" );
	contentDiv.append( infoDiv );
	
	return contentDiv;
	
	
	function requestPlaceDetail()
	{
		var searchService = new google.maps.places.PlacesService( marker.getMap() );
		var placeDetailRequest = { "reference": marker.placeReference };
		searchService.getDetails( placeDetailRequest, processPlaceDetail );
	}
	
	function processPlaceDetail( place, status )
	{
		// TODO Handle non "OK" states.
		
		var placeDetailParser = new lucid.maps.places.PlaceDetailParser( place );
		
		var html = "";
		if (placeDetailParser.hasRating())
		{
			html += "<p>Rating: " + placeDetailParser.getRating() + "</p>";
		}
		if (placeDetailParser.hasOpeningHours())
		{
			html += "<p>" + placeDetailParser.getOpeningHoursToday() + "</p>";
		}
		
		infoDiv.html( html );
	}
};

/**
 * @param {google.maps.Polygon|google.maps.Polyline} poly  The polygon or polyline.
 * @return {google.maps.LatLngBounds}  The bounding box for the polygon or polyline.
 */
lucid.maps.geometry.computeBounds = function( poly )
{
	var polyline = poly.getPath();
	// NB: Polyline and a Polygon both support the 'getPath' method.
	//     In the case of a polygon 'getPath' will return the first path (the exterior path).
	//     We only need to process the exterior path to compute a Polygon's bounds.
	
	var bounds = new google.maps.LatLngBounds();
	
	var points = polyline.getArray();
	for (var i=0; i<points.length; i++)
	{
		bounds.extend( points[i] );
	}
	
	return bounds;
};

/**
 * @param {google.maps.LatLng} from  The point the heading is measured from.
 * @param {google.maps.LatLng} to  The point the heading is measured to.
 * @return {google.maps.LatLng}  The heading from one LatLng to the other, normalised into the range 0 to 360.
 */
lucid.maps.geometry.computeNormalisedHeading = function( from, to )
{
	// TODO Use non-geodesic heading.
	//      I have raised a feature request for this in the Google Maps API: https://code.google.com/p/gmaps-api-issues/issues/detail?id=5928
	var heading = google.maps.geometry.spherical.computeHeading( from, to );

	// The function above can return a negative value. So normalise the value into the range 0 to 360.
	return lucid.maps.geometry.normaliseHeading( heading );
};

/**
 * @param {google.maps.LatLngBounds} boundingBox  The bounding box.
 * @param {number} heading  The heading from the centre of the bounding box.
 *                          The heading must be normalised (i.e. in the range 0 to 360).
 * @return {google.maps.LatLng}  The point on the edge of the bounding box that is on the given heading.
 */
lucid.maps.geometry.computeLatLngBoundsIntersection = function( boundingBox, heading )
{
	var boxWidth = boundingBox.getNorthEast().lng() - boundingBox.getSouthWest().lng();
	var boxHeight = boundingBox.getNorthEast().lat() - boundingBox.getSouthWest().lat();
	
	var intersection = lucid.maps.geometry.computeBoundingBoxIntersection( boxWidth, boxHeight, boundingBox.getCenter().lng(), boundingBox.getCenter().lat(), heading );
	
	return new google.maps.LatLng( intersection.y, intersection.x );
};

/**
 * @param {number} width    The width of the bounding box.
 * @param {number} height   The height of the bounding box.
 * @param {number} centreX  The x coordinate of the centre of the bounding box.
 * @param {number} centreY  The y coordinate of the centre of the bounding box.
 * @param {number} heading  The heading, in degrees, measured clockwise from North. Must be in the range 0 to 360.
 * @return {object}  An object containing the x and y coordinates of the intersection on the edge of the bounding box.
 */
lucid.maps.geometry.computeBoundingBoxIntersection = function( width, height, centreX, centreY, heading )
{
	var angleInRadians = lucid.maps.geometry.convertHeadingToAngle( heading );
	
	return lucid.maps.geometry.computeBoundingBoxIntersectionAtAngle( width, height, centreX, centreY, angleInRadians );
}

/**
 * @param {number} width    The width of the bounding box.
 * @param {number} height   The height of the bounding box.
 * @param {number} centreX  The x coordinate of the centre of the bounding box.
 * @param {number} centreY  The y coordinate of the centre of the bounding box.
 * @param {number} angle    The angle, in radians, measured anti-clockwise from the right (East). Must be in the range 0 to 2PI.
 * @return {object}  An object containing the x and y coordinates of the intersection on the edge of the bounding box.
 */
lucid.maps.geometry.computeBoundingBoxIntersectionAtAngle = function( width, height, centreX, centreY, angle )
{
	// NB: Maps tend to be landscape.
	//     So probability states the heading to a target object will exit through the top or bottom edge of the map.
	
	// Look for an intersection on the top or bottom edge.
	var intersectionY = (angle > Math.PI) ? -(height / 2) : (height / 2);
	var distanceToIntersection = intersectionY / Math.sin( angle );
	var intersectionX = distanceToIntersection * Math.cos( angle );
	
	if (Math.abs( intersectionX ) > (width / 2))
	{
		// The intersection hits the left/right edge before the top/bottom edge.
		// So re-compute the intersection for the left or right edge.
		intersectionX = ((angle > (Math.HALF_PI)) && (angle < (Math.THREE_HALVES_PI))) ? -(width / 2) : (width / 2);
		distanceToIntersection = intersectionX / Math.cos( angle );
		intersectionY = distanceToIntersection * Math.sin( angle );
	}
	
	return { x: centreX + intersectionX,
	         y: centreY + intersectionY };
};

/**
 * Adjust a heading to account for the view of the map being tilted.
 * 
 * @param {number} heading  The heading, in degrees, measured clockwise from North.
 * @param {number} tilt  The angle of incidence of the map, in degrees from the viewport plane to the map plane.
 *                       An angle of 0 indicates the map is being viewed from directly overhead.
 * @return {number}  The angle the heading makes with the viewport.
 */
lucid.maps.geometry.tiltedHeading = function( heading, tilt )
{
	var headingInRadians = lucid.maps.geometry.convertHeadingToAngle( heading );
	
	return lucid.maps.geometry.tiltedAngle( headingInRadians, tilt );
};

/**
 * Adjust an angle to account for the view of the map being tilted.
 * 
 * @param {number} angle  The angle, in radians, measured anti-clockwise from the right (East).
 * @param {number} tilt  The angle of incidence of the map, in degrees from the viewport plane to the map plane.
 *                       An angle of 0 indicates the map is being viewed from directly overhead.
 * @return {number}  The angle the initial angle makes with the viewport.
 */
lucid.maps.geometry.tiltedAngle = function( angle, tilt )
{
	var tiltInRadians = lucid.maps.geometry.convertToRadians( tilt );
	
	var xLength = Math.cos( angle );
	var yLength = Math.sin( angle );
	
	// adjust for the tilt
	yLength = yLength * Math.cos( tiltInRadians );
	
	return Math.vectorAngle( xLength, yLength );
};

/**
 * Convert a heading from degrees to radians.
 * 
 * @param {number} heading  The heading, in degrees, measured clockwise from North.
 * @return {number}  The mathematical angle, in radians, measured anti-clockwise from the right (East).
 */
lucid.maps.geometry.convertHeadingToAngle = function( heading )
{
	return lucid.maps.geometry.convertToRadians( 90 - heading );
};

/**
 * Convert an angle from degrees to radians.
 * 
 * @param {number} angle  The angle in degrees.
 * @return {number}  The angle in radians.
 */
lucid.maps.geometry.convertToRadians = function( angle )
{
	return angle * Math.PI / 180;
};

/**
 * @param {number} heading  The heading, measured in degrees.
 * @return {number}  The heading normalised into the range 0 to 360.
 */
lucid.maps.geometry.normaliseHeading = function( heading )
{
	while (heading > 360)
		heading -= 360;
	while (heading < 0)
		heading += 360;
	
	return heading;
};

/**
 * @param {number} angle  The angle, measured in radians.
 * @return {number}  The angle normalised into the range 0 to 2PI.
 */
lucid.maps.geometry.normaliseAngle = function( angle )
{
	while (angle > Math.TWO_PI)
		angle -= Math.TWO_PI;
	while (angle < 0)
		angle += Math.TWO_PI;
	
	return angle;
};

/**
 * @class
 * Controls behaviour for showing directions to a central destination from various travel points (a.k.a a "how to find us" map).
 * 
 * The controller is configured with options for creating markers, limbs and directions.
 * 
 * Transport links (origins of travel to the destination) are then added using the addTransportLink method. Custom
 * travel options can be supplied to override the default options that were set via the constructor, allowing
 * each transport link to use a different icon, travel mode, etc.
 * 
 * @constructor
 * @param {lucid.maps.limbs.DirectionsControllerOptions} options  Options for the default behaviour of this controller.
 */
lucid.maps.limbs.DirectionsController = function( options )
{
	var map;
	var limbMarkerFactory;
	var directionsRenderer;
	
	
	// This initialise function is called at the end of the constructor.
	function init()
	{
		map = options.map;
		
		
		var markerOptions = { clickHandlerFactory: defaultClickHandlerFactory };
		if (typeof options.markerOptions !== "undefined")
		{
			lucid.maps.limbs.applyMarkerOptions( markerOptions, options.markerOptions );
		}

		var limbOptions = { syncClick: true };
		if (typeof options.limbOptions !== "undefined")
		{
			lucid.maps.limbs.applyLimbOptions( limbOptions, options.limbOptions );
		}

		var factoryOptions = { map: map,
		                       markerOptions: markerOptions,
		                       limbOptions: limbOptions };

		limbMarkerFactory = new lucid.maps.limbs.LimbMarkerFactory( factoryOptions );


		var directionsRendererOptions = { map: map,
		                                  hideRouteList: true,
		                                  routeIndex: 0,
		                                  draggable: false,
		                                  preserveViewport: false,
		                                  suppressMarkers: true,
		                                  suppressInfoWindows: true };

		directionsRenderer = new google.maps.DirectionsRenderer( directionsRendererOptions );
	}

	/**
	 * @param {lucid.maps.limbs.TransportLinkOptions} travelOptions  Options to override the default options passed into the factory's constructor.
	 * @returns {lucid.maps.limbs.Limb}  The LIMB that was created for the new travel point.
	 */
	this.addTransportLink = function( travelOptions )
	{
		var customisedMarkerOptions = (typeof travelOptions.markerOptions === "undefined") ? {} : travelOptions.markerOptions;
		var customisedLimbOptions = (typeof travelOptions.limbOptions === "undefined") ? {} : travelOptions.limbOptions;

		var limb = limbMarkerFactory.addCustomised( customisedMarkerOptions, customisedLimbOptions );
		var marker = limb.getTarget();

		// Build-up the directions options from the raw defaults, the factory defaults and the options passed into this function.
		// Attach those options to the marker so they can be accessed from the marker's click handler.
		marker.directionsOptions = { origin: marker.getPosition(),
		                             provideRouteAlternatives: false };
		if (typeof options.directionOptions !== "undefined")
		{
			lucid.maps.limbs.applyDirectionsOptions( marker.directionsOptions, options.directionOptions );
		}
		if (typeof travelOptions.directionOptions !== "undefined")
		{
			lucid.maps.limbs.applyDirectionsOptions( marker.directionsOptions, travelOptions.directionOptions );
		}

		return limb;
	};


	/**
	 * @param {google.maps.Marker} marker  The marker to create a click-handler for.
	 * @return {function}  A function that handles the click on that marker.
	 */
	function defaultClickHandlerFactory( marker )
	{
		return function()
		{
			// TODO Raise pre event
			
			hidePreviousRoute();
			
			zoomToRoute( marker.getPosition(), marker.directionsOptions.destination );
			
			new google.maps.DirectionsService().route( marker.directionsOptions, showRoute );
			
			// TODO Raise waiting event
		};
	}

	function hidePreviousRoute()
	{
		directionsRenderer.setMap( null );
	}

	function zoomToRoute( origin, destination )
	{
		var routeBounds = new google.maps.LatLngBounds();
		routeBounds = routeBounds.extend( origin );
		routeBounds = routeBounds.extend( destination );

		map.fitBounds( routeBounds );
	}

	function showRoute( directions, status )
	{
		if (status == google.maps.DirectionsStatus.OK)
		{
			directionsRenderer.setDirections( directions );
			directionsRenderer.setMap( map );
		}
		
		// TODO Raise post event
	}


	init();
};

/**
 * @type {object}
 * @property {google.maps.MarkerOptions} [markerOptions]  Settings for the travel-point marker.
 * @property {lucid.maps.limbs.LimbOptions} [limbOptions]  Settings for the travel-point LIMB.
 * @property {google.maps.DirectionsRequest} [directionOptions]  Settings for the directions/route from this travel-point to the destination.
 */
lucid.maps.limbs.TransportLinkOptions = {};

/**
 * @type {object}
 * @augments lucid.maps.limbs.TransportLinkOptions
 * @property {google.maps.Map} map  The map that will show the travel points and directions.
 */
lucid.maps.limbs.DirectionsControllerOptions = {};

/**
 * @class
 * Displays a label on the border of a Google Map.
 * If multiple labels are to be displayed you are recommended to use a LimbFactory.
 * 
 * @constructor
 * @param {lucid.maps.limbs.LimbOptions|google.maps.Marker} optionsOrMarker  Settings for the LIMB to be rendered or the Marker to be tracked.
 */
lucid.maps.limbs.Limb = function( optionsOrMarker )
{
	var thisRenderer = this;
	
	var limbOptions = (optionsOrMarker.constructor == (new google.maps.Marker()).constructor) ? { target: optionsOrMarker } : optionsOrMarker;
	
	var hidden;
	var inTheBorder;
	var target;
	var iconDiv;
	var mapViewChangeListener;
	var syncClickWithTarget;
	var layoutStrategy;
	var locationStrategy;
	var computeLocation;
	var generateTooltip;
	
	
	// This initialise function is called at the end of the constructor.
	function init()
	{
		hidden = limbOptions.hidden;
		target = limbOptions.target;
		syncClickWithTarget = (typeof limbOptions.syncClick === "boolean") ? limbOptions.syncClick : false;
		layoutStrategy = (typeof limbOptions.layout === "object") ? limbOptions.layout : new lucid.maps.limbs.layout.DefaultLayoutStrategy();
		locationStrategy = (typeof limbOptions.location === "object") ? limbOptions.location : new lucid.maps.limbs.location.BoundsEdgeLocationStrategy();
		generateTooltip = (typeof limbOptions.tooltipFactory === "function") ? limbOptions.tooltipFactory : lucid.maps.limbs.tooltip.standardTooltip;
		
		computeLocation = locationStrategy.getMethodForTargetType( target );
		
		if (limbOptions.independent !== false)
		{
			mapViewChangeListener = google.maps.event.addListener( thisRenderer.getMap(), "bounds_changed", handleRefresh );
		}
		
		createIconDiv();
		
		thisRenderer.refresh();
	}
	
	
	/**
	 * Destroy this instance and any associated resources.
	 * This method should be called when the instance is no longer required.
	 */
	this.destroy = function()
	{
		target = null;
		
		if (mapViewChangeListener)
		{
			google.maps.event.removeListener( mapViewChangeListener );
		}
		
		removeIconDiv();
	};
	
	function createIconDiv()
	{
		var icon = getIcon();
		
		iconDiv = jQuery( "<div></div>" );
		iconDiv.css( "background", "url( '" + icon.url + "' ) no-repeat center center" );
		iconDiv.css( "position", "absolute" );
		iconDiv.css( "width", icon.size.width );
		iconDiv.css( "height", icon.size.height );
		iconDiv.css( "zIndex", layoutStrategy.getMinZIndex() );
		iconDiv.hide();
		
		if (limbOptions.clickable !== false)
		{
			iconDiv.css( "cursor", "pointer" );
			iconDiv.click( handleClick );
		}
		
		iconDiv.appendTo( getLimbElement() );
	}
	
	function removeIconDiv()
	{
		if (iconDiv)
		{
			iconDiv.remove();
			iconDiv = null;
		}
	}
	
	/**
	 * Temporarily hide the label.
	 * This does not remove the LIMB, it just takes it off display.
	 * Call this if you hide the map element.
	 */
	this.hide = function()
	{
		hidden = true;
		
		if (iconDiv)
		{
			iconDiv.hide();
		}
	};
	
	/**
	 * Re-display the label after being hidden with a call to 'hide'.
	 */
	this.show = function()
	{
		hidden = false;
		
		if (iconDiv)
		{
			if (inTheBorder === true)
			{
				iconDiv.show();
			}
		}
	};
	
	/**
	 * @return {google.maps.Map}  The map this LIMB is associated with.
	 */
	this.getMap = function()
	{
		return target.getMap();
	};
	
	/**
	 * @return {google.maps.Marker|google.maps.Polyline|google.maps.Polygon|google.maps.Rectangle|google.maps.Circle}  The target this LIMB is associated with.
	 */
	this.getTarget = function()
	{
		return target;
	};
	
	function getTitle()
	{
		if (typeof limbOptions.title !== "undefined")
		{
			return limbOptions.title;
		}
		else if (typeof target.getTitle === "function")
		{
			return target.getTitle();
		}
		else
		{
			// The client app should have defined a title for a non-marker target.
			// Log a message and use a default title to ensure this mistake is visible.
			if (console)
			{
				console.log( "No title defined for LIMB." );
			}
			
			return "<no title>";
		}
	}
	
	function getIcon()
	{
		if (typeof limbOptions.icon !== "undefined")
		{
			return limbOptions.icon;
		}
		else if (typeof target.getIcon === "function")
		{
			return target.getIcon();
		}
		else
		{
			// The client app should have defined an icon for a non-marker target.
			// Use a dummy icon definition. However this won't show a broken image on the page.
			// So log a message to alert the developer to this mistake.
			if (console)
			{
				console.log( "No icon defined for LIMB." );
			}
			
			return { size: new google.maps.Size( 20, 20 ),
			         url: "no_icon.png" };
		}
	}
	
	function getMapElement()
	{
		return jQuery( thisRenderer.getMap().getDiv() );
	}
	
	function getLimbElement()
	{
		return getMapElement().parent();
	}
	
	function handleClick()
	{
		google.maps.event.trigger( thisRenderer, "click", thisRenderer );
		
		if (syncClickWithTarget === true)
		{
			google.maps.event.trigger( target, "click" );
		}
	}
	
	/**
	 * Set whether the click event on the LIMB should cause an effective click on the associated target.
	 * 
	 * @param {boolean} synchonised  Whether the click events should be synchonised.
	 */
	this.setSyncClickWithTarget = function( synchonised )
	{
		syncClickWithTarget = synchonised;
	};
	
	function handleRefresh()
	{
		thisRenderer.refresh();
	}
	
	/**
	 * Refresh the display of the LIMB on the page.
	 */
	this.refresh = function()
	{
		var map = this.getMap();
		var mapElement = getMapElement();
		var mapBounds = map.getBounds();
		
		if (typeof mapBounds === "undefined")
		{
			// The getBounds method returns undefined when the map is still initialising.
			refreshTargetVisible();
			return;
		}
		
		var targetLocation = computeLocation( target, mapBounds );
		if (mapBounds.contains( targetLocation ))
		{
			refreshTargetVisible();
			return;
		}
		else
		{
			refreshTargetOffTheMap();
		}
		
		var viewCentre = map.getCenter();
		var heading = lucid.maps.geometry.computeNormalisedHeading( viewCentre, targetLocation );
		
		var headingAngle = lucid.maps.geometry.convertHeadingToAngle( heading );
		if (map.getTilt() > 0)
		{
			headingAngle = lucid.maps.geometry.tiltedAngle( headingAngle, map.getTilt() );
		}
		headingAngle = lucid.maps.geometry.normaliseAngle( headingAngle );
		
		var mapWidth = mapElement.width();
		var mapHeight = mapElement.height();
		
		var intersection = lucid.maps.geometry.computeBoundingBoxIntersectionAtAngle( mapWidth, mapHeight, 0, 0, headingAngle );
		
		// The intersection coords are relative to the centre of the map.
		// Offset this to an origin in the top-left corner.
		// Also reverse the y-axis (positive values point up the Maths plane, but point down the screen).
		var intersectionFromTopLeft = { x: (mapWidth / 2) + intersection.x,
		                                y: (mapHeight / 2) - intersection.y };
		
		// Centre the icon on that position by applying an offset.
		// TODO Use the target's icon's offset.
		var display = {};
		display.x = Math.round( intersectionFromTopLeft.x - (iconDiv.width() / 2) );
		display.y = Math.round( intersectionFromTopLeft.y - (iconDiv.height() / 2) );
		
		// The origin of these display coords are in the map element.
		// Offset these coords against the mapElement position to position the LIMB correctly on the screen.
		var mapPosition = mapElement.position();
		var outerWidthOffset = ( mapElement.outerWidth( true ) - mapElement.innerWidth() ) / 2;
		var outerHeightOffset = ( mapElement.outerHeight( true ) - mapElement.innerHeight() ) / 2;
		display.x = mapPosition.left + outerWidthOffset + display.x;
		display.y = mapPosition.top + outerHeightOffset + display.y;
		
		var mapDetails = { "viewCentre": viewCentre,
		                   "targetLocation": targetLocation,
		                   "heading": heading };
		
		layoutStrategy.layout( iconDiv, display, mapDetails );
		
		if (limbOptions.clickable !== false)
		{
			var limbLocation = computeLimbLocation();
			var distance = google.maps.geometry.spherical.computeDistanceBetween( limbLocation, targetLocation );
			
			iconDiv.attr( "title", generateTooltip( getTitle(), distance, display, mapDetails ) );
		}
		// else: the LIMB does not respond to mouse hover; a tooltip is not needed
		
		
		function computeLimbLocation()
		{
			// We do this by converting the intersection coords from pixels to distance.
			// This is done by computing the scaling-factor between the element dimensions and the real-world distance.
			var mapHeightDistance = mapBounds.getNorthEast().lat() - mapBounds.getSouthWest().lat();
			var mapHeightScale = mapHeightDistance / mapHeight;
			var limbLocationLat = viewCentre.lat() + (intersection.y * mapHeightScale);
			
			var mapWidthDistance = mapBounds.getNorthEast().lng() - mapBounds.getSouthWest().lng();
			var mapWidthScale = mapWidthDistance / mapWidth;
			var limbLocationLng = viewCentre.lng() + (intersection.x * mapWidthScale);
			
			return new google.maps.LatLng( limbLocationLat, limbLocationLng );
		}
	}
	
	function refreshTargetVisible()
	{
		inTheBorder = false;
		iconDiv.hide();
	}
	
	function refreshTargetOffTheMap()
	{
		inTheBorder = true;
		
		if (hidden === true)
		{
			iconDiv.hide();
		}
		else
		{
			iconDiv.show();
		}
	}
	
	
	init();
};

/**
 * Indicates when the LIMB is clicked.
 *
 * @event lucid.maps.limbs.Limb#click
 * @type {object}
 */

/**
 * @type {object}
 * @property {boolean} [hidden]  Whether the LIMB is initially hidden. If so, it can be made visible with a call to show().
 *                               If not defined, the LIMB is shown by default.
 * @property {boolean} [independent]  Whether this LIMB is independent of a lucid.maps.limbs.LimbFactory.
 *                                    It is more efficient for a group of LIMBs to be managed by a manager, but if
 *                                    a single LIMB is being displayed then the Limb will manage itself if
 *                                    you set this property to true. The default is true.
 * @property {google.maps.Marker|google.maps.Polyline|google.maps.Polygon|google.maps.Rectangle|google.maps.Circle} target  The target on the map which is to be displayed in the map border when the target is outside the map's viewport.
 * @property {string} [title]  Title describing the target location.
 *                             If not defined and the target is a Marker, then the LIMB will use the title of the Marker.
 *                             This property must be defined if the target is not a Marker.
 * @property {google.maps.Icon} [icon]  Icon specification which must contain the URL and size of the icon image to display.
 *                                      If not defined and the target is a Marker, then the LIMB will use the icon of the Marker.
 *                                      This property must be defined if the target is not a Marker.
 * @property {boolean} [clickable]  Whether the icon in the map border is clickable.
 *                                  If not defined, the clickable setting is taken from the target.
 *                                  NOTE: While it is possible to change the clickable setting of google.maps.Marker objects, all other targets default to being clickable.
 * @property {boolean} [syncClick]  Whether to synchronise the click on the LIMB with the same action performed when clicking on the target itself.
 *                                  The effect is to trigger a click event on the target when the LIMB is clicked.
 *                                  NOTE: This will not bring the target into view. You will need to assign another click handler to pan the map.
 *                                  If left undefined, this property defaults to false.
 * @property {lucid.maps.limbs.layout.LayoutStrategy} [layout]  A strategy for positioning the LIMB.
 *                                                              If not defined, a DefaultLayoutStrategy will be used.
 * @property {lucid.maps.limbs.location.LocationStrategy} [location]  A strategy for computing the location of the target.
 *                                                                    If not defined, a BoundsEdgeLocationStrategy will be used.
 * @property {function} [tooltipFactory]  A strategy for generating the tooltip shown when the user mouses-over the LIMB.
 *                                        If not defined, the lucid.maps.limbs.tooltip.standardTooltip tooltip factory will be used.
 *                                        NOTE: A tooltip is only shown if the LIMB is clickable.
 */
lucid.maps.limbs.LimbOptions = {};
// TODO Use the google.maps.Icon to specify the icon graphic - would need to support sprite origin and scaled size. Also read the size from a loaded image if it's not defined.

/**
 * Copy lucid.maps.limbs.LimbOptions from one instance to another.
 * Only the settings defined in the 'optionsToApply' object will be copied onto the 'options' object.
 * 
 * @param {lucid.maps.limbs.LimbOptions} options  The target instance.
 * @param {lucid.maps.limbs.LimbOptions} optionsToApply  Options that take precedence and should be copied into the target object.
 */
lucid.maps.limbs.applyLimbOptions = function( options, optionsToApply )
{
	if (typeof optionsToApply.hidden !== "undefined")
		options.hidden = optionsToApply.hidden;
	
	if (typeof optionsToApply.independent !== "undefined")
		options.independent = optionsToApply.independent;
	
	if (typeof optionsToApply.target !== "undefined")
		options.target = optionsToApply.target;
	
	if (typeof optionsToApply.title !== "undefined")
		options.title = optionsToApply.title;
	
	if (typeof optionsToApply.icon !== "undefined")
		options.icon = optionsToApply.icon;
	
	if (typeof optionsToApply.clickable !== "undefined")
		options.clickable = optionsToApply.clickable;
	
	if (typeof optionsToApply.syncClick !== "undefined")
		options.syncClick = optionsToApply.syncClick;
	
	if (typeof optionsToApply.layout !== "undefined")
		options.layout = optionsToApply.layout;
	
	if (typeof optionsToApply.location !== "undefined")
		options.location = optionsToApply.location;
	
	if (typeof optionsToApply.tooltipFactory !== "undefined")
		options.tooltipFactory = optionsToApply.tooltipFactory;
};

/**
 * @class
 * A factory class for generating LIMBs.
 * This class provides a slight performance gain by refreshing multiple LIMBs within a single event handler when the map moves.
 * This also provides convenience methods for hiding/showing LIMBs as and when the map is hidden or shown.
 * 
 * @constructor
 * @param {google.maps.Map} map  The map that is displaying the LIMBs.
 * @param {lucid.maps.limbs.LimbOptions} [defaultOptions]  Default settings for each LIMB being created by this factory.
 */
lucid.maps.limbs.LimbFactory = function( map, defaultOptions )
{
	var limbs;
	var hidden;
	
	
	// This initialise function is called at the end of the constructor.
	function init()
	{
		limbs = [];
		hidden = false;
		
		google.maps.event.addListener( map, "bounds_changed", handleMapMove );
	}
	
	/* NOTE:
		Desktop browsers trigger the "bounds_changed" event while the map is being panned.
		Mobile browsers wait until the pan is complete. This makes the LIMBs 'sticky'.
		A continuous refresh (using an interval) was trialled but map.getBounds function
		always returns the bounds from when the drag started, not it's current location.
	 */
	
	
	function handleMapMove()
	{
		refresh();
	}
	
	function refresh()
	{
		//var startTimestamp = new Date();
		
		var layout = ( (typeof defaultOptions !== "undefined") && (typeof defaultOptions.layout !== "undefined") )? defaultOptions.layout : null;
		
		if (layout)
			layout.init();
		
		for (var i=0; i<limbs.length; i++)
		{
			limbs[i].refresh();
		}
		
		if (layout)
			layout.complete();
		
		//var duration = new Date().getTime() - startTimestamp.getTime();
		//console.log( "No layout took " + duration + "ms" );
	}
	
	/**
	 * Get this factory to manage a LIMB.
	 * The LIMB should have its "independent" property set to false.
	 * If you don't have an instance of a LIMB, use the create method to create and add a new LIMB object.
	 * 
	 * @param {lucid.maps.limbs.Limb} limb  The LIMB to be managed by this factory.
	 */
	this.add = function( limb )
	{
		limbs[limbs.length] = limb;
	};
	
	/**
	 * Create a new LIMB and manage it.
	 * 
	 * @param {lucid.maps.limbs.LimbOptions|google.maps.Marker} markerOrOptions  Settings for the LIMB to be created. These settings will override the defaultOptions passed into the constructor.
	 *                                                                           Or the Marker to be tracked by the LIMB.
	 * @return {lucid.maps.limbs.Limb}  The LIMB that has been created.
	 */
	this.create = function( markerOrOptions )
	{
		var limbOptions = {};
		
		// Copy across the default options.
		if (typeof defaultOptions !== "undefined")
		{
			lucid.maps.limbs.applyLimbOptions( limbOptions, defaultOptions );
		}
		
		// Override the defaults with options specific to this LIMB.
		if (markerOrOptions.constructor == (new google.maps.Marker()).constructor)
		{
			limbOptions.target = markerOrOptions;
		}
		else
		{
			lucid.maps.limbs.applyLimbOptions( limbOptions, markerOrOptions );
		}
		
		// This class overrides two options with fixed values.
		limbOptions.hidden = hidden;
		limbOptions.independent = false;
		
		var limb = new lucid.maps.limbs.Limb( limbOptions );
		
		this.add( limb );
		
		return limb;
	};
	
	/**
	 * Temporarily hide the labels.
	 * This does not remove the LIMBs and targets, it just takes them off display.
	 * Call this if you hide the map element.
	 */
	this.hide = function()
	{
		hidden = true;
		
		for (var i=0; i<limbs.length; i++)
		{
			limbs[i].hide();
		}
	};
	
	/**
	 * Re-display the labels after being hidden with a call to 'hide'.
	 */
	this.show = function()
	{
		hidden = false;
		
		for (var i=0; i<limbs.length; i++)
		{
			limbs[i].show();
		}
	};
	
	/**
	 * Remove all LIMBs from this collection.
	 * The LIMB will still exist, it just won't be managed by this container anymore.
	 */
	this.removeAll = function()
	{
		limbs = [];
	};
	
	/**
	 * Destroy all the LIMBs in this collection.
	 * The LIMB will be removed from the page.
	 */
	this.destroyAll = function()
	{
		for (var i=0; i<limbs.length; i++)
		{
			limbs[i].destroy();
			limbs[i] = null;
		}
		limbs = [];
	};
	
	
	init();
};

/**
 * @class
 * Manages {lucid.maps.limbs.Limb}s for a set of markers.
 * This class will create the google.maps.Marker instance on the map as well as the associated LIMB.
 * An info-box can optionally be associated with the factory, which displays information about the marker.
 *
 * @constructor
 * @param {lucid.maps.limbs.LimbMarkerFactoryOptions} options  The factory options.
 */
lucid.maps.limbs.LimbMarkerFactory = function( options )
{
	var markers;
	var limbs;
	
	
	// This initialise function is called at the end of the constructor.
	function init()
	{
		var defaultLimbOptions = (typeof options.limbOptions !== "undefined") ? options.limbOptions : {};
		
		markers = [];
		limbs = new lucid.maps.limbs.LimbFactory( options.map, defaultLimbOptions );
	}
	
	
	/**
	 * Remove all markers and LIMBs created by this manager.
	 */
	this.removeAll = function()
	{
		for (var i=0; i<markers.length; i++)
		{
			if (typeof options.infoBox !== "undefined")
				options.infoBox.remove( markers[i] );
			
			markers[i].setMap( null );
			markers[i] = null;
		}
		markers = [];
		
		limbs.destroyAll();
	};
	
	/**
	 * Add a new marker and a LIMB to the map.
	 * The map instance and label styling are set in the options passed into the manager's constructor.
	 * 
	 * @param {google.maps.LatLng} position  The location to be marked.
	 * @param {string} title  The name/title of the location. Used as the title of the marker created on the map.
	 * @return {lucid.maps.limbs.Limb}  The limb that has been created.
	 */
	this.add = function( position, title )
	{
		var customMarkerOptions = { position: position,
		                            title: title };
		
		var customLimbOptions = {};
		
		return this.addCustomised( customMarkerOptions, customLimbOptions );
	};
	
	/**
	 * Add a new marker and a LIMB to the map.
	 * NB: The map and label styling are set in the options passed into the manager's constructor.
	 * 
	 * @param {google.maps.MarkerOptions} customisedMarkerOptions  Selected settings of the marker to be overriden from the options passed into the constructor.
	 * @param {lucid.maps.limbs.LimbOptions} customisedLimbOptions  Selected settings of the LIMB to be overriden from the options passed into the constructor.
	 * @return {lucid.maps.limbs.Limb}  The limb that has been created.
	 */
	this.addCustomised = function( customisedMarkerOptions, customisedLimbOptions )
	{
		// Create the marker, taking into account the default marker options set into this instance
		// and the custom marker options in the function call.
		var markerOptions = {};
		lucid.maps.limbs.applyMarkerOptions( markerOptions, options.markerOptions );
		lucid.maps.limbs.applyMarkerOptions( markerOptions, customisedMarkerOptions );
		markerOptions.map = options.map;
		
		var marker = new google.maps.Marker( markerOptions );
		
		if (typeof options.infoBox !== "undefined")
		{
			options.infoBox.add( marker );
		}
		
		if (typeof markerOptions.clickHandlerFactory === "function")
		{
			google.maps.event.addListener( marker, "click", markerOptions.clickHandlerFactory( marker ) );
		}
		
		markers[markers.length] = marker;
		
		
		customisedLimbOptions.target = marker;
		
		return limbs.create( customisedLimbOptions );
	};
	
	/**
	 * Zoom and pan the map so that all markers are in view.
	 * You can optionally specify additional locations to be included in the map view by setting LatLng in the options parameter.
	 *
	 * @param {object} zoomOptions
	 * @param {google.maps.LatLng[]} [zoomOptions.additionalLocations]  Locations, in addition to the markers, which should be kept in view when the map view is changed.
	 */
	this.zoomToAll = function( zoomOptions )
	{
		var locations = [];
		
		for (var i=0; i<markers.length; i++)
		{
			locations[locations.length] = markers[i].getPosition();
		}
		
		if (zoomOptions.additionalLocations)
		{
			for (var i=0; i<zoomOptions.additionalLocations.length; i++)
			{
				locations[locations.length] = zoomOptions.additionalLocations[i];
			}
		}
		
		if (locations.length > 0)
		{
			var bounds = new google.maps.LatLngBounds( locations[0], locations[0] );
			for (var i=0; i<locations.length; i++)
			{
				bounds = bounds.extend( locations[i] );
			}
			
			options.map.fitBounds( bounds );
		}
	};
	
	/**
	 * Temporarily hide the labels.
	 * This does not remove the LIMBs and markers, it just takes them off display.
	 * Call this if you hide the map element.
	 */
	this.hide = function()
	{
		limbs.hide();
		// NB: The markers are part of the map and should be hidden by hiding the map element.
	};
	
	/**
	 * Re-display the labels after being hidden with a call to 'hide'.
	 */
	this.show = function()
	{
		limbs.show();
		// NB: The markers are part of the map and should be shown by showing the map element.
	};
	
	/**
	 * Destroy this instance and any associated resources.
	 * This method should be called when the instance is no longer required.
	 */
	this.destroy = function()
	{
		this.removeAll();
	};
	
	/**
	 * @return {number}  The total number of places being labelled (includes any labels currently being hidden).
	 */
	this.getNumberOfMarkers = function()
	{
		return markers.length;
	};
	
	
	init();
};


/**
 * @type {object}
 * @property {google.maps.Map} map  The map the markers and LIMBs are to be associated with.
 * @property {google.maps.MarkerOptions} markerOptions  The settings for the marker shown on the map for these labels.
 *                                                      The LimbMarkerFactory will ignore the position property. This will be set when the places are added with a call to addPlaces.
 * @property {lucid.maps.limbs.LimbOptions} [limbOptions] The settings for the LIMB shown on the map for these labels.
 *                                                        The LimbMarkerFactory will ignore the marker property. This will be set to the place's marker.
 *                                                        The LimbMarkerFactory will ignore the independent property. This will always be false.
 *                                                        If undefined the LIMB will take its styling from the marker.
 * @property {lucid.maps.limbs.InfoBox} [infoBox]  The class that displays an info box when the user clicks on the label.
 *                                                 Leave undefined if no info box should appear.
 */
lucid.maps.limbs.LimbMarkerFactoryOptions = {};

/**
 * Copy google.maps.MarkerOptions from one instance to another.
 * Only the settings defined in the 'optionsToApply' object will be copied onto the 'options' object.
 * 
 * @param {google.maps.MarkerOptions} options  The target instance.
 * @param {google.maps.MarkerOptions} optionsToApply  Options that take precedence and should be copied into the target object.
 */
lucid.maps.limbs.applyMarkerOptions = function( options, optionsToApply )
{
	if (typeof optionsToApply.anchorPoint !== "undefined")
		options.anchorPoint = optionsToApply.anchorPoint;
	
	if (typeof optionsToApply.animation !== "undefined")
		options.animation = optionsToApply.animation;
	
	if (typeof optionsToApply.clickable !== "undefined")
		options.clickable = optionsToApply.clickable;
	
	if (typeof optionsToApply.crossOnDrag !== "undefined")
		options.crossOnDrag = optionsToApply.crossOnDrag;
	
	if (typeof optionsToApply.cursor !== "undefined")
		options.cursor = optionsToApply.cursor;
	
	if (typeof optionsToApply.draggable !== "undefined")
		options.draggable = optionsToApply.draggable;
	
	if (typeof optionsToApply.flat !== "undefined")
		options.flat = optionsToApply.flat;
	
	if (typeof optionsToApply.icon !== "undefined")
		options.icon = optionsToApply.icon;
	
	if (typeof optionsToApply.map !== "undefined")
		options.map = optionsToApply.map;
	
	if (typeof optionsToApply.optimized !== "undefined")
		options.optimized = optionsToApply.optimized;
	
	if (typeof optionsToApply.position !== "undefined")
		options.position = optionsToApply.position;
	
	if (typeof optionsToApply.raiseOnDrag !== "undefined")
		options.raiseOnDrag = optionsToApply.raiseOnDrag;
	
	if (typeof optionsToApply.shadow !== "undefined")
		options.shadow = optionsToApply.shadow;
	
	if (typeof optionsToApply.shape !== "undefined")
		options.shape = optionsToApply.shape;
	
	if (typeof optionsToApply.title !== "undefined")
		options.title = optionsToApply.title;
	
	if (typeof optionsToApply.visible !== "undefined")
		options.visible = optionsToApply.visible;
	
	if (typeof optionsToApply.zIndex !== "undefined")
		options.zIndex = optionsToApply.zIndex;
	
	if (typeof optionsToApply.clickHandlerFactory !== "undefined")
		options.clickHandlerFactory = optionsToApply.clickHandlerFactory;
};

/* TODO Move these 'apply' functions into a separate JS file. */

/**
 * Copy google.maps.DirectionsRequest from one instance to another.
 * Only the settings defined in the 'optionsToApply' object will be copied onto the 'options' object.
 * 
 * @param {google.maps.DirectionsRequest} options  The target instance.
 * @param {google.maps.DirectionsRequest} optionsToApply  Options that take precedence and should be copied into the target object.
 */
lucid.maps.limbs.applyDirectionsOptions = function( options, optionsToApply )
{
	if (typeof optionsToApply.avoidHighways !== "undefined")
		options.avoidHighways = optionsToApply.avoidHighways;

	if (typeof optionsToApply.avoidTolls !== "undefined")
		options.avoidTolls = optionsToApply.avoidTolls;

	if (typeof optionsToApply.destination !== "undefined")
		options.destination = optionsToApply.destination;

	if (typeof optionsToApply.durationInTraffic !== "undefined")
		options.durationInTraffic = optionsToApply.durationInTraffic;

	if (typeof optionsToApply.optimizeWaypoints !== "undefined")
		options.optimizeWaypoints = optionsToApply.optimizeWaypoints;

	if (typeof optionsToApply.origin !== "undefined")
		options.origin = optionsToApply.origin;

	if (typeof optionsToApply.provideRouteAlternatives !== "undefined")
		options.provideRouteAlternatives = optionsToApply.provideRouteAlternatives;

	if (typeof optionsToApply.region !== "undefined")
		options.region = optionsToApply.region;

	if (typeof optionsToApply.transitOptions !== "undefined")
		options.transitOptions = optionsToApply.transitOptions;

	if (typeof optionsToApply.travelMode !== "undefined")
		options.travelMode = optionsToApply.travelMode;

	if (typeof optionsToApply.unitSystem !== "undefined")
		options.unitSystem = optionsToApply.unitSystem;

	if (typeof optionsToApply.waypoints !== "undefined")
		options.waypoints = optionsToApply.waypoints;
};

/**
 * @class
 * Manages {lucid.maps.limbs.Limb}s for a set of markers.
 * This class will create the google.maps.Marker instance on the map as well as the associated LIMB.
 *
 * @constructor
 * @param {lucid.maps.limbs.LimbMarkerPlacesFactoryOptions} options  The factory options.
 */
lucid.maps.limbs.LimbMarkerPlacesFactory = function( options )
{
	lucid.maps.limbs.LimbMarkerFactory.apply( this, [options] );
	
	var super_ = { zoomToAll: this.zoomToAll,
	               add: this.add,
	               addCustomised: this.addCustomised };
	
	// The zoom level used when the user clicks for info on a place.
	// This is only used when the map is zoomed out to show all places.
	// If the user has zoomed in to a custom zoom level then their custom zoom is preserved in that instance.
	var selectPlaceZoomLevel;
	var zoomedToAll;
	
	
	// This initialise function is called at the end of the constructor.
	function init()
	{
		selectPlaceZoomLevel = (typeof options.zoomLevelWhenSelected === "undefined") ? 16 : options.zoomLevelWhenSelected;
		zoomedToAll = false;
		
		google.maps.event.addListener( options.map, "zoom_changed", handleZoomChanged );
	}
	
	
	function handleZoomChanged()
	{
		// The map is now at a user-chosen zoom level.
		zoomedToAll = false;
	}
	
	function configurePlacesMarker( limb, placeReference )
	{
		if (typeof placeReference !== "undefined")
		{
			limb.getTarget().placeReference = placeReference;
		}
	}
	
	/**
	 * Add a new marker and a LIMB to the map.
	 * The map instance and label styling are set in the options passed into the manager's constructor.
	 * 
	 * @param {google.maps.LatLng} position  The location to be marked.
	 * @param {string} title  The name/title of the location. Used as the title of the marker created on the map.
	 * @param {string} [placeReference]  Optionally associated the marker with a place using the place reference.
	 * @return {lucid.maps.limbs.Limb}  The limb that has been created.
	 */
	this.add = function( position, title, placeReference )
	{
		var limb = super_.add.apply( this, [position, title] );
		
		configurePlacesMarker( limb, placeReference );
		
		return limb;
	};
	
	/**
	 * Add a new marker and a LIMB to the map.
	 * The map instance and label styling are set in the options passed into the manager's constructor.
	 * 
	 * @param {google.maps.MarkerOptions} customisedMarkerOptions  Selected settings of the marker to be overriden from the options passed into the constructor.
	 * @param {lucid.maps.limbs.LimbOptions} customisedLimbOptions  Selected settings of the LIMB to be overriden from the options passed into the constructor.
	 * @param {string} [placeReference]  Optionally associate the marker with a place using the place reference.
	 * @return {lucid.maps.limbs.Limb}  The limb that has been created.
	 */
	this.addCustomised = function( customisedMarkerOptions, customisedLimbOptions, placeReference )
	{
		if (typeof customisedMarkerOptions.clickHandlerFactory === "undefined")
		{
			customisedMarkerOptions.clickHandlerFactory = defaultClickHandlerFactory;
		}
		
		var limb = super_.addCustomised.apply( this, [customisedMarkerOptions, customisedLimbOptions] );
		
		configurePlacesMarker( limb, placeReference );
		
		return limb;
	};

	function defaultClickHandlerFactory( marker )
	{
		return function()
		{
			if (zoomedToAll === true)
			{
				if (selectPlaceZoomLevel != null)
				{
					options.map.setZoom( selectPlaceZoomLevel );
				}
				// else: the zoom is turned off
			}
			// else: keep the map at the user-chosen zoom level
			
			if (typeof options.infoBox === "undefined")
			{
				options.map.setCenter( marker.getPosition() );
			}
			// else: The info box will appear when the marker is clicked.
			//       Let the map be centred around the info box.
		}
	}
	
	/**
	 * Zoom and pan the map so that all markers are in view.
	 * You can optionally specify additional locations to be included in the map view by setting LatLng in the options parameter.
	 *
	 * @param {object} zoomOptions
	 * @param {google.maps.LatLng[]} [zoomOptions.additionalLocations]  Locations, in addition to the markers, which should be kept in view when the map view is changed.
	 */
	this.zoomToAll = function( zoomOptions )
	{
		super_.zoomToAll.apply( this, [zoomOptions] );
		
		zoomedToAll = true;
	};
	
	
	init();
};


/**
 * @type {object}
 * @augments lucid.maps.limbs.LimbMarkerFactoryOptions
 * @property {number} [zoomLevelWhenSelected]  The zoom level to be used when a marker is clicked.
 *                                             Set this to null if you do not want the zoom to change.
 *                                             Defaults to 16 if not defined.
 */
lucid.maps.limbs.LimbMarkerPlacesFactoryOptions = {};

/**
 * @class
 * A layout strategy that simply positions elements in their default position.
 * There is no logic to avoid overlapping elements or to sort in z-order.
 * You do not need to call the start and stop methods on this LayoutStrategy.
 */
lucid.maps.limbs.layout.DefaultLayoutStrategy = function()
{
	lucid.maps.limbs.layout.LayoutStrategy.apply( this, [ {} ] );
	
	
	this.layout = function( div, position, mapDetails )
	{
		div.css( "left", position.x );
		div.css( "top", position.y );
		div.css( "zIndex", this.getMinZIndex() );
	};
	
};

/**
 * @class
 * A strategy class for applying a layout to the LIMB elements.
 * 
 * The layout strategy is primarily responsible for handling overlapping LIMBs. When two or more
 * LIMBs overlap it can adjust their position to prevent overlap or group them together and show
 * an aggregated icon.
 * 
 * This base class does nothing. Use one of the concrete sub-classes, e.g. DefaultLayoutStrategy.
 * 
 * @constructor
 * @param {lucid.maps.limbs.layout.LayoutStrategyOptions} options  The options controlling the layout.
 */
lucid.maps.limbs.layout.LayoutStrategy = function( options )
{
	
	this.init = function()
	{
	};
	
	this.layout = function( div, position, mapDetails )
	{
	};
	
	this.complete = function()
	{
	};
	
	this.getMaxZIndex = function()
	{
		return (typeof options.maxZ === "number") ? options.maxZ : 600;
	}
	
	this.getMinZIndex = function()
	{
		return (typeof options.minZ === "number") ? options.minZ : 500;
	}
	
};


/**
 * @type {object}
 * @property {number} [maxZ]  The maximum z-index to be applied to the LIMB DOM element.
 *                            The maximum z-index is applied to features nearest to the map view.
 *                            If not defined, a default value of 600 is used.
 * @property {number} [minZ]  The minimum z-index to be applied to the LIMB DOM element.
 *                            The minimum z-index is applied to features furthest from the map view.
 *                            If not defined, a default value of 500 is used.
 */
lucid.maps.limbs.layout.LayoutStrategyOptions = {};

/**
 * @class
 * A strategy that orders the z-index of all LIMBs according to the distance to the target.
 * LIMBs representing targets that are closest to the map will be shown above those that are further away.
 * 
 * @constructor
 * @param {lucid.maps.limbs.layout.OrderedLayoutStrategyOptions} options  The options controlling the layout.
 */
lucid.maps.limbs.layout.OrderedLayoutStrategy = function( options )
{
	lucid.maps.limbs.layout.LayoutStrategy.apply( this, [options] );

	
	var limbs;
	var maxDistance;
	
	
	this.layout = function( div, position, mapDetails )
	{
		var distance = google.maps.geometry.spherical.computeDistanceBetween( mapDetails.viewCentre, mapDetails.targetLocation );
		
		if (distance > maxDistance)
		{
			maxDistance = distance;
		}
		
		limbs[limbs.length] = { element: div,
		                        position: position,
		                        distance: distance };
	};
	
	this.init = function()
	{
		limbs = [];
		maxDistance = 0;
	};
	
	this.complete = function()
	{
		var zIndexMin = this.getMinZIndex();
		var zIndexMax = this.getMaxZIndex();
		var zIndexRange = zIndexMax - zIndexMin;
		var zIndexDistanceRatio = zIndexRange / maxDistance;
		
		for (var i=0; i<limbs.length; i++)
		{
			var limb = limbs[i];
			
			limb.element.css( "left", limb.position.x );
			limb.element.css( "top", limb.position.y );
			limb.element.css( "zIndex", computeLimbElementZIndex( limb.distance ) );
		}
		
		limbs = null;
		maxDistance = null;
		
		function computeLimbElementZIndex( distance )
		{
			return Math.floor( zIndexMax - (zIndexDistanceRatio * distance) );
		}
	};
	
};


/**
 * @type {object}
 * @augments lucid.maps.limbs.layout.LayoutStrategyOptions
 */
lucid.maps.limbs.layout.OrderedLayoutStrategyOptions = {};

/**
 * @class
 * A strategy that orders the z-index of any LIMBs that are overlapping.
 * LIMBs representing targets that are closest to the map will be shown above those that are further away.
 * 
 * @constructor
 * @param {lucid.maps.limbs.layout.ZShiftedLayoutStrategyOptions} options  The options controlling the layout.
 */
lucid.maps.limbs.layout.ZShiftedLayoutStrategy = function( options )
{
	lucid.maps.limbs.layout.LayoutStrategy.apply( this, [options] );

	
	var limbs;
	var super_ = this.createSuperReferences();
	
	
	this.layout = function( div, position, mapDetails )
	{
		super_.layout( div, position, mapDetails );
		
		limbs[limbs.length] = { element: div,
		                        position: position,
		                        mapDetails: mapDetails };
	};
	
	this.init = function()
	{
		super_.init();
		
		limbs = [];
	};
	
	this.complete = function()
	{
		var zIndexMin = this.getMinZIndex();
		var zIndexMax = this.getMaxZIndex();
		var zIndexRange = zIndexMax - zIndexMin;
		var zIndexDistanceRatio;
		
		var overlappingLimbs;
		
		for (var i=0; i<limbs.length; i++)
		{
			var limb = limbs[i];
			if (limb !== null)
			{
				// For each LIMB we're going to look for overlapping LIMBs.
				
				overlappingLimbs = [];
				
				// Remove the original LIMB from the array now.
				// Otherwise we will encounter infinite recursion when we look for LIMBs that overlap the overlapping LIMBs.
				moveLimbIntoOverlappingArray( limb, i );
				
				lookForOverlappingLimbs( limb );
				
				if (overlappingLimbs.length === 1)
				{
					// No overlapping LIMBs. The basic position is fine.
					
					limb.element.css( "left", limb.position.x );
					limb.element.css( "top", limb.position.y );
				}
				else
				{
					computeZIndexDistanceRatio();
					
					for (var j=0; j<overlappingLimbs.length; j++)
					{
						var overlappingLimb = overlappingLimbs[j];
						
						overlappingLimb.element.css( "left", overlappingLimb.position.x );
						overlappingLimb.element.css( "top", overlappingLimb.position.y );
						overlappingLimb.element.css( "zIndex", computeLimbElementZIndex( overlappingLimb.distance ) );
					}
				}
			}
		}
		
		limbs = null;
		
		super_.complete();
		
		
		function lookForOverlappingLimbs( limb )
		{
			for (var i=0; i<limbs.length; i++)
			{
				var otherLimb = limbs[i];
				if (otherLimb !== null)
				{
					if (isOverlappingLimb( limb.element, otherLimb.element ))
					{
						moveLimbIntoOverlappingArray( otherLimb, i );
						
						lookForOverlappingLimbs( otherLimb );
					}
				}
			}
		}
		
		function isOverlappingLimb( limb, otherLimb )
		{
			// http://stackoverflow.com/questions/14012766/detecting-whether-two-divs-overlap
		      var x1 = limb.offset().left;
		      var y1 = limb.offset().top;
		      var h1 = limb.outerHeight(true);
		      var w1 = limb.outerWidth(true);
		      var b1 = y1 + h1;
		      var r1 = x1 + w1;
		      var x2 = otherLimb.offset().left;
		      var y2 = otherLimb.offset().top;
		      var h2 = otherLimb.outerHeight(true);
		      var w2 = otherLimb.outerWidth(true);
		      var b2 = y2 + h2;
		      var r2 = x2 + w2;

		      if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
		      return true;
		}
		
		function moveLimbIntoOverlappingArray( limb, limbIndex )
		{
			limbs[limbIndex] = null;
			overlappingLimbs[overlappingLimbs.length] = limb;
		}
		
		function computeZIndexDistanceRatio()
		{
			var maxDistance = 0;
			
			for (var i=0; i<overlappingLimbs.length; i++)
			{
				var limb = overlappingLimbs[i];
				
				limb.distance = google.maps.geometry.spherical.computeDistanceBetween( limb.mapDetails.viewCentre, limb.mapDetails.targetLocation );
				
				if (limb.distance > maxDistance)
				{
					maxDistance = limb.distance;
				}
			}
			
			zIndexDistanceRatio = zIndexRange / maxDistance;
		}
		
		function computeLimbElementZIndex( distance )
		{
			return Math.floor( zIndexMax - (zIndexDistanceRatio * distance) );
		}
	};
	
};


/**
 * @type {object}
 * @augments lucid.maps.limbs.layout.LayoutStrategyOptions
 */
lucid.maps.limbs.layout.ZShiftedLayoutStrategyOptions = {};

/**
 * @class
 * A location strategy that uses the corner or an edge-centre-point of the target's bounding box.
 * 
 * This location strategy takes the bounding box of the target shape
 * and determines which corner or edge of the bounding box is nearest the map viewport.
 * 
 * The point location of the 2D shape is taken to be either the closest corner or
 * a point along the nearest edge of the bounding box.
 * 
 * @constructor
 * @param {lucid.maps.limbs.location.CentreLocationStrategyOptions} options  The options controlling the location calculation.
 */
lucid.maps.limbs.location.BoundsEdgeLocationStrategy = function( options )
{
	lucid.maps.limbs.location.LocationStrategy.apply( this, [ options ] );
	
	
	this.computeMarkerLocation = function( target, mapBounds )
	{
		// Markers are a special case.
		// Don't use the bounds. Simply use the position of the marker.
		return target.getPosition();
	};
	
	this.computePolylineLocation = function( target, mapBounds )
	{
		var targetBounds = lucid.maps.geometry.computeBounds( target );
		
		return nearestCornerOrEdgePoint( targetBounds, mapBounds );
	};
	
	this.computePolygonLocation = function( target, mapBounds )
	{
		var targetBounds = lucid.maps.geometry.computeBounds( target );
		
		return nearestCornerOrEdgePoint( targetBounds, mapBounds );
	};
	
	this.computeRectangleLocation = function( target, mapBounds )
	{
		return nearestCornerOrEdgePoint( target.getBounds(), mapBounds );
	};
	
	this.computeCircleLocation = function( target, mapBounds )
	{
		return nearestCornerOrEdgePoint( target.getBounds(), mapBounds );
	};
	
	
	/**
	 * Determine in which of eight zones (N, NE, E, SE, S, SW, W, NW) the target object lies.
	 * Then calculate the nearest corner point or point along the nearest edge to the map view.
	 * 
	 * When the target lies beyond the corner of the map (NE, NW, SE, SW)
	 * then the corner of the target's bounding box is used as the 'nearest' point.
	 * 
	 * When the target lies beyond the side of the map (N, S, E, W)
	 * then a point on the closest edge of bounding box is used as the 'nearest' point.
	 * 
	 * @param {google.maps.LatLngBounds} targetBounds  The bounds of the target object.
	 * @param {google.maps.LatLngBounds} mapBounds  The bounds of the current map view.
	 * @return {google.maps.LatLng}  The point on the target bounds that is closest to the map bounds.
	 */
	function nearestCornerOrEdgePoint( targetBounds, mapBounds )
	{
		var targetLiesNorth = (targetBounds.getSouthWest().lat() > mapBounds.getNorthEast().lat());
		var targetLiesSouth = (targetBounds.getNorthEast().lat() < mapBounds.getSouthWest().lat());
		var targetLiesEast  = (targetBounds.getSouthWest().lng() > mapBounds.getNorthEast().lng());
		var targetLiesWest  = (targetBounds.getNorthEast().lng() < mapBounds.getSouthWest().lng());
		
		
		if (targetLiesNorth && targetLiesEast)
		{
			// South west corner.
			return targetBounds.getSouthWest();
		}
		if (targetLiesNorth && targetLiesWest)
		{
			// South east corner.
			return new google.maps.LatLng( targetBounds.getSouthWest().lat(), targetBounds.getNorthEast().lng() );
		}
		if (targetLiesSouth && targetLiesEast)
		{
			// North west corner.
			return new google.maps.LatLng( targetBounds.getNorthEast().lat(), targetBounds.getSouthWest().lng() );
		}
		if (targetLiesSouth && targetLiesWest)
		{
			// North east corner.
			return targetBounds.getNorthEast();
		}
		
		
		if (targetLiesNorth)
		{
			// Centre of the southern edge.
			return new google.maps.LatLng( targetBounds.getSouthWest().lat(), computeHorizontalEdgeXCoordinate( targetBounds, mapBounds ) );
		}
		if (targetLiesSouth)
		{
			// Centre of the northern edge.
			return new google.maps.LatLng( targetBounds.getNorthEast().lat(), computeHorizontalEdgeXCoordinate( targetBounds, mapBounds ) );
		}
		if (targetLiesEast)
		{
			// Centre of the western edge.
			return new google.maps.LatLng( computeVerticalEdgeYCoordinate( targetBounds, mapBounds ), targetBounds.getSouthWest().lng() );
		}
		if (targetLiesWest)
		{
			// Centre of the eastern edge.
			return new google.maps.LatLng( computeVerticalEdgeYCoordinate( targetBounds, mapBounds ), targetBounds.getNorthEast().lng() );
		}
		
		
		// Finally, if the shape lies in none of the directions then it must be in the map view.
		return mapBounds.getCenter();
	}
	
	/* Implementation Note
	 * 
	 * Using the centre of an edge causes the LIMB to jump when the target moves from a 'side zone' into a 'corner zone'.
	 * This is because the centre of the closest edge (used when the target is in a 'side zone') is much further away than
	 * the corner point (used when the target is in a 'corner zone').
	 * As the target transitions between the two zones the LIMB jumps backwards.
	 * 
	 * To avoid this we don't use the centre of the edge.
	 * We take the section of the edge that overlaps the edge of the map. We then use the centre point of this section
	 * of the bounding box's edge.
	 * As the bounding box moves towards a corner of the map the edge that overlaps shrinks until all that remains is the corner point
	 * of the bounding box. This ensures a smooth tansition into the 'corner zone' where the corner point is used as the target location.
	 */
	
	/**
	 * Determine an 'appropriate' point along the horizontal edge of the target bounds.
	 * 
	 * @param {google.maps.LatLngBounds} targetBounds  The bounds of the target object.
	 * @param {google.maps.LatLngBounds} mapBounds  The bounds of the current map view.
	 * @return {number}  The x-coordinate along the horizontal edge of the target bounds that is closest to the map bounds.
	 */
	function computeHorizontalEdgeXCoordinate( targetBounds, mapBounds )
	{
		var mapWestCoord = mapBounds.getSouthWest().lng();
		var mapEastCoord = mapBounds.getNorthEast().lng();
		
		var targetWestCoord = targetBounds.getSouthWest().lng();
		var targetEastCoord = targetBounds.getNorthEast().lng();
		
		var overlappingWestCoord = (mapWestCoord > targetWestCoord) ? mapWestCoord : targetWestCoord;
		var overlappingEastCoord = (mapEastCoord < targetEastCoord) ? mapEastCoord : targetEastCoord;
		
		return (overlappingWestCoord + overlappingEastCoord) / 2;
	}
	
	/**
	 * Determine an 'appropriate' point along the vertical edge of the target bounds.
	 * 
	 * @param {google.maps.LatLngBounds} targetBounds  The bounds of the target object.
	 * @param {google.maps.LatLngBounds} mapBounds  The bounds of the current map view.
	 * @return {number}  The y-coordinate along the vertical edge of the target bounds that is closest to the map bounds.
	 */
	function computeVerticalEdgeYCoordinate( targetBounds, mapBounds )
	{
		var mapSouthCoord = mapBounds.getSouthWest().lat();
		var mapNorthCoord = mapBounds.getNorthEast().lat();
		
		var targetSouthCoord = targetBounds.getSouthWest().lat();
		var targetNorthCoord = targetBounds.getNorthEast().lat();
		
		var overlappingSouthCoord = (mapSouthCoord > targetSouthCoord) ? mapSouthCoord : targetSouthCoord;
		var overlappingNorthCoord = (mapNorthCoord < targetNorthCoord) ? mapNorthCoord : targetNorthCoord;
		
		return (overlappingSouthCoord + overlappingNorthCoord) / 2;
	}
	
};


/**
 * @type {object}
 * @augments lucid.maps.limbs.location.LocationStrategyOptions
 */
lucid.maps.limbs.location.CentreLocationStrategyOptions = {};

/**
 * @class
 * A location strategy that returns the centre of the target object.
 * For polygons and polylines, the centre is computed as the centre of the bounding box and therefore
 * may not lie on or in the shape.
 * 
 * @constructor
 * @param {lucid.maps.limbs.location.CentreLocationStrategyOptions} options  The options controlling the location calculation.
 */
lucid.maps.limbs.location.CentreLocationStrategy = function( options )
{
	lucid.maps.limbs.location.LocationStrategy.apply( this, [ options ] );
	
	
	this.computeMarkerLocation = function( target )
	{
		return target.getPosition();
	};
	
	this.computePolylineLocation = function( target )
	{
		// TODO Cache the result of computeBounds to improve performance.
		//      Provide an option in the CentreLocationStrategyOptions to set the cache class.
		//      The cache class should provide a function to clear a value out of the cache.
		return lucid.maps.geometry.computeBounds( target ).getCenter();
	};
	
	this.computePolygonLocation = function( target )
	{
		return lucid.maps.geometry.computeBounds( target ).getCenter();
	};
	
	this.computeRectangleLocation = function( target )
	{
		return target.getBounds().getCenter();
	};
	
	this.computeCircleLocation = function( target )
	{
		return target.getCenter();
	};
	
};


/**
 * @type {object}
 * @augments lucid.maps.limbs.location.LocationStrategyOptions
 */
lucid.maps.limbs.location.CentreLocationStrategyOptions = {};

/**
 * @class
 * A strategy class for computing the location of target objects.
 * 
 * The location of the target object is needed to determine the direction the object lies and
 * thereby the placement of the LIMB at the edge of the map.
 * For a 1 dimensional marker the location is trivial - it is the marker's position.
 * For 2 dimensional shapes this strategy is used to derive a point from shape of the target object.
 * 
 * This base class does nothing. Use one of the concrete sub-classes, e.g. BoundsEdgeLocationStrategy
 * to choose your preferred algorithm.
 * 
 * @constructor
 * @param {lucid.maps.limbs.location.LocationStrategyOptions} options  The options controlling the location calculation.
 */
lucid.maps.limbs.location.LocationStrategy = function( options )
{
	var markerConstructor = (new google.maps.Marker()).constructor;
	var polylineConstructor = (new google.maps.Polyline()).constructor;
	var polygonConstructor = (new google.maps.Polygon()).constructor;
	var rectangleConstructor = (new google.maps.Rectangle()).constructor;
	var circleConstructor = (new google.maps.Circle()).constructor;
	
	
	/**
	 * @param {google.maps.Marker|google.maps.Polyline|google.maps.Polygon|google.maps.Rectangle|google.maps.Circle} target  The given target.
	 * @returns {function}  The function that will compute the location for the type of target given.
	 */
	this.getMethodForTargetType = function( target )
	{
		if (target.constructor == markerConstructor)
		{
			return this.computeMarkerLocation;
		}
		if (target.constructor == polylineConstructor)
		{
			return this.computePolylineLocation;
		}
		if (target.constructor == polygonConstructor)
		{
			return this.computePolygonLocation;
		}
		if (target.constructor == rectangleConstructor)
		{
			return this.computeRectangleLocation;
		}
		if (target.constructor == circleConstructor)
		{
			return this.computeCircleLocation;
		}
	};
	
	/**
	 * @param {google.maps.Marker|google.maps.Polyline|google.maps.Polygon|google.maps.Rectangle|google.maps.Circle} target  The given target.
	 * @param {google.maps.LatLngBounds} mapBounds  The bounds of the current map view.
	 * @returns {google.maps.LatLng}  The location of the target. The actual location will vary between different strategy classes.
	 */
	this.computeLocation = function( target, mapBounds )
	{
		var computeLocationOfTarget = this.getMethodForTargetType( target );
		
		return computeLocationOfTarget( target, mapBounds );
	};
	
	this.computeMarkerLocation = function( target, mapBounds )
	{
		return null;
	};
	
	this.computePolylineLocation = function( target, mapBounds )
	{
		return null;
	};
	
	this.computePolygonLocation = function( target, mapBounds )
	{
		return null;
	};
	
	this.computeRectangleLocation = function( target, mapBounds )
	{
		return null;
	};
	
	this.computeCircleLocation = function( target, mapBounds )
	{
		return null;
	};
	
};


/**
 * @type {object}
 */
lucid.maps.limbs.location.LocationStrategyOptions = {};


lucid.maps.limbs.tooltip.standardTooltip = function( title, distance, display, mapDetails )
{
	return title + "\n" + lucid.maps.limbs.tooltip.distanceInVariableFormat( distance );
};


lucid.maps.limbs.tooltip.distanceInVariableFormat = function( distance )
{
	if (distance < 999.5)   // whole number of metres  (0 m - 999 m)
	{
		return lucid.maps.limbs.tooltip.distanceInWholeUnits( distance ) + " m";
	}
	else if (distance < 9950)   //  (1 km - 9.9 km)
	{
		return lucid.maps.limbs.tooltip.distanceWithOneDecimalPlace( distance / 1000 ) + " km";
	}
	else  // whole number of kilometres (10 km .... )
	{
		return lucid.maps.limbs.tooltip.distanceInWholeUnits( distance / 1000 ) + " km";
	}
};

lucid.maps.limbs.tooltip.distanceInWholeUnits = function( distance )
{
	return Math.floor( distance + 0.5 );
};

lucid.maps.limbs.tooltip.distanceWithOneDecimalPlace = function( distance )
{
	return Math.floor( (distance * 10) + 0.5 ) / 10;
};

/**
 * @class
 * Searches for places and adds labels (Marker and Limb) to a map.
 * This class uses the google.maps.places.PlacesService to find places
 * and displays them using a lucid.maps.limbs.LimbMarkerFactory.
 *
 * This logic can optionally be synchronised to a button (lucid.maps.places.LabelPlacesButton).
 *
 * @constructor
 * @param {lucid.maps.places.LabelPlacesOptions} options  Configuration for the labelling of places.
 */
lucid.maps.places.LabelPlaces = function( options )
{
	var thisLabeller = this;
	
	var markerManager;
	var searchService;
	var searchOrigin;
	var searchTypes;
	
	
	// This initialise function is called at the end of the constructor.
	function init()
	{
		if (options.button)
			google.maps.event.addListener( options.button, "click", handleButtonClick );
		
		markerManager = new lucid.maps.limbs.LimbMarkerPlacesFactory( options );
		searchService = new google.maps.places.PlacesService( options.map );
		searchTypes = options.types;
	}
	
	
	/**
	 * Set the type(s) of place this instance searches for.
	 *  
	 * @param {string[]} types  A list of Google places types.
	 */
	this.setPlaceTypes = function( types )
	{
		searchTypes = types;
	};
	
	function handleButtonClick()
	{
		if (options.button.getState() == lucid.maps.places.LabelPlacesState.ACTIVE)
		{
			thisLabeller.removePlaces();
		}
		else if (options.button.getState() == lucid.maps.places.LabelPlacesState.PENDING)
		{
			// Ignore any further clicks until the current search completes.
		}
		else
		{
			thisLabeller.addPlaces();
		}
	}
	
	/**
	 * Add places to the map.
	 * The Google PlacesService will be called to find the places to show. The locations
	 * returned are then marked on the map with a Marker and a LIMB.
	 * You can remove the labels with a call to 'removePlaces'.
	 */
	this.addPlaces = function()
	{
		if (options.button)
			options.button.setPending();
		
		searchOrigin = options.map.getCenter();
		
		var placeSearchRequest =
		{
			location: searchOrigin,
			// You can't specify a max radius when ranking by distance.
			// So we'll cap the radius when we process the results.
			//radius: options.maxDistance,
			rankBy: google.maps.places.RankBy.DISTANCE,
			types: searchTypes
		};
		searchService.nearbySearch( placeSearchRequest, handleSearchResults );
	}
	
	function handleSearchResults( results, status, pagination )
	{
		if (status == google.maps.places.PlacesServiceStatus.OK)
		{
			var processedResults = processSearchResults( results );
			if (processedResults.length > 0)
			{
				handleNonZeroSearchResults( processedResults );
			}
			else
			{
				handleZeroSearchResults();
			}
		}
		else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS)
		{
			handleZeroSearchResults();
		}
		else
		{
			handleErrorSearchResult();
		}
	}
	
	function handleErrorSearchResult()
	{
		if (options.button)
			options.button.setError();
	}
	
	function handleZeroSearchResults()
	{
		if (options.button)
			options.button.setNoResults();
	}
	
	function handleNonZeroSearchResults( processedResults )
	{
		if (options.button)
			options.button.setActive();
		
		google.maps.event.trigger( thisLabeller, "pre_add_labels" );
		
		for (var i=0; i<processedResults.length; i++)
		{
			var result = processedResults[i];
			markerManager.add( result.geometry.location, result.name, result.reference );
		}
		
		markerManager.zoomToAll( { "additionalLocations": [ searchOrigin ] } );
		
		google.maps.event.trigger( thisLabeller, "post_add_labels" );
	}
	
	function processSearchResults( results )
	{
		var processedResults = [];
		
		for (var i=0; i<results.length; i++)
		{
			if (typeof options.maxPlaces === "number")
			{
				// Stop when we've reached the maximum places to be shown.
				if (i >= options.maxPlaces)
				{
					break;
				}
			}
			
			if (typeof options.maxDistance === "number")
			{
				// Stop when we've reach a result too far away.
				// NB: We've ranked the results by distance so that
				//     once we find a result too far away subsequent results will always be further away.
				var distanceToResults = google.maps.geometry.spherical.computeDistanceBetween( searchOrigin, results[i].geometry.location );
				if (distanceToResults > options.maxDistance)
				{
					break;
				}
			}
			
			processedResults[processedResults.length] = results[i];
		}
		
		return processedResults;
	}
	
	/**
	 * Remove places from the map.
	 */
	this.removePlaces = function()
	{
		if (markerManager.getNumberOfMarkers() > 0)
		{
			google.maps.event.trigger( thisLabeller, "pre_remove_labels" );

			if (options.button)
				options.button.setIdle();

			markerManager.removeAll();

			google.maps.event.trigger( thisLabeller, "post_remove_labels" );
		}
	};
	
	/**
	 * Temporarily hide all places.
	 * This does not remove the LIMBs and markers, it just takes them off display.
	 * Call this if you hide the map element.
	 */
	this.hide = function()
	{
		markerManager.hide();
	};
	
	/**
	 * Re-display the places after being hidden with a call to 'hide'.
	 */
	this.show = function()
	{
		markerManager.show();
	};
	
	/**
	 * @return {number}  The total number of places being labelled (includes any labels currently being hidden).
	 */
	this.getNumberOfPlaces = function()
	{
		return markerManager.getNumberOfMarkers();
	};
	
	
	init();
};

/**
 * Raised before new places are labelled on the map.
 *
 * @event lucid.maps.places.LabelPlaces#pre_add_labels
 * @type {object}
 */

/**
 * Raised after labels have been added to the map.
 * 
 * @event lucid.maps.places.LabelPlaces#post_add_labels
 * @type {object}
 */

/**
 * Raised before removing place labels from the map.
 *
 * @event lucid.maps.places.LabelPlaces#pre_remove_labels
 * @type {object}
 */

/**
 * Raised after labels have been removed from the map.
 *
 * @event lucid.maps.places.LabelPlaces#post_remove_labels
 * @type {object}
 */

/**
 * @type {object}
 * @augments lucid.maps.limbs.LimbMarkerPlacesFactoryOptions
 * @property {string[]} types  The types of places to show.
 * @property {number} maxDistance  The maximum distance to find places.
 * @property {number} maxPlaces  The maximum number of places to show.
 * @property {lucid.maps.places.LabelPlacesButton} [button]  The button which will activate the places being shown.
 *                                                           If undefined, you must trigger the places to be shown by calling the addPlaces function.
 */
lucid.maps.places.LabelPlacesOptions = {};

/**
 * @class
 * Manages the button that controls the display of LIMBs.
 * Specifically, this class is responsible for changing the button graphic to reflect the current state.
 *
 * @constructor
 * @param {lucid.maps.places.LabelPlacesButtonOptions} options  Configuration for the button.
 */
lucid.maps.places.LabelPlacesButton = function( options )
{
	var thisButton = this;
	
	// The state controls what happens when the button is clicked
	// and is reflected by the icon image used for the button graphic.
	var state;
	
	// Some states revert to idle after a given timeout.
	var revertToIdleTimer;
	var revertToIdleTimeout = 5000;
	
	var buttonElement;
	var graphics;
	
	
	// This initialise function is called at the end of the constructor.
	function init()
	{
		buttonElement = jQuery( options.buttonDiv );
		buttonElement.click( handleClick );
		
		graphics = jQuery( '.graphics', buttonElement );
		
		thisButton.setIdle();
	}
	
	
	function handleClick()
	{
		google.maps.event.trigger( thisButton, 'click' );
	}
	
	/**
	 * Make the button visible, after a call to hide.
	 */
	this.show = function()
	{
		buttonElement.show();
	};
	
	/**
	 * Hide the button graphic.
	 */
	this.hide = function()
	{
		buttonElement.hide();
	};
	
	/**
	 * Set this button into the "idle" state.
	 * @see The lucid.maps.places.LabelPlacesState enumeration.
	 */
	this.setIdle = function()
	{
		setState( lucid.maps.places.LabelPlacesState.IDLE );
	};
	
	/**
	 * Set this button into the "pending results" state.
	 * @see The lucid.maps.places.LabelPlacesState enumeration.
	 */
	this.setPending = function()
	{
		setState( lucid.maps.places.LabelPlacesState.PENDING );
	};
	
	/**
	 * Set this button into the "active" state.
	 * @see The lucid.maps.places.LabelPlacesState enumeration.
	 */
	this.setActive = function()
	{
		setState( lucid.maps.places.LabelPlacesState.ACTIVE );
	};
	
	/**
	 * Set this button into the "error encountered" state.
	 * @see The lucid.maps.places.LabelPlacesState enumeration.
	 */
	this.setError = function()
	{
		setState( lucid.maps.places.LabelPlacesState.ERROR );
		setRevertToIdle();
	};
	
	/**
	 * Set this button into the "no results found" state.
	 * @see The lucid.maps.places.LabelPlacesState enumeration.
	 */
	this.setNoResults = function()
	{
		setState( lucid.maps.places.LabelPlacesState.NO_RESULTS );
		setRevertToIdle();
	};
	
	function setState( newState )
	{
		clearRevertToIdle();
		
		if (state)
		{
			graphics.removeClass( state );
		}
		
		state = newState;
		
		graphics.addClass( state );
	};
	
	/**
	 * @return {lucid.maps.places.LabelPlacesState}  The current state of this button.
	 */
	this.getState = function()
	{
		return state;
	};
	
	function setRevertToIdle()
	{
		clearRevertToIdle();
		revertToIdleTimer = window.setTimeout( revertToIdle, revertToIdleTimeout );
	}
	
	function clearRevertToIdle()
	{
		if (revertToIdleTimer)
		{
			window.clearTimeout( revertToIdleTimer );
			revertToIdleTimer = null;
		}
	}
	
	function revertToIdle()
	{
		thisButton.setIdle();
	}
	
	
	init();
};

/**
 * Indicates when the button is clicked.
 *
 * @event lucid.maps.places.LabelPlacesButton#click
 * @type {object}
 */

/**
 * An enumeration of states for the process-lifecycle of labelling places.
 * The {@link lucid.maps.places.LabelPlacesButton} will adjust its appearance to reflect the current state.
 * @enum
 * @default IDLE
 */
lucid.maps.places.LabelPlacesState =
{
	/** No search results are being shown on the map.
	 *  @const
	 *  @type {string} */
	IDLE: "idle",
	
	/** A search is currently being performed.
	 *  @const
	 *  @type {string} */
	PENDING: "pending",
	
	/** A search has been triggered and places are being shown on the map.
	 *  @const
	 *  @type {string} */
	ACTIVE: "active",
	
	/** A search was triggered but there was an error finding nearby places.
	 *  @const
	 *  @type {string} */
	ERROR: "error",
	
	/** A search was triggered but no results were found.
	 *  @const
	 *  @type {string} */
	NO_RESULTS: "no-results"
};

/**
 * @type {object}
 * @property {Node} buttonDiv  The DOM element used to show/hide the place labels.
 */
lucid.maps.places.LabelPlacesButtonOptions = {};

/**
 * @class
 * Parses information from the place object returned from the Google Places service.
 * This class acts as a wrapper around the Google place object
 * and provides methods to parse information from the wrapped object.
 * 
 * @constructor
 * @param {google.maps.places.PlaceResult} place  The place we want the details from.
 */
lucid.maps.places.PlaceDetailParser = function( place )
{
	
	/**
	 * Check if the place has been given a rating.
	 * 
	 * @return {boolean}  True if the place has a rating.
	 */
	this.hasRating = function()
	{
		return (typeof place.rating === "number");
	};
	
	/**
	 * Get the rating given to the place.
	 * This may be undefined. Use the hasRating function to test if the rating exists.
	 * 
	 * @return {number}  The place's rating.
	 */
	this.getRating = function()
	{
		return place.rating;
	};
	
	/**
	 * Check if the place has defined its opening hours.
	 * 
	 * @return {boolean}  True if the place has opening hours defined.
	 */
	this.hasOpeningHours = function()
	{
		return (typeof place.opening_hours !== "undefined") && (typeof place.opening_hours.periods !== "undefined") && (typeof place.opening_hours.periods.length === "number");
	};
	
	/**
	 * Get the opening hours for the current day of the week.
	 * This may be undefined. Use the hasOpeningHours function to test if the opening hours exist.
	 * 
	 * @return {string}  The opening hours for the current day of the week.
	 */
	this.getOpeningHoursToday = function()
	{
		return this.getOpeningHours( new Date().getDay() );
	};
	
	/**
	 * Get the opening hours for the specified day of the week.
	 * This may be undefined. Use the hasOpeningHours function to test if the opening hours exist.
	 * 
	 * @param {number} day  The zero-based index of the day of the week. With 0 being Monday.
	 * @return {string}  The opening hours for the current day of the week.
	 */
	this.getOpeningHours = function( day )
	{
		var periods = [];
		for (var i=0; i<place.opening_hours.periods.length; i++)
		{
			if (place.opening_hours.periods[i].open.day == day)
			{
				periods[periods.length] = place.opening_hours.periods[i];
			}
		}
		
		var openingHoursText;
		if (periods.length > 0)
		{
			openingHoursText = "Open ";
			for (var i=0; i<periods.length; i++)
			{
				if (i > 0)
				{
					openingHoursText += ", ";
				}
				openingHoursText += periods[i].open.time + " - " + periods[i].close.time;
			}
		}
		else
		{
			openingHoursText = "Closed";
		}
		
		return openingHoursText;
	};
	
	// TODO Parse "reviews[n].text"
};

/**
 * Compute the angle extended by a vector with given lateral components in the x and y plane.
 *
 * @param {number} xDiff  The x-component of the vector.
 * @param {number} yDiff  The y-component of the vector.
 * @return {number}  The angle subtended by the vector.
 *                   The angle is in radians and measured anti-clockwise from the (positive) x-axis.
 */
Math.vectorAngle = function( xDiff, yDiff )
{
	if (Math.abs( xDiff ) > 0.00000001)
	{
		var angle = Math.atan( yDiff / xDiff );
		if (xDiff < 0)
			angle += Math.PI;
		
		return angle;
	}
	else
	{
		// Handle the vertical case, which would otherwise lead to division by zero.
		if (yDiff < 0)
		{
			return 3 * (Math.PI / 2);
		}
		else
		{
			return Math.PI / 2;
		}
	}
}


/**
 * The commonly-used value of 1/2 PI (90 degrees).
 */
Math.HALF_PI = Math.PI / 2;

/**
 * The commonly-used value of 3/2 PI (270 degrees).
 */
Math.THREE_HALVES_PI = 3 * Math.HALF_PI;

/**
 * The commonly-used value of 2 PI (360 degrees).
 */
Math.TWO_PI = 2 * Math.PI;
