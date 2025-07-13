// CRTY 1033: WEB MAPPING, COGS 2025
// PURPOSE: ASSIGNMENT 4: JavaScript Libraries for Web Mapping Applications (Mapbox)
// DEVELOPER: DEANNE WATTS 
// DATE: February 20, 2025 
// VERSION: 1.0
// NOTES: NOTES: Additional information, references and support information for this web page can be found in the README.txt file associated with this project

// initialize mapbox, specify access token generated within mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZGJ3YXR0cyIsImEiOiJjbTcxenF0bnowNWI4MnFxMmZ1Mjh3N2t0In0.KrT8UgL6UuGCShWgLZMDEg'; //specifying access token provided from mapbox   
    const map = new mapboxgl.Map({
        container: 'map', // specify map container from html
        style: "mapbox://styles/dbwatts/cm73dhgzf005v01rfa4jl0na3", //specifying customized style developed and published in mapbox, link available through account and style link when published
        center: [-98, 56], // starting position [lng, lat] of web map upon loading. Note: lat must be set between -90 and 90. 
        zoom: 3.5 // set initial zoom on page load (lower value = small scale, higher value = large scale)
    });

// initiating popups for data points in geoJSON layer
// adding event listener for "click" action on 2024 events AND 2023 events - note they are both listed to enable click on both layers
    map.on('click', (event) => {
        const layers = ['2024tornadoes-6yyf6a', 'clean-tornadoevents2023-6zbpr9']; // Both layer names as listed in mapbox studio 
        // specifying what features to listen to for click event (i.e. point features of specified layers)
        const features = map.queryRenderedFeatures(event.point, { layers });
        // If the user clicks on a marker (i.e. feature in geoJSON), THEN access and display its information.
        if (!features.length) {
            return; // Exit if no features found
        }
    
        const feature = features[0];
        //specifying location and offset of popups (left/right, up/down)
        const popup = new mapboxgl.Popup({ offset: [15, -5] });
        
        // using lat/long coordinates as specified in geoJSON
        popup.setLngLat(feature.geometry.coordinates)
            .setHTML(
                // specifying what fields to include in popups, inclusion of additional text to contextualize fields 
                `<h3>${feature.properties.EventName}</h3>
                <h4><i>${feature.properties.Province}</i></h4>
                <p><b>Event type:</b> ${feature.properties.EventType}</p>
                <p><b>Date:</b> ${feature.properties.Month} ${feature.properties.Day}, ${feature.properties.Year}</p>
                <p><b>Observed location description: </b>${feature.properties.LocationDescription}</p>
                <p><b>Event description:</b> ${feature.properties.EventDescription}</p>`
            )
            // instructing to add the popups as specified above to the map
            .addTo(map);
    });

// include full screen mode button to web page
map.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}));

// specify parameters for scale bar, apply metric units
const scale = new mapboxgl.ScaleControl({
    maxWidth: 300, //note: width units are in pixels
    unit: 'metric'
});

// add scale bar to map 
map.addControl(scale);

// specify parameters for geolocator feature, add to map 
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
}));    

// specify parameters for mini globe locator map 
map.on("load", function () {
    map.addControl(
        // specify parameters for mini globe
        new GlobeMinimap({
            landColor: "#f0cf6e",
            waterColor: "#5e747a",
            globeSize: 250,
            markerColor: "#273a40",
        }),
        // specify location on map page
        "bottom-right"
    );
});

// specify parameters for Navigation Control; add navigation control to map
const navControl = new mapboxgl.NavigationControl({
    visualizePitch: true
});
map.addControl(navControl, 'top-right');

// adding static legend to map
// define legend items to be included
const legendItems = [
    // calling on tornado icons via relative path, specifying label to be included in legend (svg icons designed by Deanne Watts, 2025)
    { src: "img/Tornado_icon_2024_final.svg", alt: "Blue tornado icon representing 2024 tornado events", label: "Tornado event recorded in 2024" },
    { src: "img/Tornado_icon_2023_final.svg", alt: "Brown tornado icon representing 2023 tornado events", label: "Tornado event recorded in 2023" }
];

// Select the legend div as specified in HTML
const legend = document.getElementById("legend");

// Loop through all legend items; adding them to the legend
legendItems.forEach(item => {
    const legendItem = document.createElement("div");

    // Create the image element (specified by src image/relative path listed above)
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt;

    // Create label (specified above in label with src img)
    const label = document.createElement("span");
    label.textContent = item.label;

    // Append the specified image and specified label as legend item to the legend
    legendItem.appendChild(img);
    legendItem.appendChild(label);

    // Append the legend items to the legend container
    legend.appendChild(legendItem);
});

