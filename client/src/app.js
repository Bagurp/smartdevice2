import React, {Component} from 'react';
import {connect} from 'react-redux';

import TreeBuilder from './tree-builder/tree-builder';
import {TreeRootNodeType} from './types';

import './app.css';

type PropsType = {
  newTypeName: string,
  typeRootNode: TreeRootNodeType
};

class App extends Component<PropsType> {
  render() {
    const {newTypeName, typeRootNode} = this.props;
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">SmartDevice</h1>
        </header>
        <TreeBuilder
          newNodeName={newTypeName}
          rootNode={typeRootNode}
          rootPropertyName="typeRootNode"
        />
      </div>
    );
  }
}

const mapState = (state: StateType): Object => {
  const {newTypeName, typeRootNode} = state;
  return {newTypeName, typeRootNode};
};

export default connect(mapState)(App);
