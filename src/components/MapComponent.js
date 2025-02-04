import React from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const MapComponent = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  const defaultCenter = {
    // Replace with your actual business coordinates
    lat: 35.896989167268885, // e.g., 35.7796
    lng: -84.19103909483235, // e.g., -84.7084
  };

  const locations = [
    {
      name: "Caring Heart & Hand",
      location: {
        lat: 35.896989167268885, // Same as defaultCenter
        lng: -84.19103909483235, // Same as defaultCenter
      },
      address: "12135 Evergreen Terrace Ln, Knoxville TN 37932",
    },
  ];

  const toggleInfoWindow = () => {
    setIsOpen(!isOpen);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={15}
        center={defaultCenter}
        options={{
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ weight: "2.00" }],
            },
            {
              featureType: "all",
              elementType: "geometry.stroke",
              stylers: [{ color: "#9c9c9c" }],
            },
            {
              featureType: "all",
              elementType: "labels.text",
              stylers: [{ visibility: "on" }],
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [{ color: "#f2f2f2" }],
            },
            {
              featureType: "poi",
              elementType: "all",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "road",
              elementType: "all",
              stylers: [{ saturation: -100 }, { lightness: 45 }],
            },
            {
              featureType: "transit",
              elementType: "all",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ color: "#46bcec" }, { visibility: "on" }],
            },
          ],
        }}
      >
        {locations.map((item) => {
          return (
            <Marker
              key={item.name}
              position={item.location}
              onClick={toggleInfoWindow}
              icon={{
                url: "/map-marker.svg", // Custom marker icon
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            >
              {isOpen && (
                <InfoWindow
                  position={item.location}
                  onCloseClick={toggleInfoWindow}
                >
                  <div className="p-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">{item.address}</p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${item.location.lat},${item.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                    >
                      Get Directions
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
