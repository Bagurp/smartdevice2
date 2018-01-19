// @flow

import sortBy from 'lodash/sortBy';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {dispatch} from 'redux-easy';

import {getJson, putJson} from '../util/rest-util';

import type {
  MessageServerType,
  NodePayloadType,
  NodeType,
  StateType,
  TreeType
} from '../types';

import './message-server-select.css';

type PropsType = {
  treeType: TreeType,
  typeNode?: NodeType
};

type MyStateType = {
  messageServers: MessageServerType[]
};

class MessageServerSelect extends Component<PropsType, MyStateType> {
  state: MyStateType = {
    messageServers: []
  };

  componentWillMount() {
    this.loadMessageServers();
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const {typeNode} = nextProps;
    if (!typeNode) return;

    const currentTypeNode = this.props.typeNode;
    const newTypeSelected =
      !currentTypeNode || typeNode.id !== currentTypeNode.id;

    if (newTypeSelected) this.loadMessageServers();
  }

  handleServerChange = (event: SyntheticInputEvent<HTMLSelectElement>) => {
    const {typeNode} = this.props;
    if (!typeNode) return;

    const messageServerId = Number(event.target.value);
    const url = `types/${typeNode.id}/server/${messageServerId}`;
    putJson(url);

    const newTypeNode: NodeType = {...typeNode, messageServerId};
    const payload: NodePayloadType = {kind: 'type', node: newTypeNode};
    dispatch('saveNode', payload);
  };

  async loadMessageServers() {
    if (this.props.treeType !== 'type') return;

    const json = await getJson('message_server');
    const servers = ((json: any): MessageServerType[]);
    const sortedServers = sortBy(servers, ['host']);
    this.setState({messageServers: sortedServers});
  }

  render() {
    const {typeNode} = this.props;
    if (!typeNode) return null;

    const isTopLevel = typeNode.parentId === 1;
    if (!isTopLevel) return null;

    const value = typeNode.messageServerId || 0;
    const {messageServers} = this.state;
    return (
      <div className="message-server">
        <h3>Message Server for type &quot;{typeNode.name}&quot;</h3>
        <select onChange={this.handleServerChange} value={value}>
          <option value="0">unset</option>
          {messageServers.map(server => (
            <option key={server.id} value={server.id}>
              {server.host}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

const mapState = (state: StateType): PropsType => {
  const {ui: {treeType}} = state;
  return {treeType};
};

export default connect(mapState)(MessageServerSelect);