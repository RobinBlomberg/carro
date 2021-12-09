import { useEffect, useState as reactUseState } from 'react';

export type Carro<
  TComputed extends CarroComputed,
  TEvents extends CarroEvents,
  TMethods extends CarroMethods,
  TMutations extends CarroMutations,
  TState extends CarroState,
> = {
  computed: TComputed;
  events: TEvents;
  methods: TMethods;
  mutations: TMutations;
  state: TState;
};

export type CarroComputed = {
  [K in string]: unknown;
};

export type CarroEffects = {
  dependencies: unknown[];
  effect(): void;
}[];

export type CarroEvents = {
  [K in string]: (event: any) => void;
};

export type CarroMethods = {
  [K in string]: (...args: any[]) => any;
};

export type CarroMutations = {
  [K in string]: (payload: any) => void;
};

export type CarroPayload<
  TComputed extends CarroComputed,
  TEffects extends CarroEffects,
  TEvents extends CarroEvents,
  TMethods extends CarroMethods,
  TMutations extends CarroMutations,
  TState extends CarroState,
> = {
  computed?: TComputed;
  effects?: TEffects;
  events?: TEvents;
  methods?: TMethods;
  mutations?: TMutations;
  state?: TState;
};

export type CarroState = {
  [K in string]: unknown;
};

export const createComponentHook = <
  TParameters extends any[],
  TComputed extends CarroComputed,
  TEffects extends CarroEffects,
  TEvents extends CarroEvents,
  TMethods extends CarroMethods,
  TMutations extends CarroMutations,
  TState extends CarroState,
>(
  hook: (
    ...args: TParameters
  ) => CarroPayload<TComputed, TEffects, TEvents, TMethods, TMutations, TState>,
) => {
  return (...args: TParameters) => {
    return useCarro(hook(...args));
  };
};

export const useCarro = <
  TComputed extends CarroComputed,
  TEffects extends CarroEffects,
  TEvents extends CarroEvents,
  TMethods extends CarroMethods,
  TMutations extends CarroMutations,
  TState extends CarroState,
>(
  payload: CarroPayload<
    TComputed,
    TEffects,
    TEvents,
    TMethods,
    TMutations,
    TState
  >,
): Carro<TComputed, TEvents, TMethods, TMutations, TState> => {
  for (const { dependencies, effect } of payload.effects ?? []) {
    useEffect(effect, dependencies);
  }

  return {
    computed: (payload.computed ?? {}) as TComputed,
    events: (payload.events ?? {}) as TEvents,
    methods: (payload.methods ?? {}) as TMethods,
    mutations: (payload.mutations ?? {}) as TMutations,
    state: (payload.state ?? {}) as TState,
  };
};

export const useState = <TState extends CarroState>(initialState: TState) => {
  const [state, originalSetState] = reactUseState(initialState);

  const setState = (newState: Partial<TState>) => {
    originalSetState({
      ...state,
      ...newState,
    });
  };

  return [state, setState] as const;
};
