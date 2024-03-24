const apiUrl = 'http://localhost:3000/marker-data';
let mapData;
// Make a GET request
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    mapData=data.markerData;
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

map.on('load', () => {
    map.addSource('places', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': mapData.markerArray,
        }
    });
    // Add a layer showing the places.
    map.addLayer({
        'id': 'places',
        'type': 'circle',
        'source': 'places',
        'paint': {
            'circle-color': '#4264fb',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'places', (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on('click', 'places', (e)=>{
        openImageCarousel()

        const openImage = e.features[0].properties.onClick;
const modalImage = document.getElementById('modalImage');
modalImage.src= openImage;
        
    })

    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});
function openImageCarousel(path){
const modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

function moveLeft(){
    const openImage = document.getElementById('modalImage').src;
    openImageArr= openImage.split('/');
    let imageIndex= mapData.markerList.indexOf(openImageArr[4]);
    if(imageIndex>0){
    modalImage.src= `./images/${mapData.markerList[imageIndex-1]}`;
    }
}


function moveRight(){
    const openImage = document.getElementById('modalImage').src;
    openImageArr= openImage.split('/');
    let imageIndex= mapData.markerList.indexOf(openImageArr[4]);
    if(imageIndex < mapData.markerList.length-1){
    modalImage.src= `./images/${mapData.markerList[imageIndex+1]}`;
    }
}
  
  // Function to close the modal
  function closeModal() {
    document.getElementById('myModal').style.display = 'none';
  }