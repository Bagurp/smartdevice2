// @flow

import './reducers';
import {reducer} from 'redux-easy';

import type {AddNodePayloadType, StateType} from './types';

let state: StateType = {
  errors: new Set(),
  instanceNodeMap: {},
  instanceRootId: 2,
  typeNodeMap: {},
  typeRootId: 1,
  ui: {
    editedName: '',
    editingNodeId: 0,
    modal: {
      message: '',
      open: false,
      title: ''
    },
    newNodeName: ''
  },
  user: {
    confirmEmail: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    id: 0,
    lastName: '',
    organization: '',
    password: '',
    phone: '',
    role: 'spectator',
    version: 0
  }
};

// Add root node for types.
const typeRootId = 1;
let payload: AddNodePayloadType = {
  id: typeRootId,
  kind: 'type',
  name: 'type root',
  parentId: 0
};
let action = {type: 'addNode', payload};
state = reducer(state, action);

// Add root node for instances.
const instanceRootId = 2;
payload = {
  id: instanceRootId,
  kind: 'instance',
  name: 'instance root',
  parentId: 0
};
action = {type: 'addNode', payload};
state = reducer(state, action);

export default {...state, instanceRootId, typeRootId};
