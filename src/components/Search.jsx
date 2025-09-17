import React from 'react';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
export default function Search({onSelect, keepMarker = true, position = 'topleft'}) {

    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        const control = new GeoSearchControl({
            provider,
            style: 'bar',           // 'bar' | 'button'
            showMarker: keepMarker, // if false, you can render your own Marker
            showPopup: false,
            retainZoomLevel: false,
            animateZoom: true,
            autoClose: true,
            keepResult: true,
            searchLabel: 'Search address or place',
            position
        });

        map.addControl(control);

        const handleShowLocation = (e) => {
            const r = e.location; // { x:lng, y:lat, label, bounds }
            if (onSelect) {
                onSelect({
                    label: r.label,
                    lat: r.y,
                    lng: r.x,
                    bounds: r.bounds
                });
            }
        };

        map.on('geosearch/showlocation', handleShowLocation);

        return () => {
            map.off('geosearch/showlocation', handleShowLocation);
            map.removeControl(control);
        };
    }, [map, onSelect, keepMarker, position]);

    return null;



}
