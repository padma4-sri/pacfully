import { ACTION_RECENT_VIEW_SKU } from "Store/action";


let version = 1;

export const Stores = {
  Users: 'recentUser',
};

export const initDB = () => {
  return new Promise((resolve, reject) => {
    // open the connection
    const request = indexedDB.open('recentDB');

    request.onupgradeneeded = () => {
      const db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.Users)) {
        db.createObjectStore(Stores.Users, { keyPath: 'id' });
      }
      // no need to resolve here
    };

    // request.onsuccess = () => {
    //   const db = request.result;
    //   resolve(true);
    // };

    request.onerror = () => {
      reject(false);
    };
  });
};

export const addData = async (dispatch, storeName, data, maxItems = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      const request = indexedDB.open('recentDB', version);
      request.onsuccess = async () => {
        const db = request.result;
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const getAllRequest = store.getAll();
        await new Promise(resolve => {
          getAllRequest.onsuccess = async () => {
            const allData = getAllRequest.result || [];
            let allDatas = [];
            const duplicateItemIndex = allData.findIndex(item => item?.sku === data.sku);
            const duplicateItem = allData.filter(item => item?.sku === data.sku);
            const lastItemId = allData?.length && allData?.[0]?.id;
            // new data
            if (duplicateItemIndex === -1 && allData.length < maxItems) {
              const addRequest = store.add(data);
              await new Promise(resolve => {
                addRequest.onsuccess = async () => {
                  await new Promise(resolve => {
                    const getAllRequests = store.getAll();
                    getAllRequests.onsuccess = () => {
                      allDatas = getAllRequests.result || [];
                      resolve();
                    };
                  });
                  resolve(data);
                };
                addRequest.onerror = () => {
                  reject(addRequest.error);
                };
              });
            }
             // new and more than 10
             if (duplicateItemIndex === -1 && allData.length === maxItems) {
               const deleteRequest = store.delete(lastItemId);
               deleteRequest.onsuccess = async () => {
                 const addRequest = store.add(data);
                 addRequest.onsuccess = async () => {
                   await new Promise(resolve => {
                     const getAllRequests = store.getAll();
                     getAllRequests.onsuccess = () => {
                       allDatas = getAllRequests.result || [];
                       if (getAllRequests.result.length) {
                         let temp = [];
                         const d = getAllRequests.result.sort((a, b) => new Date(b.id.toString()) - new Date(a.id.toString()));
                         d.forEach(i => {
                           temp.unshift(i.sku);
                         });
                         dispatch(ACTION_RECENT_VIEW_SKU(temp));
                       }
                       resolve();
                     };
                   });
                   resolve(data);
                 };
                 addRequest.onerror = () => {
                   reject(addRequest.error);
                 };
               };
               deleteRequest.onerror = () => {
                 reject('Error deleting last item');
               };
             }
            // duplicats remove
            if (duplicateItemIndex !== -1 && allData.length < maxItems) {
              const deleteRequest = store.delete(duplicateItem?.[0]?.id);
              deleteRequest.onsuccess = async () => {
                const addRequest = store.add(data);
                addRequest.onsuccess = async () => {
                  await new Promise(resolve => {
                    const getAllRequests = store.getAll();
                    getAllRequests.onsuccess = () => {
                      allDatas = getAllRequests.result || [];
                      if (getAllRequests.result.length) {
                        let temp = [];
                        const d = getAllRequests.result.sort((a, b) => new Date(b.id.toString()) - new Date(a.id.toString()));
                        d.forEach(i => {
                          temp.unshift(i.sku);
                        });
                        dispatch(ACTION_RECENT_VIEW_SKU(temp));
                      }
                      resolve();
                    };
                  });
                  resolve(data);
                };
                addRequest.onerror = () => {
                  reject(addRequest.error);
                };
              };
              deleteRequest.onerror = () => {
                reject('Error deleting last item');
              };
            }

            // duplicate and more than 10
            if (allData.length === maxItems && duplicateItemIndex !== -1) {
              const deleteRequest = store.delete(duplicateItem?.[0]?.id);
              deleteRequest.onsuccess = async () => {
                const addRequest = store.add(data);
                addRequest.onsuccess = async () => {
                  await new Promise(resolve => {
                    const getAllRequests = store.getAll();
                    getAllRequests.onsuccess = () => {
                      allDatas = getAllRequests.result || [];
                      if (getAllRequests.result.length) {
                        let temp = [];
                        const d = getAllRequests.result.sort((a, b) => new Date(b.id.toString()) - new Date(a.id.toString()));
                        d.forEach(i => {
                          temp.unshift(i.sku);
                        });
                        dispatch(ACTION_RECENT_VIEW_SKU(temp));
                      }
                      resolve();
                    };
                  });
                  resolve(data);
                };
                addRequest.onerror = () => {
                  reject(addRequest.error);
                };
              };
              deleteRequest.onerror = () => {
                reject('Error deleting last item');
              };
            }
            if (allDatas.length) {
              let temp = [];
              const d = allDatas.sort((a, b) => new Date(b.id.toString()) - new Date(a.id.toString()));
              d.forEach(i => {
                temp.unshift(i.sku);
              });
              dispatch(ACTION_RECENT_VIEW_SKU(temp));
            }
            resolve();
          };
        });
      };

      request.onerror = () => {
        const error = request.error?.message || 'Unknown error';
        reject(error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const handleAddUser = async (dispatch, sku) => {
  if (!sku || sku === null || sku === undefined) {
    return; // Return early if sku is missing or invalid
  }

  const id = Date.now();
  const storeName = 'recentUser';

  try {
    const request = indexedDB.open('recentDB');

    request.onsuccess = async () => {
      const db = request.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const res = store.getAll();

      res.onsuccess = async () => {
        try {
          const allData = res.result || [];
          const count = allData.length > 0 ? allData.length + 1 : 1;
          await addData(dispatch, storeName, { id, sku, count });
          await getStoreData(storeName);
        } catch (err) {
          handleError(err);
        }
      };
    };
  } catch (err) {
    handleError(err);
  }
};

const handleError = (error) => {
  if (error instanceof Error) {
    // Handle error
  } else {
    // Handle generic error
  }
};

export const getStoreData = (storeName) => {
  return new Promise((resolve) => {
    const request = indexedDB.open('recentDB');

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const res = store.getAll();
      res.onsuccess = () => {
        resolve(res.result);
      };
    };
  });
};

