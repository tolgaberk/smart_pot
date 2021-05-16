import addFlower from '../../hooks/add-flower-image';
import addAllInfo from '../../hooks/add_all_info';
import currentFlowerUpdated from '../../hooks/current-flower-updated';
export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [addFlower()],
    get: [addAllInfo()],
    create: [],
    update: [],
    patch: [currentFlowerUpdated()],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
