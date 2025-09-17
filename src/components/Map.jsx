// Map.jsx
import React, {
    forwardRef,
    useRef,
    useImperativeHandle, useEffect,useState
} from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap} from 'react-leaflet';
import geoData from '../assets/tl_2023_06_bg_fc.json';
import Search from "./Search.jsx";
import L from 'leaflet';
import 'leaflet-geometryutil';




const normal    = { color: 'purple', weight: 0.5, fillOpacity: 0.02 };
const highlight = { color: 'red',    weight: 0.5, fillOpacity: 0.4 };


const Map = forwardRef(function Map({ idFn }, ref) {
    const selectedLayerRef = useRef(null);
    const geoJsonLayerRef  = useRef(null);
    const [picked, setPicked] = useState(null);

    const onEachFeature = (feature, layer) => {
        layer.setStyle(normal);

        layer.on({
            mouseover:  e => {
                if (e.target !== selectedLayerRef.current) {
                    e.target.setStyle(highlight);
                    e.target.bringToFront();
                }
            },
            mouseout:   e => {
                if (e.target !== selectedLayerRef.current) {
                    e.target.setStyle(normal);
                }
            },
            click:      e => {
                const clicked = e.target;

                // de-highlight any previously selected polygon
                if (selectedLayerRef.current && selectedLayerRef.current !== clicked) {
                    selectedLayerRef.current.setStyle(normal);
                }

                clicked.setStyle(highlight);
                selectedLayerRef.current = clicked;

                idFn?.(clicked.feature.properties.id);
            },
        });
    };

    useEffect(() => {
        if (!picked) return;

        if (!geoJsonLayerRef.current) {
            const timer = setTimeout(() => {
                if (geoJsonLayerRef.current && picked) {
                    const latlng = L.latLng(picked.lat, picked.lng);

                    // Manually find which polygon contains the point
                    let foundLayer = null;
                    geoJsonLayerRef.current.eachLayer(layer => {
                        try {
                            const bounds = layer.getBounds && layer.getBounds();
                            if (bounds && bounds.contains && bounds.contains(latlng)) {
                                foundLayer = layer;
                                return false; // Break out of eachLayer loop
                            }
                        } catch (e) {
                            // Silently handle bounds errors
                        }
                    });

                    if (foundLayer) {
                        if (selectedLayerRef.current && selectedLayerRef.current !== foundLayer) {
                            selectedLayerRef.current.setStyle(normal);
                        }

                        foundLayer.setStyle(highlight);
                        selectedLayerRef.current = foundLayer;

                        idFn?.(foundLayer.feature.properties.id);
                    }
                }
            }, 500);
            return () => clearTimeout(timer);
        }

        const latlng = L.latLng(picked.lat, picked.lng);

        // Manually find which polygon contains the point
        let foundLayer = null;
        geoJsonLayerRef.current.eachLayer(layer => {
            try {
                const bounds = layer.getBounds && layer.getBounds();
                if (bounds && bounds.contains && bounds.contains(latlng)) {
                    foundLayer = layer;
                    return false; // Break out of eachLayer loop
                }
            } catch (e) {
                // Silently handle bounds errors
            }
        });

        if (foundLayer) {
            if (selectedLayerRef.current && selectedLayerRef.current !== foundLayer) {
                selectedLayerRef.current.setStyle(normal);
            }

            foundLayer.setStyle(highlight);
            selectedLayerRef.current = foundLayer;

            idFn?.(foundLayer.feature.properties.id);
        }
    }, [picked]);

    useImperativeHandle(ref, () => ({
        resetSelection() {

            if (selectedLayerRef.current) {
                selectedLayerRef.current.setStyle(normal);
            }

            if (geoJsonLayerRef.current) {
                geoJsonLayerRef.current.eachLayer(layer => {
                    layer.setStyle(normal);
                });
            }
            
            selectedLayerRef.current = null;
        },
    }));

    return (
        <MapContainer center={[34.0522, -118.2437]} zoom={7}
                      style={{ height: '400px', width: '100%' }}>
            <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[34.0522, -118.2437]}>
                <Popup>Los Angeles</Popup>
            </Marker>

            <Search keepMarker={true} onSelect={({ lat, lng, label, bounds }) => {
                setPicked({ lat, lng, label });
            }}/>

            <GeoJSON
                data={geoData}
                onEachFeature={onEachFeature}
                ref={(layer) => {
                    if (layer) {
                        geoJsonLayerRef.current = layer;
                    }
                }}
            />
        </MapContainer>
    );
});

export default Map;
