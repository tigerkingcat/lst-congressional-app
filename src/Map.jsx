// Map.jsx
import React, {
    forwardRef,
    useRef,
    useImperativeHandle,
} from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import geoData from './assets/tl_2023_06_bg_fc.json';

const normal    = { color: 'purple', weight: 2, fillOpacity: 0.05 };
const highlight = { color: 'red',    weight: 2, fillOpacity: 0.4 };

const Map = forwardRef(function Map({ idFn }, ref) {
    const selectedLayerRef = useRef(null);
    const geoJsonLayerRef  = useRef(null);     // lets us touch *all* polygons later

    /** ------ Mouse / click handlers --------------------------------------- */
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

    /** ------ Expose ‘resetSelection’ to the parent ------------------------ */
    useImperativeHandle(ref, () => ({
        resetSelection() {
            // reset *all* polygons, not just the selected one
            geoJsonLayerRef.current?.eachLayer(layer => layer.setStyle(normal));
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

            <GeoJSON
                data={geoData}
                onEachFeature={onEachFeature}
                ref={geoJsonLayerRef}
            />
        </MapContainer>
    );
});

export default Map;
