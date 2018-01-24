// @flow

import {dispatch} from 'redux-easy';

import {reloadAlerts} from './instance-detail/instance-detail';

export function websocketSetup() {
  const connection = new WebSocket('ws://127.0.0.1:1337');

  connection.onopen = () =>
    console.info('got WebSocket connection');

  connection.onerror = error =>
    console.error('WebSocket error:', error);

  connection.onmessage = message => {
    if (global.importInProgress) return;

    const {data} = message;
    if (data === 'reload alerts') {
      reloadAlerts();
      return;
    }

    try {
      // $FlowFixMe - doesn't think data is a string
      const change = JSON.parse(data);
      dispatch('setInstanceProperty', change);
    } catch (e) {
      console.info('unsupported WebSocket message:', data);
    }
  };
}
