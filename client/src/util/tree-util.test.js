// @flow

import {deepFreeze} from './object-util';
import {
  PATH_DELIMITER,
  addNode,
  deleteNode,
  cloneTree,
  findNode,
  getFirstPathPart,
  getNodesExcept,
  type TreeNodeType
} from './tree-util';
import initialState from '../initial-state';

import type {StateType} from '../types';

describe('tree-util', () => {
  let state: StateType;

  beforeEach(() => {
    state = initialState;
    deepFreeze(state);
  });

  function getNodes(): TreeNodeType[] {
    return [
      {children: [], name: 'A'},
      {children: [], name: 'B'},
      {children: [], name: 'C'}
    ];
  }

  test('addNode', () => {
    const rootName = 'typeRootNode';
    const rootNode = state[rootName];

    const parentPath = rootName;
    const name = 'new node';
    const newRootNode = addNode(rootNode, parentPath, name);

    const {children} = newRootNode;
    expect(children.length).toBe(1);
    const [child] = children;
    expect(child.name).toBe(name);
  });

  test('addNode without parentPath', () => {
    const rootNode: TreeNodeType = {children: [], name: 'root'};
    const parentPath = '';
    const name = 'some name';
    expect(() => addNode(rootNode, parentPath, name)).toThrow();
  });

  test('cloneTree empty', () => {
    const rootName = 'typeRootNode';
    const rootNode = state[rootName];
    const [newRoot, node] = cloneTree(rootNode, rootName);
    expect(newRoot.name).toBe(rootName);
    expect(node.name).toBe(rootName);
  });

  test('cloneTree non-empty', () => {
    const name1 = 'typeRootNode';
    const name2 = 'foo';
    const name3 = 'bar';

    const d = PATH_DELIMITER;
    const path = `${name1}${d}${name2}${d}${name3}`;

    let node = {
      children: [],
      name: name3,
      parentPath: `${name1}${d}${name2}`
    };
    node = {
      children: [node],
      name: name2,
      parentPath: name1
    };
    const rootNode = {
      children: [node],
      name: name1
    };

    const [newRoot, lastNode] = cloneTree(rootNode, path);
    expect(newRoot.name).toBe(name1);
    expect(newRoot.children[0].name).toBe(name2);
    expect(newRoot.children[0].children[0].name).toBe(name3);
    expect(lastNode.name).toBe(name3);
    expect(lastNode).toEqual(newRoot.children[0].children[0]);
  });

  test('cloneTree bad path', () => {
    const rootName = 'typeRootNode';
    const rootNode = state[rootName];
    const path = `${rootName}/bad`;
    expect(() => cloneTree(rootNode, path)).toThrow(`bad tree path "${path}"`);
  });

  test('deleteNode', () => {
    const rootName = 'typeRootNode';
    const rootNode = state[rootName];

    const parentPath = rootName;
    const name = 'new node';
    let newRootNode = addNode(rootNode, parentPath, name);

    const targetNode = {children: [], name, parentPath};
    newRootNode = deleteNode(newRootNode, targetNode);

    const {children} = newRootNode;
    expect(children.length).toBe(0);
  });

  test('deleteNode without parentPath', () => {
    const rootNode: TreeNodeType = {children: [], name: 'root'};
    const targetNode: TreeNodeType = {
      children: [],
      name: 'some name',
      parentPath: ''
    };

    expect(() => deleteNode(rootNode, targetNode)).toThrow(
      'targetNode must have parentPath'
    );
  });

  test('findNode when found', () => {
    const nodes = getNodes();
    const node = findNode(nodes, 'B');
    expect(node).toBeDefined();
    if (node) expect(node.name).toBe('B');
  });

  test('findNode when not found', () => {
    const nodes = getNodes();
    const node = findNode(nodes, 'D');
    expect(node).not.toBeDefined();
  });

  test('getFirstPathPart when found', () => {
    const first = 'foo';
    const d = PATH_DELIMITER;
    const path = `${first}${d}bar${d}baz`;
    const part = getFirstPathPart(path);
    expect(part).toBe(first);
  });

  test('getFirstPathPart when not found', () => {
    expect(() => getFirstPathPart('')).toThrow('path is required');
  });

  test('getNodesExcept when found', () => {
    const nodes = getNodes();
    const newNodes = getNodesExcept(nodes, 'B');
    expect(newNodes.length).toBe(2);
    const names = newNodes.map(node => node.name);
    expect(names).toContain('A');
    expect(names).toContain('C');
  });

  test('getNodesExcept when not', () => {
    const nodes = getNodes();
    const newNodes = getNodesExcept(nodes, 'D');
    expect(newNodes.length).toBe(3);
    const names = newNodes.map(node => node.name);
    expect(names).toContain('A');
    expect(names).toContain('B');
    expect(names).toContain('C');
  });
});
