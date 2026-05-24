import { Store } from "@tanstack/react-store";

/**********************************************************************************************************
 *   TYPE DEFINITIONS
 **********************************************************************************************************/
export type StoreAction<TState, TArgs extends Array<any> = Array<any>> = {
  readonly handler: (store: Store<TState>, ...args: TArgs) => any;
};

export type GenericStoreAction<TState, TCallback extends (...args: any[]) => any> = {
  readonly genericHandler: (store: Store<TState>) => TCallback;
};

export type Actions<TState> = 
  | StoreAction<TState, any>
  | GenericStoreAction<TState, any>;

export type StoreOptions<TState, TActions extends Record<string, Actions<TState>>> = {
  state: TState;
  actions?: TActions;
};

export type StoreWithActions<TState, TActions extends Record<string, Actions<TState>>> = 
  Store<TState> & { reset: () => void } & {
    [K in keyof TActions]: TActions[K] extends StoreAction<TState, infer TArgs> 
      ? (...args: TArgs) => any
      : TActions[K] extends GenericStoreAction<TState, infer TCallback>
        ? TCallback
        : never;
  };

/***** UTILITY FUNCTIONS *****/
export function createStoreAction<TState, TArgs extends Array<any> = []>(
  handler: (store: Store<TState>, ...args: TArgs) => any
): StoreAction<TState, TArgs> {
  return {
    handler,
  };
}

export function createGenericStoreAction<TState, TCallback extends (...args: any[]) => any>(
  genericHandler: (store: Store<TState>) => TCallback
): GenericStoreAction<TState, TCallback> {
  return {
    genericHandler
  }
}

export function createStore<TState, TActions extends Record<string, Actions<TState>>>(
  options: StoreOptions<TState, TActions>
): StoreWithActions<TState, TActions> {
  const store = new Store(options.state) as StoreWithActions<TState, TActions>;
  
  if (options.actions) {
    for (const [actionName, action] of Object.entries(options.actions)) {
      if ('genericHandler' in action) {
       Object.assign(store, {
          [actionName]: (...args: any[]) => {
            const handler = action.genericHandler(store as any);
            return handler(...args);
          }
        });
        continue;
      }

      if ('handler' in action) {
        Object.assign(store, {
          [actionName]: (...args: any[]) => {
            return (action as StoreAction<TState, any>).handler(store as any, ...args);
          },
        });
        continue;
      }

      throw new Error(`Invalid action definition for ${actionName}. Expected StoreAction<TState, TArgs>`);
    }
  }

  store.reset = () => store.setState(() => options.state as TState);
  
  return store;
}

export function createStoreState<TState>(initialState: TState): TState {
  return initialState;
}
