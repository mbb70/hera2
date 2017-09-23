import React  from 'react';
import { Iterable } from 'immutable';

export const toJS = (BaseComponent) => (baseProps) => {
  const KEY = 0;
  const VALUE = 1;
  const jsProps = Object.entries(baseProps).reduce((newProps, baseProp) => {
    if (Iterable.isIterable(baseProp[VALUE])) {
      newProps[baseProp[KEY]] = baseProp[VALUE].toJS()
    } else {
      newProps[baseProp[KEY]] = baseProp[VALUE]
    }
    return newProps;
  }, {});
  return <BaseComponent {...jsProps}/>;
}
