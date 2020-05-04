export type State = {
  isUpdating: boolean;
  value?: StateValue;
};
export type StateKey = string | number;
export type StateValue = string | number | boolean;
export type StateUpdater = () => Promise<void>;
