import React, { Component, Fragment } from 'react';
import { Map, TileLayer, Popup, Marker } from 'react-leaflet';
import styles from '../../index.less';

const center = { lat: 51.505, lng: -0.09 };
export default class Alerts extends Component {
  render() {
    return (
      <Fragment>
        <Map className={styles.leafletMapCustom} useFlyTo animate zoom={13} center={center}>
          <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={center}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </Map>
      </Fragment>
    );
  }
}
