import { State as AuthState } from './auth'
import { State as ProfileState } from './profile'
import { State as ScholarsState } from './scholars'
import { State as TeamState } from './team'
import { State as YearsState } from './years'

export interface RootState {
  auth: AuthState,
  profile: ProfileState,
  scholars: ScholarsState,
  team: TeamState,
  years: YearsState
}

export const state = () => ({})
