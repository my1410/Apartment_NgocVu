import { Alert, Button, Space } from 'antd';
import { EnvironmentFilled } from '@ant-design/icons';
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import { usePreferences } from '../../context/AppPreferences.jsx';
import { MapCard, MapFrame, MapToolbar } from './styles.js';

const center = { lat: 16.0678, lng: 108.2208 };

export function MapView({ apartments }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const markers = useMemo(
    () => apartments.filter((apartment) => apartment.coordinates?.lat && apartment.coordinates?.lng),
    [apartments]
  );

  if (!apiKey) {
    return <OpenStreetMapView markers={markers} />;
  }

  return <GoogleMapView apiKey={apiKey} markers={markers} />;
}

function buildOpenStreetMapUrl(marker) {
  const position = marker?.coordinates || center;
  const lat = Number(position.lat);
  const lng = Number(position.lng);
  const delta = 0.012;
  const bbox = [
    lng - delta,
    lat - delta,
    lng + delta,
    lat + delta
  ].join(',');

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

function buildGoogleMapsUrl(marker) {
  const position = marker?.coordinates || center;
  return `https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`;
}

function OpenStreetMapView({ markers }) {
  const { t } = usePreferences();
  const mainMarker = markers[0];

  return (
    <MapCard>
      <MapToolbar>
        <div>
          <span>{t('map.title')}</span>
          <strong>{t('map.positions', { count: markers.length })}</strong>
        </div>
        <Button href={buildGoogleMapsUrl(mainMarker)} target="_blank" rel="noreferrer">
          {t('common.openGoogleMaps')}
        </Button>
      </MapToolbar>

      <MapFrame
        title={`${t('map.title')} ${mainMarker?.title || 'Da Nang'}`}
        src={buildOpenStreetMapUrl(mainMarker)}
        loading="lazy"
      />

      <Space direction="vertical" size={8}>
        {markers.length ? markers.map((apartment) => (
          <Alert
            key={apartment.id}
            type="success"
            showIcon
            icon={<EnvironmentFilled />}
            message={apartment.title}
            description={apartment.address}
          />
        )) : (
          <Alert
            type="warning"
            showIcon
            message={t('common.noCoordinates')}
          />
        )}
      </Space>
    </MapCard>
  );
}

function GoogleMapView({ apiKey, markers }) {
  const { t } = usePreferences();
  const [activeApartment, setActiveApartment] = useState(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  return (
    <MapCard>
      <MapToolbar>
        <div>
          <span>{t('map.title')}</span>
          <strong>{t('map.positions', { count: markers.length })}</strong>
        </div>
      </MapToolbar>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: 460, borderRadius: 28 }}
          center={markers[0]?.coordinates || center}
          zoom={12}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#111827' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#dbeafe' }] },
              { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f766e' }] }
            ]
          }}
        >
          {markers.map((apartment) => (
            <MarkerF
              key={apartment.id}
              position={apartment.coordinates}
              onClick={() => setActiveApartment(apartment)}
            />
          ))}
          {activeApartment && (
            <InfoWindowF
              position={activeApartment.coordinates}
              onCloseClick={() => setActiveApartment(null)}
            >
              <div style={{ color: '#111827', maxWidth: 220 }}>
                <strong>{activeApartment.title}</strong>
                <p>{activeApartment.address}</p>
                <b>{activeApartment.priceLabel}</b>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      )}
    </MapCard>
  );
}
