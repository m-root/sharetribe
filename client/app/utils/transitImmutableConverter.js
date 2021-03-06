import transit from 'transit-js';
import Immutable from 'immutable';
import { parse as parseImage } from '../models/ImageModel';

// Outside of this file we should only pass UUID references, no need to export
const UUID = Immutable.Record({ value: '' });
const toUUID = (transitUuid) => new UUID({ value: transitUuid.toString() });

const createReader = function createReader() {
  return transit.reader('json', {
    mapBuilder: {
      init: () => Immutable.Map().asMutable(),
      add: (m, k, v) => m.set(k, v),
      finalize: (m) => m.asImmutable(),
    },
    arrayBuilder: {
      init: () => Immutable.List().asMutable(),
      add: (m, v) => m.push(v),
      finalize: (m) => m.asImmutable(),
    },
    handlers: {
      ':': (rep) => `:${rep}`,
      list: (rep) => Immutable.List(rep).asImmutable(),
      u: toUUID,
      r: (rep) => rep,
      im: parseImage,
    },
  });
};

const createInstance = () => {
  const reader = createReader();
  const fromJSON = (json) => reader.read(json);

  return { fromJSON };
};

export default createInstance();
