import { createHook } from "overmind-react";
import * as actions from "./actions";
import * as effects from "./effects";
import { onInitialize } from "./onInitialize";
import { state } from "./state";

export const useOvermind = createHook();

export const config = {
  onInitialize,
  state,
  actions,
  effects
};
