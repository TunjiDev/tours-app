const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoiZWxkaXJlY3RvIiwiYSI6ImNrcmc2MTliYTAwODQycG81NzQzaDhmazMifQ.Y9Sx4pvjgBRHjwDyZPsG4w';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: false
    // center: [-118.113491, 34.1111745],
    // zoom: 5,
    // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    // Add popup
    new mapboxgl.Popup({
        offset: 30
    }).setLngLat(loc.coordinates).setHTML(`<p>${loc.day}: ${loc.description}</p>`).addTo(map);

    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});
