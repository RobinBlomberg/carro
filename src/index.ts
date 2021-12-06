import { useEffect, useState } from 'react';

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
  [K in string]: (payload: unknown) => void;
};

export type CarroPayload<
  TComputed extends CarroComputed,
  TEffects extends CarroEffects,
  TEvents extends CarroEvents,
  TMethods extends CarroMethods,
  TMutations extends CarroMutations,
  TState extends CarroState,
> = {
  computed: TComputed;
  effects: TEffects;
  events: TEvents;
  methods: TMethods;
  mutations: TMutations;
  state: TState;
};

export type CarroState = {
  [K in string]: unknown;
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
  for (const { dependencies, effect } of payload.effects) {
    useEffect(effect, dependencies);
  }

  return {
    computed: payload.computed,
    events: payload.events,
    methods: payload.methods,
    mutations: payload.mutations,
    state: payload.state,
  };
};

export const useCarroState = <TState extends CarroState>(
  initialState: TState,
) => {
  const [state, originalSetState] = useState(initialState);
  return {
    setState(newState: Partial<TState>) {
      originalSetState({
        ...state,
        newState,
      });
    },
    state,
  };
};
