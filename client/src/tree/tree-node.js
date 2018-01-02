// @flow

import React, {Component} from 'react';
import {dispatch} from 'redux-easy';

import Button from './button';
import {addNode} from './tree-util';

import './tree-node.css';

import type {
  NodeMapType,
  NodePayloadType,
  NodeType
} from '../types';

type PropsType = {
  editedName: string,
  editingNode: NodeType,
  kind: string,
  level: number,
  newNodeName: string,
  node: NodeType,
  nodeMap: NodeMapType
};

const URL_PREFIX = 'http://localhost:3001/';

function getSortedChildren(node: NodeType, nodeMap: NodeMapType): NodeType[] {
  const children = node.children.map(id => nodeMap[id]);
  return children.sort(nodeCompare);
}

function nodeCompare(node1: NodeType, node2: NodeType) {
  return node1.name.localeCompare(node2.name);
}

class TreeNode extends Component<PropsType> {

  deleteNode = async (node: NodeType) => {
    try {
      // Delete type from database.
      const {kind} = this.props;
      const url = `${URL_PREFIX}${kind}/${node.id}`;
      const options = {method: 'DELETE'};
      await fetch(url, options);

      const payload: NodePayloadType = {kind, node};
      dispatch('deleteNode', payload);
    } catch (e) {
      console.error('tree-builder.js deleteNode:', e.message);
    }
  };

  editNode = (event: SyntheticInputEvent<HTMLInputElement>) =>
    dispatch('editNode', event.target.value);

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    dispatch('setNewNodeName', event.target.value);
  };

  handleEscape = (event: SyntheticInputEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') this.toggleEditNode();
  };

  isEditing = (node: NodeType) => node === this.props.editingNode;

  moveCursor = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const {target} = event;
    const {value} = target;
    target.selectionStart = value.length;
  };

  saveChange = async () => {
    const {editedName: name, editingNode, kind, node} = this.props;
    try {
      // Update type name in database.
      const url = `${URL_PREFIX}${kind}/${editingNode.id}`;
      const options = {
        method: 'PATCH',
        body: JSON.stringify({name})
      };
      await fetch(url, options);

      const newNode = {...node, name};
      const payload: NodePayloadType = {kind, node: newNode};
      dispatch('saveNode', payload);
    } catch (e) {
      console.error('tree-builder.js saveChange:', e.message);
    }
  };

  toggleEditNode = () => dispatch('toggleEditNode', this.props.node);

  toggleExpandNode = () => {
    const {kind, node} = this.props;
    dispatch('toggleExpandNode', {kind, node});
  };

  renderChildren = () => {
    const {level, node, nodeMap} = this.props;
    return getSortedChildren(node, nodeMap).map(child => (
      <TreeNode
        {...this.props}
        key={'tn' + child.id}
        level={level + 1}
        node={child}
      />
    ));
  };

  render = () => {
    const {editedName, kind, level, newNodeName, node} = this.props;

    if (!node.parentId) return this.renderChildren();

    const direction = node.expanded ? 'down' : 'right';
    const triangleClasses =
      node.children.length === 0 ? '' : `fa fa-caret-${direction}`;

    return (
      <div className={`tree-node tree-level-${level}`}>
        <div
          className={`expand ${triangleClasses}`}
          onClick={this.toggleExpandNode}
        />
        {this.isEditing(node) ? (
          <input
            type="text"
            autoFocus
            onBlur={this.saveChange}
            onChange={this.editNode}
            onFocus={this.moveCursor}
            onKeyDown={this.handleEscape}
            value={editedName}
          />
        ) : (
          <div className="tree-node-name" onClick={() => this.toggleEditNode()}>
            {node.name}
          </div>
        )}
        <Button
          className="addNode"
          disabled={newNodeName === ''}
          icon="plus"
          onClick={() => addNode(kind, newNodeName, node)}
        />
        <Button
          className="deleteNode"
          icon="trash-o"
          onClick={() => this.deleteNode(node)}
        />
        <Button
          className="editNode"
          icon="pencil"
          onClick={() => this.toggleEditNode()}
        />
        {node.expanded ? this.renderChildren() : null}
      </div>
    );
  };
}

export default TreeNode;
